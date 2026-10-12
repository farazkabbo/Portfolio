// Snake. Arrow keys / WASD, swipe, or the on-screen pad.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { C } from '../art/paint.js';

const COLS = 18;
const ROWS = 14;
const CELL = 10;
const KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
};

export function snake(host, { setStatus }) {
    const cv = h('canvas', { class: 'px game__canvas', width: COLS * CELL, height: ROWS * CELL, role: 'img', 'aria-label': 'Snake playfield', tabindex: '0' });
    const ctx = cv.getContext('2d');
    const msg = h('p', { class: 'game__msg', 'aria-live': 'polite' });
    const padBtn = (label, dir) => h('button', { type: 'button', class: `btn btn--small pad--${label}`, 'aria-label': label, onClick: () => turn(dir) }, { up: '▲', down: '▼', left: '◀', right: '▶' }[label]);
    const pad = h('div', { class: 'game__pad' }, padBtn('up', [0, -1]), padBtn('left', [-1, 0]), padBtn('down', [0, 1]), padBtn('right', [1, 0]));
    host.append(cv, msg, pad);

    let body, dir, queued, food, score, timer, over;

    function placeFood() {
        do { food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
        while (body.some((s) => s.x === food.x && s.y === food.y));
    }

    function reset() {
        body = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
        dir = [1, 0];
        queued = [];
        score = 0;
        over = false;
        placeFood();
        msg.textContent = 'Eat the bugs. Do not eat yourself.';
        setStatus('Score 0');
        clearInterval(timer);
        timer = setInterval(tick, 130);
        draw();
    }

    function turn(next) {
        if (over) { reset(); return; }
        const prev = queued.length ? queued[queued.length - 1] : dir;
        if (next[0] === -prev[0] && next[1] === -prev[1]) return; // no reversing into yourself
        if (queued.length < 2) queued.push(next);
    }

    function tick() {
        if (queued.length) dir = queued.shift();
        const head = { x: body[0].x + dir[0], y: body[0].y + dir[1] };
        const crashed = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || body.some((s) => s.x === head.x && s.y === head.y);
        if (crashed) {
            over = true;
            clearInterval(timer);
            sfx.error();
            msg.textContent = `Game over — ${score} point${score === 1 ? '' : 's'}. Press Enter or tap to retry.`;
            return;
        }
        body.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            sfx.coin();
            setStatus(`Score ${score}`);
            placeFood();
        } else body.pop();
        draw();
    }

    function draw() {
        ctx.fillStyle = C.night;
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = C.plum;
        for (let y = 0; y < ROWS; y++) for (let x = (y % 2); x < COLS; x += 2) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        ctx.fillStyle = C.coral;
        ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
        ctx.fillStyle = C.ink;
        ctx.fillRect(food.x * CELL + 4, food.y * CELL + 2, 2, CELL - 4);
        body.forEach((s, i) => {
            ctx.fillStyle = i ? C.mint : C.paper;
            ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
        });
    }

    const onKey = (e) => {
        const next = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
        if (next) { e.preventDefault(); turn(next); }
        else if (over && (e.key === 'Enter' || e.key === ' ') && !e.target.closest?.('button')) { e.preventDefault(); reset(); }
    };
    let touch = null;
    cv.addEventListener('pointerdown', (e) => { touch = { x: e.clientX, y: e.clientY }; if (over) reset(); });
    cv.addEventListener('pointerup', (e) => {
        if (!touch) return;
        const dx = e.clientX - touch.x, dy = e.clientY - touch.y;
        touch = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
        turn(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]);
    });
    window.addEventListener('keydown', onKey);
    reset();
    cv.focus({ preventScroll: true });

    return () => { clearInterval(timer); window.removeEventListener('keydown', onKey); };
}
