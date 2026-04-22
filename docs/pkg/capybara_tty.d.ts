/* tslint:disable */
/* eslint-disable */

export class WasmMoveResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly fen: string;
    readonly game_over: boolean;
    readonly outcome: string;
    readonly san: string;
    readonly status: string;
}

export function apply_san_move(fen: string, san: string): WasmMoveResult;

export function difficulty_depth(difficulty: string): number;

export function engine_move(fen: string, depth: number): WasmMoveResult;

export function initial_fen(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmmoveresult_free: (a: number, b: number) => void;
    readonly apply_san_move: (a: number, b: number, c: number, d: number) => number;
    readonly difficulty_depth: (a: number, b: number) => number;
    readonly engine_move: (a: number, b: number, c: number) => number;
    readonly initial_fen: () => [number, number];
    readonly wasmmoveresult_fen: (a: number) => [number, number];
    readonly wasmmoveresult_game_over: (a: number) => number;
    readonly wasmmoveresult_outcome: (a: number) => [number, number];
    readonly wasmmoveresult_san: (a: number) => [number, number];
    readonly wasmmoveresult_status: (a: number) => [number, number];
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
