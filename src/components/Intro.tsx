import React, { useEffect } from 'react';

interface Props {
    onStart: () => void;
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#001699',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    title: {
        fontFamily: 'Oswald, sans-serif',
        fontSize: '12rem',
        color: '#D4AF37',
        // textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
};

const Intro: React.FC<Props> = ({ onStart }) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onStart();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onStart]);

    return (
        <div style={styles.container} onClick={onStart}>
            <div style={styles.title}>neRISKUJ</div>
        </div>
    );
};

export default Intro;
