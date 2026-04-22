# PRD: Capybara-TTY (Plataforma de Xadrez Educacional Minimalista)

### 1. Visão Geral do Produto
Um aplicativo web progressivo (PWA) de xadrez focado em ensino, projetado com uma estética inspirada em interfaces de terminal (TUI) para minimizar distrações. O sistema oferece flexibilidade de interação, permitindo desde o jogo casual na tela até um modo opcional focado na sincronia com um tabuleiro físico. O grande diferencial é a presença de um sistema tutor matemático (totalmente controlável/opcional) e de um motor de xadrez customizado, leve o suficiente para rodar em qualquer dispositivo (incluindo Smart TVs mais antigas).

### 2. Arquitetura Técnica
* **Front-end:** HTML, CSS e JavaScript. O design simulará um terminal clássico (fundo escuro, fontes monoespaçadas para os menus, painéis delimitados por linhas simples).
* **Core Lógico:** Rust compilado para WebAssembly (Wasm) para gerenciar o estado da partida, histórico de lances e a lógica do sistema tutor.
* **Sistema Dual de Chess Engine:**
    * **Engine Customizada (Principal):** Uma engine simples desenvolvida do zero, focada em ser extremamente leve e didática, ideal para rodar em processadores fracos e para o aprendizado de algoritmos (Minimax, avaliação básica).
    * **Stockfish.wasm (Opcional):** Integrado para análises profundas ou quando o usuário quiser enfrentar um nível de dificuldade muito alto, ativável sob demanda.
* **Distribuição:** PWA, executável offline em tablets, PCs e navegadores de Smart TVs.

### 3. Interface e Usabilidade (UI/UX)
* **Layout Inspirado em TUI:**
    * **Área Esquerda:** Tabuleiro de xadrez em tamanho destacado (podendo usar peças pixeladas ou vetoriais minimalistas).
    * **Área Direita:** Painel vertical dividido em blocos: Input de comandos, Histórico de Lances (formato PGN listado turno a turno) e Vantagem de Material.
* **Sistemas de Input Flexíveis:**
    * **Teclado PGN Virtual:** Um teclado customizado na tela (apenas com letras, números e peças) que pode ser ativado ou desativado (checkbox) pelo usuário.
    * **Suporte a Teclado Físico:** Captura nativa de digitação para reproduzir a sensação de terminal.
    * **Toque/Mouse:** Movimentação tradicional de arrastar e soltar (ativada por padrão, mas substituível pelo modo PGN).

### 4. Modos de Jogo e Interação
* **Modo Padrão:** Jogo direto contra a engine customizada na tela do dispositivo.
* **Modo Físico (Opcional):** Ao ser ativado, o jogo passa a exigir confirmação de que os lances do computador foram replicados no tabuleiro de madeira do usuário, pausando a partida até que um botão de "Sincronizado/Pronto" seja acionado.

### 5. O Sistema Tutor (Fase 1 - MVP Determinístico)
O tutor atua como um guia estrutural e matemático, registrando seus avisos no console lateral da interface. **Todo o sistema tutor é modular e opcional (ativável/desativável via interface), permitindo o jogo livre sem interrupções quando desejado.** Quando ativado, ele engloba:
* **Aberturas:** Validação de lances contra um livro de aberturas (ECO), avisando quando o jogador segue a teoria ou quando desvia dela.
* **Meio-jogo (Escudo de Blunders):** Monitoramento contínuo da avaliação (score) da engine customizada. Se o jogador fizer um lance que derrube drasticamente a pontuação (entregando material), o tutor pausa e sugere revisão.
* **Finais e Padrões:** Reconhecimento de posições de mate básico (ex: mate de escadinha com duas torres) para guiar o fechamento da partida.
* **Movimentos Especiais:** Avisos didáticos na tela sempre que ocorrer um Roque (Curto/Longo), *En Passant* ou Promoção de Peão.
* **Simulação de Partidas Históricas:** Um modo onde o usuário pode jogar pelo lado de um mestre em partidas famosas (ex: Kasparov vs Mundo). O tutor avalia se o lance escolhido pelo usuário bate com o lance histórico e explica a diferença de pontuação caso não bata.

### 6. Roadmap Futuro (Fase 2 - LLM Pedagógico)
* **Integração de LLM Educacional:** Conexão com uma API de IA (ex: Gemini). O LLM não calculará as jogadas, mas receberá os dados matemáticos da engine customizada e do tutor determinístico para traduzir números em conceitos lúdicos. Ele explicará *por que* um lance perdeu 3 pontos de vantagem ou *por que* o domínio do centro na abertura Kasparoviana funcionou, agindo como um professor particular interagindo pelo console.