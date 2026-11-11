import { useEffect, useRef } from 'react';

interface EchoHeroBackgroundProps {
  sourceX?: number;
  sourceY?: number;
  interval?: number;
}

const VIOLET = [124, 58, 237];
const CYAN = [6, 182, 212];
const LIFE = 6000;
const MOBILE_BREAKPOINT = 768;

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export default function EchoHeroBackground({
  sourceX = 0.72,
  sourceY = 0.5,
  interval = 1100,
}: EchoHeroBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let SX = sourceX;
    let SY = sourceY;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let ripples: { born: number }[] = [];
    let dots: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastSpawn = 0;
    let running = false;
    let inView = false;
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = root.clientWidth;
      h = root.clientHeight;
      const mobile = w < MOBILE_BREAKPOINT;
      SX = mobile ? 0.68 : sourceX;
      SY = mobile ? 0.13 : sourceY;
      root.style.setProperty('--sx', String(SX));
      root.style.setProperty('--sy', String(SY));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 22000);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: -0.05 - Math.random() * 0.15,
        vy: (Math.random() - 0.5) * 0.06,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.5 + 0.15,
      }));
    };

    // Rounded chevron "<" like the Echo mark: vertex at (vx, cy), 45-degree arms of half-height s.
    const chevron = (vx: number, cy: number, s: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(vx + s, cy - s);
      ctx.arcTo(vx, cy, vx + s, cy + s, Math.min(r, s * 0.9));
      ctx.lineTo(vx + s, cy + s);
      ctx.stroke();
    };

    const geo = () => {
      const u = Math.min(w, h) * (w < MOBILE_BREAKPOINT ? 0.07 : 0.05);
      return { V: w * SX + mouse.x * 18, cy: h * SY + mouse.y * 14, u, r0: u * 0.35 };
    };

    const nested = (V: number, u: number, r0: number, off: number) => ({
      vx: V - off,
      s: u + off * 0.9,
      r: r0 + off,
    });

    const drawStatic = (t: number) => {
      const { V, cy, u, r0 } = geo();
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(3, u * 0.26);
      ctx.shadowColor = 'rgba(124,58,237,0.9)';
      ctx.shadowBlur = 20;
      for (let k = 0; k < 3; k++) {
        const pulse = 0.7 + 0.3 * Math.sin(t / 700 - k * 0.9);
        ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
        const c = nested(V, u, r0, k * u);
        chevron(c.vx, cy, c.s, c.r);
      }
      ctx.shadowBlur = 0;
    };

    const drawStill = () => {
      ctx.clearRect(0, 0, w, h);
      const { V, cy, u, r0 } = geo();
      ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const c = nested(V, u, r0, u * 3 + i * u * 3);
        ctx.strokeStyle = `rgba(124,58,237,${0.45 - i * 0.08})`;
        ctx.lineWidth = 2.5;
        chevron(c.vx, cy, c.s, c.r);
      }
      drawStatic(0);
    };

    const loop = (t: number) => {
      if (!running) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -5) {
          d.x = w + 5;
          d.y = Math.random() * h;
        }
        ctx.fillStyle = `rgba(200,190,255,${d.a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t - lastSpawn > interval) {
        ripples.push({ born: t });
        lastSpawn = t;
      }
      ripples = ripples.filter((r) => t - r.born < LIFE);

      const { V, cy, u, r0 } = geo();
      const maxOff = Math.hypot(w, h) * 0.9;
      ctx.lineCap = 'round';
      for (const r of ripples) {
        const p = (t - r.born) / LIFE;
        const ease = 1 - Math.pow(1 - p, 2.2);
        const c = nested(V, u, r0, u * 3 + maxOff * ease);
        const [cr, cg, cb] = mix(VIOLET, CYAN, Math.min(1, p * 1.4));
        const alpha = Math.max(0, (1 - p) * 0.55) * Math.min(1, p * 8);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.lineWidth = 2.5 + (1 - p) * 3;
        chevron(c.vx, cy, c.s, c.r);
      }

      drawStatic(t);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (inView && !running) startLoop();
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) drawStill();
    });
    resizeObserver.observe(root);

    if (reduced) {
      drawStill();
      return () => resizeObserver.disconnect();
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden && !running) startLoop();
      if (!inView) stopLoop();
    });
    intersectionObserver.observe(root);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [sourceX, sourceY, interval]);

  return (
    <div ref={rootRef} className="echo-hero-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="echo-hero-glow" />
    </div>
  );
}
