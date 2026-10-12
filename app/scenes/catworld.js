// The secret cat world. Five cats sit on a hill under a cat-eared moon and
// each one meows a note. Free play, or repeat their melody in the Meow Choir.
import { h, announce } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { hud } from '../core/hud.js';
import { award } from '../core/progress.js';
import { makeCanvas, painter } from '../art/paint.js';
import { drawCatFront, drawPlayer, LOOK, CAT_TUX, CAT_ORANGE, CAT_GREY, CAT_WHITE, CAT_SIAMESE } from '../art/sprites.js';

const W = 224;
const H = 176;
const ROUNDS = 5;
const CATS = [
    { name: 'Tux', palette: CAT_TUX, hz: 523, x: 16, y: 86 },
    { name: 'Mango', palette: CAT_ORANGE, hz: 587, x: 56, y: 76 },
    { name: 'Ash', palette: CAT_GREY, hz: 659, x: 96, y: 72 },
    { name: 'Snow', palette: CAT_WHITE, hz: 784, x: 136, y: 76 },
    { name: 'Mocha', palette: CAT_SIAMESE, hz: 880, x: 176, y: 86 },
];

function drawBackdrop(ctx) {
    const p = painter(ctx);
    ['#1b1440', '#241b55', '#32266f', '#463189', '#6a4fa0', '#9a62a8', '#c97aa8'].forEach((c, i) => p(c, 0, i * 16, W, 16));
    // cat-eared moon
    p('#f2ecc4', 170, 14, 24, 24); p('#f2ecc4', 168, 18, 28, 16); p('#f2ecc4', 174, 12, 16, 28);
    p('#f2ecc4', 169, 8, 7, 8); p('#f2ecc4', 188, 8, 7, 8); p('#e8747c', 171, 11, 3, 4); p('#e8747c', 190, 11, 3, 4);
    p('#d9d0a0', 177, 22, 3, 4); p('#d9d0a0', 185, 22, 3, 4); p('#e8747c', 181, 28, 2, 1); p('#d9d0a0', 178, 30, 8, 1);
    // fish-shaped clouds
    [[22, 26], [104, 16], [60, 46]].forEach(([x, y]) => {
        p('rgba(236,235,221,0.35)', x, y, 16, 6); p('rgba(236,235,221,0.35)', x + 2, y - 2, 12, 10);
        p('rgba(236,235,221,0.35)', x + 16, y - 2, 3, 10); p('rgba(236,235,221,0.35)', x + 19, y - 4, 2, 14);
        p('#1b1440', x + 3, y + 1, 1, 1);
    });
    // the hill
    for (let x = 0; x < W; x++) {
        const top = Math.round(104 + ((x - 112) * (x - 112)) / 640);
        p('#2f7a5d', x, top, 1, H - top);
        p('#7fd6b6', x, top, 1, 1);
        if (x % 7 === 3) p('#3f9c78', x, top + 6 + (x % 5), 1, 3);
    }
    p('#256349', 0, 150, W, 26); p('#1e5440', 0, 164, W, 12);
    // flowers, a ball of yarn and a fish bone
    [[30, 140], [78, 134], [150, 136], [196, 142], [118, 148]].forEach(([x, y], i) => {
        p(['#e8747c', '#f2c66d', '#ecebdd', '#86b0ea', '#e8747c'][i], x, y, 3, 3); p('#f2c66d', x + 1, y + 1, 1, 1); p('#7fd6b6', x + 1, y + 3, 1, 3);
    });
    p('#e8747c', 12, 150, 12, 12); p('#e8747c', 10, 153, 16, 6); p('#c4525c', 13, 154, 10, 1); p('#c4525c', 15, 151, 1, 10); p('#c4525c', 20, 151, 1, 10);
    p('#e8747c', 26, 160, 8, 1); p('#e8747c', 33, 158, 1, 3);
    p('#ecebdd', 190, 158, 14, 1); p('#ecebdd', 192, 156, 1, 5); p('#ecebdd', 195, 156, 1, 5); p('#ecebdd', 198, 156, 1, 5);
    p('#ecebdd', 204, 156, 3, 5); p('#ecebdd', 187, 156, 3, 2); p('#ecebdd', 187, 159, 3, 2);
}

const STARS = Array.from({ length: 34 }, (_, i) => [(i * 67) % W, (i * 29) % 78, i]);

export function catworld(root, { go }) {
    const cv = makeCanvas(W, H);
    cv.className = 'px catworld__canvas';
    const ctx = cv.getContext('2d');
    const bg = makeCanvas(W, H);
    drawBackdrop(bg.getContext('2d'));

    const singUntil = CATS.map(() => 0);
    const notes = []; // floating music notes / hearts: { x, y, born, color }
    const timers = [];
    let phase = 'free'; // 'free' | 'show' | 'input' | 'won'
    let sequence = [];
    let cursor = 0;
    let round = 0;
    let raf = 0;

    const status = h('p', { class: 'catworld__status', 'aria-live': 'polite' }, 'Meow! Tap a cat to make it sing.');
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const say = (text) => { status.textContent = text; };

    function sing(i, color = '#ecebdd') {
        sfx.meow(CATS[i].hz);
        singUntil[i] = performance.now() + 380;
        notes.push({ x: CATS[i].x + 22, y: CATS[i].y - 2, born: performance.now(), color });
    }

    function nextRound() {
        round++;
        sequence.push(Math.floor(Math.random() * CATS.length));
        phase = 'show';
        say(`Round ${round} of ${ROUNDS} — listen…`);
        sequence.forEach((cat, n) => later(() => sing(cat, '#f2c66d'), 500 + n * 620));
        later(() => { phase = 'input'; cursor = 0; say(`Round ${round} of ${ROUNDS} — your turn! Repeat the melody.`); }, 500 + sequence.length * 620);
    }

    function startChoir() {
        timers.forEach(clearTimeout);
        sequence = [];
        round = 0;
        startBtn.textContent = 'Start over';
        nextRound();
    }

    function press(i) {
        if (phase === 'show') return;
        sing(i);
        if (phase !== 'input') return;
        if (i !== sequence[cursor]) {
            phase = 'free';
            sfx.error();
            say(`Hiss! That was ${CATS[i].name}, not ${CATS[sequence[cursor]].name}. Press “Start over” to try again.`);
            return;
        }
        cursor++;
        if (cursor < sequence.length) return;
        if (round < ROUNDS) { phase = 'show'; say('Purr… nice!'); later(nextRound, 900); return; }
        phase = 'won';
        say('Purrfect! You are now an honorary cat.');
        announce('You won the Meow Choir.');
        award('choir');
        [0, 1, 2, 3, 4, 3, 2, 1, 0].forEach((cat, n) => later(() => sing(cat, '#e8747c'), 300 + n * 200));
    }

    function frame(now) {
        ctx.drawImage(bg, 0, 0);
        const p = painter(ctx);
        STARS.forEach(([x, y, i]) => { if (Math.floor(now / 450 + i * 1.3) % 5) p(i % 6 ? '#ecebdd' : '#f2c66d', x, y, 1, 1); });

        // cats are drawn at double size
        CATS.forEach((cat, i) => {
            const singing = now < singUntil[i];
            const sway = phase === 'won' ? Math.round(Math.sin(now / 160 + i)) : 0;
            ctx.save();
            ctx.translate(cat.x + sway, cat.y - (singing ? 4 : 0));
            ctx.scale(2, 2);
            drawCatFront(ctx, 0, 0, cat.palette, singing);
            ctx.restore();
        });

        // you, with cat ears on
        ctx.save();
        ctx.translate(96, 124);
        ctx.scale(2, 2);
        drawPlayer(ctx, 0, 0, 'up', 0, Math.floor(now / 600) % 2);
        const ears = painter(ctx);
        const bobbed = Math.floor(now / 600) % 2;
        ears(LOOK.hair, 3, -1 - bobbed, 3, 3); ears(LOOK.hair, 10, -1 - bobbed, 3, 3); ears('#e8747c', 4, -bobbed, 1, 2); ears('#e8747c', 11, -bobbed, 1, 2);
        ctx.restore();

        for (let i = notes.length - 1; i >= 0; i--) {
            const n = notes[i];
            const age = (now - n.born) / 1100;
            if (age >= 1) { notes.splice(i, 1); continue; }
            const q = painter(ctx, Math.round(n.x + Math.sin(age * 7) * 3), Math.round(n.y - age * 26));
            ctx.globalAlpha = 1 - age;
            q(n.color, 2, 0, 3, 1); q(n.color, 2, 1, 1, 4); q(n.color, 0, 4, 3, 2);
            ctx.globalAlpha = 1;
        }
        raf = requestAnimationFrame(frame);
    }

    // Invisible buttons over each cat keep the scene keyboard- and screen-reader-friendly.
    const catButtons = CATS.map((cat, i) => h('button', {
        type: 'button', class: 'catworld__cat', 'aria-label': `${cat.name} (key ${i + 1})`, title: `${cat.name} — ${i + 1}`,
        style: { left: `${(cat.x / W) * 100}%`, top: `${(cat.y / H) * 100}%`, width: `${(32 / W) * 100}%`, height: `${(40 / H) * 100}%` },
        onClick: () => press(i),
    }));
    const startBtn = h('button', { type: 'button', class: 'btn btn--primary', onClick: startChoir }, 'Sing with us');
    const stage = h('div', { class: 'catworld__stage' }, cv, catButtons);

    root.append(h('main', { class: 'catworld', id: 'main' },
        hud(go, { home: 'room', homeLabel: 'Back to the room' }),
        h('h1', { class: 'catworld__title' }, 'Cat World'),
        stage,
        status,
        h('div', { class: 'row catworld__actions' }, startBtn,
            h('button', { type: 'button', class: 'btn', onClick: () => { sfx.cancel(); go('room'); } }, 'Back to the room')),
        h('p', { class: 'catworld__hint' }, 'Keys 1–5 meow. Win five rounds of the Meow Choir for a secret achievement.'),
    ));

    function fit() {
        const s = Math.min((window.innerWidth - 24) / W, (window.innerHeight - 250) / H);
        const scale = s >= 2 ? Math.floor(s) : Math.max(1, s);
        stage.style.width = `${W * scale}px`;
        stage.style.height = `${H * scale}px`;
        cv.style.width = '100%';
        cv.style.height = '100%';
    }
    fit();

    const onKey = (e) => {
        if (document.querySelector('.trophies')) return;
        if (/^[1-5]$/.test(e.key)) { e.preventDefault(); press(Number(e.key) - 1); }
        else if (e.key === 'Escape') go('room');
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', fit);
    raf = requestAnimationFrame(frame);
    later(() => award('catworld'), 700);
    later(() => [0, 2, 4].forEach((cat, n) => later(() => sing(cat), n * 260)), 500);
    startBtn.focus({ preventScroll: true });

    return () => {
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', fit);
    };
}
