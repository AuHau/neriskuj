import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { GameData, RoundName, ActiveClue } from '../types';
import JeopardyBoard from './JeopardyBoard';
import FinalJeopardy from './FinalJeopardy';
import Confetti from './Confetti';
import Intro from './Intro';

interface GameState {
    round: RoundName;
    finalIndex: number;
    chosenClues: string[];
    activeClue: ActiveClue | null;
}

const INITIAL_STATE: GameState = {
    round: 'intro',
    finalIndex: 0,
    chosenClues: [],
    activeClue: null,
};

const App: React.FC = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/game.json`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load game.json');
                return res.json();
            })
            .then((data: GameData) => {
                setGameData(data);
                window.history.replaceState(INITIAL_STATE, '');
            })
            .catch(err => setError(err.message));
    }, []);

    const transition = useCallback((next: GameState) => {
        window.history.pushState(next, '');
        setGameState(next);
    }, []);

    useEffect(() => {
        const handler = (e: PopStateEvent) => {
            if (e.state) setGameState(e.state as GameState);
        };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);

    if (error) {
        return (
            <div className="app">
                <div className="app-loading">Error: {error}</div>
            </div>
        );
    }

    if (!gameData) {
        return (
            <div className="app">
                <div className="app-loading">Loading...</div>
            </div>
        );
    }

    if (gameState.round === 'intro') {
        return <Intro onStart={() => transition({ ...gameState, round: 'single' })} />;
    }

    if (gameState.round === 'done') {
        return (
            <div className="app">
                <Confetti />
                <div className="app-done">Gratulujeme!</div>
            </div>
        );
    }

    if (gameState.round === 'final') {
        const finals = gameData.game.final;
        return (
            <div className="app">
                <FinalJeopardy
                    round={finals[gameState.finalIndex]}
                    onFinishGame={() => {
                        if (gameState.finalIndex + 1 < finals.length) {
                            transition({ ...gameState, finalIndex: gameState.finalIndex + 1 });
                        } else {
                            transition({ ...gameState, round: 'done' });
                        }
                    }}
                />
            </div>
        );
    }

    const chosenSet = new Set(gameState.chosenClues);

    return (
        <div className="app">
            <JeopardyBoard
                categories={gameData.game.single}
                chosenClues={chosenSet}
                activeClue={gameState.activeClue}
                onClueOpen={(key, clue) =>
                    transition({
                        ...gameState,
                        chosenClues: [...gameState.chosenClues, key],
                        activeClue: clue,
                    })
                }
                onClueDismiss={() =>
                    transition({ ...gameState, activeClue: null })
                }
                onProceedToFinal={() =>
                    transition({ ...gameState, round: 'final', activeClue: null })
                }
            />
        </div>
    );
};

export default App;
