import React, { useEffect, useRef } from 'react';

const COLORS = ['#e63946', '#f4a261', '#2a9d8f', '#e9c46a', '#264653', '#a8dadc', '#ffffff', '#f1faee'];
const PARTICLE_COUNT = 220;
const SHOOT_INTERVAL = 1600;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    width: number;
    height: number;
    rotation: number;
    rotationSpeed: number;
    gravity: number;
}

function createBurst(canvas: HTMLCanvasElement): Particle[] {
    const particles: Particle[] = [];
    const originX = Math.random() * canvas.width;
    const originY = canvas.height + 10;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.random() * Math.PI * 0.6) + Math.PI * 0.2; // tighter upward cone
        const speed = 18 + Math.random() * 28;
        particles.push({
            x: originX,
            y: originY,
            vx: Math.cos(Math.PI - angle) * speed,
            vy: -Math.sin(angle) * speed,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            width: 7 + Math.random() * 9,
            height: 4 + Math.random() * 6,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.4,
            gravity: 0.3 + Math.random() * 0.15,
        });
    }
    return particles;
}

const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles: Particle[] = createBurst(canvas);
        let animId: number;

        const shoot = () => {
            particles = particles.concat(createBurst(canvas));
        };

        const interval = setInterval(shoot, SHOOT_INTERVAL);

        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(p => p.y < canvas.height + 40);
            for (const p of particles) {
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                ctx.restore();
            }
            animId = requestAnimationFrame(tick);
        };

        animId = requestAnimationFrame(tick);

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            clearInterval(interval);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 10 }}
        />
    );
};

export default Confetti;
