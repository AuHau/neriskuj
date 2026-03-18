import React, { useEffect, useCallback } from 'react';
import './JeopardyBoard.css';
import { Category, Clue, ActiveClue } from '../types';

interface Props {
    categories: Category[];
    chosenClues: Set<string>;
    activeClue: ActiveClue | null;
    onClueOpen: (key: string, clue: ActiveClue) => void;
    onClueDismiss: () => void;
    onProceedToFinal: () => void;
}

const clueKey = (categoryIndex: number, clueIndex: number) =>
    `${categoryIndex}-${clueIndex}`;

const JeopardyBoard: React.FC<Props> = ({
    categories,
    chosenClues,
    activeClue,
    onClueOpen,
    onClueDismiss,
    onProceedToFinal,
}) => {
    const totalClues = categories.reduce((sum, cat) => sum + cat.clues.length, 0);
    const allChosen = chosenClues.size >= totalClues;

    const showClue = (category: string, clue: Clue, categoryIndex: number, clueIndex: number) => {
        const key = clueKey(categoryIndex, clueIndex);
        if (chosenClues.has(key)) return;
        onClueOpen(key, { category, value: clue.value, clue: clue.clue });
    };

    const dismissClue = useCallback(() => {
        onClueDismiss();
    }, [onClueDismiss]);

    useEffect(() => {
        if (!activeClue) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                dismissClue();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [activeClue, dismissClue]);

    return (
        <div className="jeopardy-board">
            {activeClue && (
                <div className="clue-overlay" onClick={dismissClue}>
                    <div className="clue-label">
                        {activeClue.category} - {activeClue.value} Kč
                    </div>
                    <div className="clue-text">{activeClue.clue}</div>
                </div>
            )}
            <div className="board-grid">
                {categories.map((cat, catIdx) => (
                    <div key={catIdx} className="board-column">
                        <div className="board-cell">
                            <span className="category-name">{cat.category}</span>
                        </div>
                        {[...cat.clues].sort((a, b) => a.value - b.value).map((clue, clueIdx) => {
                            const key = clueKey(catIdx, clueIdx);
                            const chosen = chosenClues.has(key);
                            return (
                                <div
                                    key={clueIdx}
                                    className={`board-cell${chosen ? ' chosen' : ''}`}
                                    onClick={() => showClue(cat.category, clue, catIdx, clueIdx)}
                                >
                                    <span className="clue-value">{clue.value} Kč</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {allChosen && (
                <button className="proceed-button" onClick={onProceedToFinal}>
                    Jdeme na finální otázku
                </button>
            )}
        </div>
    );
};

export default JeopardyBoard;
