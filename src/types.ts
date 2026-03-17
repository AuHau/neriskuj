export interface Clue {
    value: number;
    clue: string;
    solution?: string;
}

export interface Category {
    category: string;
    clues: Clue[];
}

export interface FinalRound {
    category: string;
    clue: string;
    solution?: string;
}

export interface Game {
    single: Category[];
    final: FinalRound;
}

export interface GameData {
    game: Game;
}

export type RoundName = "single" | "final" | "done";
