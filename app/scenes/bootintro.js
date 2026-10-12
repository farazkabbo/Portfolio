// Console start-up animation: a cube tumbles across the screen, leaving blocks
// behind that spell a big "F", then the system name appears. Any key or tap skips it.
import { h, reducedMotion } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { profile } from '../content.js';

const W = 96;
const H = 84;
const CELL = 12;
const ORIGIN = { x: 24, y: 12 };
// The route the cube takes, cell by cell. The last move is a hop from the middle bar back to the stem.
const ROUTE = [[3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [0, 3], [0, 4]];
const NOTES = [523, 587, 659, 784, 698, 784, 880, 988, 880, 1047];
const DROP_MS = 260;
const STEP_MS = 125;
const HOP_MS = 250;
const HOLD_MS = 1500; // how long the finished logo stays up

function block(ctx, x, y, color, light, dark) {
    ctx.fillStyle = color; ctx.fillRect(x, y, CELL, CELL);
    ctx.fillStyle = light; ctx.fillRect(x, y, CELL, 2); ctx.fillRect(x, y, 2, CELL);
    ctx.fillStyle = dark; ctx.fillRect(x, y + CELL - 2, CELL, 2); ctx.fillRect(x + CELL - 2, y, 2, CELL);
}

// Plays the intro inside `host` and calls onDone when it ends or is skipped. Returns a cancel function.
export function playBootIntro(host, onDone) {
    if (reducedMotion()) { onDone(); return () => {}; }

    const cv = h('canvas', { class: 'px boot__screen', width: W, height: H });
    const ctx = cv.getContext('2d');
    const name = h('p', { class: 'boot__name' }, [...'FarazCube'].map((ch, i) => h('span', { style: { animationDelay: `${i * 45}ms` } }, ch)));
    const copy = h('p', { class: 'boot__copy' }, profile.copyright);
    const overlay = h('div', { class: 'boot', role: 'img', 'aria-label': 'FarazCube start-up animation. Press any key to skip.' },
        cv, name, copy, h('p', { class: 'boot__skip', 'aria-hidden': 'true' }, 'press any key to skip'));
    host.append(overlay);

    // when each leg of the route starts
    const starts = [DROP_MS];
    for (let i = 1; i < ROUTE.length; i++) starts.push(starts[i - 1] + (i === ROUTE.length - 2 ? HOP_MS : STEP_MS));
    const builtAt = starts[starts.length - 1] + STEP_MS;
    const px = ([c, r]) => ({ x: ORIGIN.x + c * CELL, y: ORIGIN.y + r * CELL });

    let raf = 0;
    let t0 = 0;
    let played = -1;
    let finished = false;
    const timers = [];

    function frame(now) {
        if (!t0) t0 = now;
        const t = now - t0;
        ctx.clearRect(0, 0, W, H);

        // which leg is the cube on?
        let leg = -1;
        while (leg + 1 < starts.length && t >= starts[leg + 1]) leg++;
        if (leg > played) { played = leg; sfx.marimba(NOTES[leg]); }

        // blocks the cube has already left behind
        const settled = t >= builtAt ? ROUTE.length : leg + 1;
        const flash = t >= builtAt && t < builtAt + 90;
        for (let i = 0; i < settled; i++) {
            const { x, y } = px(ROUTE[i]);
            if (flash) block(ctx, x, y, '#ffffff', '#ffffff', '#ecebdd');
            else if (i === ROUTE.length - 1) block(ctx, x, y, '#f2c66d', '#fff3c4', '#b98a3a');
            else block(ctx, x, y, '#86b0ea', '#c4dbfa', '#5b84c9');
        }

        // the cube itself
        if (t < builtAt) {
            let x, y, angle = 0;
            if (leg < 0) { // falling in from the top
                const k = t / DROP_MS;
                ({ x, y } = px(ROUTE[0]));
                y = -CELL + (y + CELL) * k * k;
            } else {
                const from = px(ROUTE[leg]);
                const to = px(ROUTE[Math.min(leg + 1, ROUTE.length - 1)]);
                const span = (leg + 1 < starts.length ? starts[leg + 1] : builtAt) - starts[leg];
                const k = leg === ROUTE.length - 1 ? 0 : Math.min(1, (t - starts[leg]) / span);
                x = from.x + (to.x - from.x) * k;
                y = from.y + (to.y - from.y) * k;
                const hop = leg === ROUTE.length - 3; // the jump back to the stem
                if (hop) y -= Math.sin(k * Math.PI) * 14;
                angle = k * (hop ? Math.PI : Math.PI / 2) * (to.x < from.x || hop ? -1 : 1);
            }
            ctx.save();
            ctx.translate(Math.round(x) + CELL / 2, Math.round(y) + CELL / 2);
            ctx.rotate(angle);
            block(ctx, -CELL / 2, -CELL / 2, '#f2c66d', '#fff3c4', '#b98a3a');
            ctx.restore();
        }

        if (t >= builtAt && !overlay.classList.contains('is-built')) {
            overlay.classList.add('is-built');
            sfx.chord();
        }
        if (t >= builtAt + HOLD_MS) { finish(); return; }
        raf = requestAnimationFrame(frame);
    }

    function finish() {
        if (finished) return;
        finished = true;
        cancelAnimationFrame(raf);
        window.removeEventListener('keydown', skip, true);
        overlay.removeEventListener('pointerdown', skip);
        overlay.classList.add('is-leaving');
        timers.push(setTimeout(() => overlay.remove(), 320));
        onDone();
    }

    // The key or tap that skips the intro must not also press something in the menu behind it.
    function skip(e) {
        if (e.type === 'keydown' && (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab')) return;
        e.preventDefault();
        e.stopPropagation();
        finish();
    }
    window.addEventListener('keydown', skip, true);
    overlay.addEventListener('pointerdown', skip);
    raf = requestAnimationFrame(frame);

    return () => {
        finished = true;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        window.removeEventListener('keydown', skip, true);
        overlay.remove();
    };
}
