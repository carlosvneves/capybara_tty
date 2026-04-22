let wasmBindings = null;

const PIECES_UNICODE = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const PIECES_ASCII = {
  K: "K",
  Q: "Q",
  R: "R",
  B: "B",
  N: "N",
  P: "P",
  k: "k",
  q: "q",
  r: "r",
  b: "b",
  n: "n",
  p: "p",
};

const TIME_CONTROLS = [
  "UltraBullet",
  "Bullet",
  "Blitz",
  "Rapid",
  "Classical",
  "No clock",
  "Custom",
];

const EMBEDDED_DEPTH_BY_DIFFICULTY = {
  Easy: 1,
  Medium: 3,
  Hard: 5,
};

const CONFIG_SCHEMA = [
  { key: "engine", label: "Engine", values: ["Embedded", "Stockfish"] },
  { key: "timeControl", label: "Time Control", values: TIME_CONTROLS },
  { key: "color", label: "Play as", values: ["White", "Black"] },
  { key: "difficulty", label: "Difficulty", values: ["Easy", "Medium", "Hard"] },
  { key: "tutorMode", label: "Tutor Mode", values: ["Off", "On"] },
  { key: "physicalMode", label: "Physical Board", values: ["Off", "On"] },
  { key: "pieceMode", label: "Pieces", values: ["Unicode", "ASCII"] },
];

const MINUTES_BY_CONTROL = {
  UltraBullet: 1,
  Bullet: 2,
  Blitz: 5,
  Rapid: 10,
  Classical: 30,
};

const state = {
  ready: false,
  gameState: "pre-config",
  fen: "",
  moveHistory: [],
  pgnMoves: [],
  panelOpen: { history: true, pgn: true, material: true },
  waitingPhysicalResume: false,
  selectedConfigIndex: 0,
  config: {
    engine: "Embedded",
    timeControl: "No clock",
    color: "White",
    difficulty: "Easy",
    tutorMode: "Off",
    physicalMode: "Off",
    pieceMode: "Unicode",
    customMinutes: 15,
  },
  clock: {
    enabled: true,
    whiteMs: 0,
    blackMs: 0,
    activeColor: "White",
    startedAt: null,
  },
};

const dom = {};

function queryDom() {
  dom.configMenu = document.getElementById("config-menu");
  dom.configOptions = document.getElementById("config-options");
  dom.configHint = document.querySelector(".config-hint");
  dom.startGameBtn = document.getElementById("start-game-btn");
  dom.gameShell = document.getElementById("game-shell");
  dom.board = document.getElementById("board");
  dom.syncIndicator = document.getElementById("sync-indicator");
  dom.banner = document.getElementById("game-over-banner");
  dom.cmdInput = document.getElementById("cmd-input");
  dom.moveHistory = document.getElementById("move-history");
  dom.pgnText = document.getElementById("pgn-text");
  dom.materialText = document.getElementById("material-text");
  dom.clockBox = document.getElementById("clock-box");
  dom.clockText = document.getElementById("clock-text");
  dom.panelToggle = document.getElementById("panel-toggle");
  dom.panelHistory = document.getElementById("panel-history");
  dom.panelPgn = document.getElementById("panel-pgn");
  dom.panelMaterial = document.getElementById("panel-material");
}

async function loadWasmBindings() {
  const candidates = ["../pkg/capybara_tty.js", "./pkg/capybara_tty.js"];
  let lastError;
  for (const path of candidates) {
    try {
      const module = await import(path);
      await module.default();
      return module;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Unable to load WebAssembly bindings.");
}

function wasmApi() {
  if (!wasmBindings) {
    throw new Error("WASM not initialized.");
  }
  return wasmBindings;
}

function showBootError(error) {
  const message = "UI bootstrap failed: WebAssembly module did not load.";
  dom.configMenu.classList.remove("hidden");
  dom.gameShell.classList.add("hidden");
  dom.configOptions.innerHTML = "";
  const line = document.createElement("div");
  line.className = "option active";
  line.textContent = message;
  dom.configOptions.appendChild(line);
  if (dom.configHint) {
    dom.configHint.textContent = "Check devtools/network and confirm pkg path is being served.";
  }
  if (dom.startGameBtn) {
    dom.startGameBtn.disabled = true;
    dom.startGameBtn.textContent = "Start Unavailable";
  }
  // eslint-disable-next-line no-console
  console.error(message, error);
}

function parseBoardFromFen(fen) {
  const boardPart = typeof fen === "string" ? fen.split(" ")[0] : "";
  const ranks = boardPart.split("/").slice(0, 8);
  const board = [];

  for (let rank = 0; rank < 8; rank += 1) {
    const rankText = ranks[rank] || "8";
    const row = [];
    for (const char of rankText) {
      if (/[1-8]/.test(char)) {
        const count = Number(char);
        for (let i = 0; i < count; i += 1) row.push(".");
      } else if (/[prnbqkPRNBQK]/.test(char)) {
        row.push(char);
      }
      if (row.length >= 8) break;
    }
    while (row.length < 8) row.push(".");
    board.push(row.slice(0, 8));
  }

  return board;
}

function pieceGlyph(piece) {
  if (piece === ".") return "";
  if (state.config.pieceMode === "ASCII") return PIECES_ASCII[piece] || piece;
  return PIECES_UNICODE[piece] || piece;
}

function renderBoard() {
  const rows = parseBoardFromFen(state.fen);
  const grid = document.createElement("div");
  grid.className = "board-grid";
  rows.forEach((row, rank) => {
    row.forEach((piece, file) => {
      const cell = document.createElement("div");
      cell.className = `board-square ${(rank + file) % 2 === 0 ? "square-light" : "square-dark"}`;
      cell.textContent = pieceGlyph(piece) || "\u00A0";
      grid.appendChild(cell);
    });
  });
  dom.board.replaceChildren(grid);
}

function materialFromFen() {
  const fenBoard = state.fen.split(" ")[0];
  const points = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  let white = 0;
  let black = 0;
  for (const ch of fenBoard) {
    const lower = ch.toLowerCase();
    if (!points[lower]) continue;
    if (ch === lower) black += points[lower];
    else white += points[lower];
  }
  const diff = white - black;
  if (diff === 0) return "Even";
  if (diff > 0) return `White +${diff}`;
  return `Black +${Math.abs(diff)}`;
}

function renderHistory() {
  if (state.moveHistory.length === 0) {
    dom.moveHistory.textContent = "No moves yet";
    dom.pgnText.textContent = "Game not started";
    return;
  }
  dom.moveHistory.textContent = state.moveHistory.join(" ");
  dom.pgnText.textContent = state.pgnMoves.join(" ");
}

function renderMaterial() {
  dom.materialText.textContent = materialFromFen();
}

function msToClock(ms) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateClockVisual() {
  if (!state.clock.enabled) {
    dom.clockBox.classList.add("hidden");
    return;
  }
  dom.clockBox.classList.remove("hidden");
  dom.clockText.textContent = `W ${msToClock(state.clock.whiteMs)} / B ${msToClock(state.clock.blackMs)}`;
}

function stopClock() {
  if (!state.clock.enabled || !state.clock.startedAt) return;
  const elapsed = Date.now() - state.clock.startedAt;
  if (state.clock.activeColor === "White") state.clock.whiteMs -= elapsed;
  else state.clock.blackMs -= elapsed;
  state.clock.startedAt = null;
}

function startClockFor(color) {
  if (!state.clock.enabled) return;
  state.clock.activeColor = color;
  state.clock.startedAt = Date.now();
}

function checkTimeout() {
  if (!state.clock.enabled) return;
  if (state.clock.whiteMs <= 0) {
    endGame("Black wins (timeout).");
  } else if (state.clock.blackMs <= 0) {
    endGame("White wins (timeout).");
  }
}

function renderPanels() {
  dom.panelHistory.classList.toggle("hidden", !state.panelOpen.history);
  dom.panelPgn.classList.toggle("hidden", !state.panelOpen.pgn);
  dom.panelMaterial.classList.toggle("hidden", !state.panelOpen.material);
}

function renderConfigMenu() {
  dom.configOptions.innerHTML = "";
  CONFIG_SCHEMA.forEach((entry, index) => {
    const current = state.config[entry.key];
    const option = document.createElement("button");
    option.type = "button";
    option.className = `option${state.selectedConfigIndex === index ? " active" : ""}`;
    option.dataset.index = String(index);
    let value = current;
    if (entry.key === "timeControl" && current === "Custom") {
      value = `Custom (${state.config.customMinutes} min)`;
    }
    option.textContent = `${state.selectedConfigIndex === index ? ">" : " "} ${entry.label}: ← ${value} →`;
    dom.configOptions.appendChild(option);
  });
}

function showConfig() {
  state.gameState = "pre-config";
  dom.configMenu.classList.remove("hidden");
  dom.gameShell.classList.add("hidden");
  dom.banner.classList.add("hidden");
  renderConfigMenu();
}

function setupClock() {
  const selected = state.config.timeControl;
  if (selected === "No clock") {
    state.clock.enabled = false;
    updateClockVisual();
    return;
  }
  state.clock.enabled = true;
  const minutes = selected === "Custom" ? state.config.customMinutes : MINUTES_BY_CONTROL[selected];
  const ms = minutes * 60 * 1000;
  state.clock.whiteMs = ms;
  state.clock.blackMs = ms;
  state.clock.startedAt = null;
}

function startGame() {
  state.gameState = "playing";
  state.waitingPhysicalResume = false;
  state.moveHistory = [];
  state.pgnMoves = [];
  state.fen = wasmApi().initial_fen();
  setupClock();
  startClockFor(state.config.color === "White" ? "White" : "Black");
  dom.configMenu.classList.add("hidden");
  dom.gameShell.classList.remove("hidden");
  dom.syncIndicator.classList.add("hidden");
  dom.banner.classList.add("hidden");
  dom.cmdInput.value = "";
  dom.cmdInput.focus();
  renderAll();
}

function endGame(message) {
  stopClock();
  state.gameState = "ended";
  state.waitingPhysicalResume = false;
  dom.syncIndicator.classList.add("hidden");
  dom.banner.textContent = `${message} Press Enter or type new for new game.`;
  dom.banner.classList.remove("hidden");
}

function applyPlayerMove(input) {
  if (state.gameState === "ended") {
    if (input === "new" || input === "") showConfig();
    return;
  }
  if (input === "resign") {
    endGame(`${state.config.color} resigned.`);
    dom.cmdInput.value = "";
    return;
  }

  stopClock();
  const before = state.fen;
  const result = wasmApi().apply_san_move(before, input);
  if (result.status.startsWith("invalid")) {
    state.fen = before;
    dom.cmdInput.value = "";
    dom.cmdInput.classList.add("invalid");
    return;
  }

  state.fen = result.fen;
  state.pgnMoves.push(result.san);
  state.moveHistory.push(result.san);
  if (result.game_over) {
    endGame(result.outcome || "Game over.");
    renderAll();
    return;
  }

  if (state.config.engine === "Embedded") {
    const depth = EMBEDDED_DEPTH_BY_DIFFICULTY[state.config.difficulty] ?? 1;
    const botResult = wasmApi().engine_move(state.fen, depth);
    if (botResult.status === "applied") {
      state.fen = botResult.fen;
      state.pgnMoves.push(botResult.san);
      state.moveHistory.push(botResult.san);
    }
    if (botResult.game_over) {
      endGame(botResult.outcome || "Game over.");
      renderAll();
      return;
    }
    if (state.config.physicalMode === "On") {
      state.waitingPhysicalResume = true;
      dom.syncIndicator.classList.remove("hidden");
    } else {
      startClockFor(state.config.color);
    }
  } else {
    startClockFor(state.config.color);
  }
  renderAll();
}

function renderAll() {
  renderBoard();
  renderHistory();
  renderMaterial();
  updateClockVisual();
  renderPanels();
}

function applyConfigShift(direction) {
  const entry = CONFIG_SCHEMA[state.selectedConfigIndex];
  if (entry.key === "timeControl" && state.config.timeControl === "Custom" && entry.values.includes("Custom")) {
    state.config.timeControl = "Custom";
  }
  const currentIndex = entry.values.indexOf(state.config[entry.key]);
  const size = entry.values.length;
  const next = (currentIndex + direction + size) % size;
  state.config[entry.key] = entry.values[next];
}

function handleConfigKey(event) {
  if (event.key === "ArrowUp") {
    state.selectedConfigIndex = (state.selectedConfigIndex - 1 + CONFIG_SCHEMA.length) % CONFIG_SCHEMA.length;
    renderConfigMenu();
    return;
  }
  if (event.key === "ArrowDown") {
    state.selectedConfigIndex = (state.selectedConfigIndex + 1) % CONFIG_SCHEMA.length;
    renderConfigMenu();
    return;
  }
  if (event.key === "ArrowLeft") {
    applyConfigShift(-1);
    renderConfigMenu();
    return;
  }
  if (event.key === "ArrowRight") {
    applyConfigShift(1);
    renderConfigMenu();
    return;
  }
  if (event.key === "Enter") {
    startGame();
    return;
  }
}

function initKeybindings() {
  document.addEventListener("keydown", (event) => {
    if (!state.ready) return;

    if (state.gameState === "pre-config") {
      event.preventDefault();
      handleConfigKey(event);
      return;
    }

    if (state.waitingPhysicalResume) {
      if (event.key === " ") {
        state.waitingPhysicalResume = false;
        dom.syncIndicator.classList.add("hidden");
        startClockFor(state.config.color);
      }
      event.preventDefault();
      return;
    }

    if (["h", "H"].includes(event.key)) {
      state.panelOpen.history = !state.panelOpen.history;
      renderPanels();
      return;
    }
    if (["p", "P"].includes(event.key)) {
      state.panelOpen.pgn = !state.panelOpen.pgn;
      renderPanels();
      return;
    }
    if (["m", "M"].includes(event.key)) {
      state.panelOpen.material = !state.panelOpen.material;
      renderPanels();
      return;
    }

    if (state.gameState === "ended" && event.key === "Enter") {
      showConfig();
      return;
    }

    if (document.activeElement !== dom.cmdInput && event.key.length === 1) {
      dom.cmdInput.focus();
    }
  });

  dom.cmdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyPlayerMove(dom.cmdInput.value.trim());
      dom.cmdInput.value = "";
    } else {
      dom.cmdInput.classList.remove("invalid");
    }
  });

  dom.panelToggle.addEventListener("click", () => {
    state.panelOpen.history = !state.panelOpen.history;
    state.panelOpen.pgn = !state.panelOpen.pgn;
    state.panelOpen.material = !state.panelOpen.material;
    renderPanels();
  });

  dom.configOptions.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const option = target.closest(".option");
    if (!option) return;
    const index = Number(option.dataset.index);
    if (Number.isNaN(index)) return;
    state.selectedConfigIndex = index;
    applyConfigShift(1);
    renderConfigMenu();
  });

  dom.startGameBtn.addEventListener("click", () => {
    startGame();
  });
}

function installClockTicker() {
  window.setInterval(() => {
    if (!state.clock.enabled || !state.clock.startedAt || state.gameState !== "playing") return;
    stopClock();
    checkTimeout();
    startClockFor(state.clock.activeColor);
    updateClockVisual();
  }, 250);
}

async function bootstrap() {
  queryDom();
  try {
    wasmBindings = await loadWasmBindings();
  } catch (error) {
    showBootError(error);
    return;
  }
  state.fen = wasmApi().initial_fen();
  state.ready = true;
  initKeybindings();
  installClockTicker();
  showConfig();
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
});
