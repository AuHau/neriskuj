import React, { useState, useEffect, useCallback } from 'react';
import { FinalRound } from '../types';

interface Props {
    round: FinalRound;
    onFinishGame: () => void;
}

type Phase = 'category' | 'clue';

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#001699',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '40px',
        boxSizing: 'border-box',
    },
    label: {
        fontFamily: 'Oswald, sans-serif',
        fontSize: '4.5rem',
        color: '#D4AF37',
        marginBottom: '32px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
    },
    category: {
        fontFamily: 'Oswald, sans-serif',
        fontSize: '6rem',
        color: '#fff',
        textAlign: 'center' as const,
        textTransform: 'uppercase' as const,
    },
    clue: {
        fontFamily: 'Lora, serif',
        fontSize: '3.3rem',
        color: '#fff',
        textAlign: 'center' as const,
        lineHeight: 1.4,
        maxWidth: '900px',
    },
};

const FinalJeopardy: React.FC<Props> = ({ round, onFinishGame }) => {
    const [phase, setPhase] = useState<Phase>('category');

    const advance = useCallback(() => {
        if (phase === 'category') {
            setPhase('clue');
        } else {
            onFinishGame();
        }
    }, [phase, onFinishGame]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                advance();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [advance]);

    return (
        <div style={styles.container} onClick={advance}>
            <div style={styles.label}>{round.category}</div>
            {phase === 'category' ? (
                <div style={styles.category}>Jdeme do finále</div>
            ) : (
                <div style={{ ...styles.clue, ...(round.clueSize ? { fontSize: round.clueSize } : {}) }}>{round.clue}</div>
            )}
        </div>
    );
};

export default FinalJeopardy;
