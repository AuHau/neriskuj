import React, { useState, useEffect } from 'react';
import './App.css';
import { GameData, RoundName } from '../types';
import JeopardyBoard from './JeopardyBoard';
import FinalJeopardy from './FinalJeopardy';

const App: React.FC = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [round, setRound] = useState<RoundName>("single");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/game.json`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load game.json');
                return res.json();
            })
            .then((data: GameData) => setGameData(data))
            .catch(err => setError(err.message));
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

    if (round === "done") {
        return (
            <div className="app">
                <div className="app-done">Game Over</div>
            </div>
        );
    }

    if (round === "final") {
        return (
            <div className="app">
                <FinalJeopardy
                    round={gameData.game.final}
                    onFinishGame={() => setRound("done")}
                />
            </div>
        );
    }

    return (
        <div className="app">
            <JeopardyBoard
                categories={gameData.game.single}
                onProceedToFinal={() => setRound("final")}
            />
        </div>
    );
};

export default App;
