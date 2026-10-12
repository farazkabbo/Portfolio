// The rooftop: the secret place behind the bookshelf. Every star in the sky is
// something the visitor discovered downstairs. This is also the "say hi" ending.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { hud } from '../core/hud.js';
import { award, progress } from '../core/progress.js';
import { showVisitorCount } from '../core/visitors.js';
import { makeCanvas, painter } from '../art/paint.js';
import { drawPlayer, drawCat, CAT_TUX } from '../art/sprites.js';
import { profile, badges, secrets } from '../content.js';

const W = 224;
const H = 176;
const BULBS = ['#e8747c', '#f2c66d', '#7fd6b6', '#86b0ea', '#ecebdd'];
// x, width, top of each building in the skyline
const SKYLINE = [[0, 18, 96], [18, 12, 84], [30, 20, 104], [50, 10, 90], [60, 22, 100], [82, 14, 78], [96, 18, 108],
    [114, 12, 92], [126, 16, 102], [166, 14, 88], [180, 20, 98], [200, 12, 82], [212, 12, 100]];

function drawBackdrop(ctx) {
    const p = painter(ctx);
    ['#0c0a24', '#110e30', '#17123f', '#1e1850', '#2a2064', '#3a2a78', '#4c3488', '#5e3e90'].forEach((c, i) => p(c, 0, i * 16, W, 16));
    // skyline with lit windows
    SKYLINE.forEach(([x, w, top], n) => {
        p('#0b0f24', x, top, w, 132 - top);
        for (let wy = top + 4; wy < 128; wy += 5) {
            for (let wx = x + 2; wx < x + w - 2; wx += 4) {
                if ((wx * 7 + wy * 3 + n) % 5 < 2) p((wx + wy) % 3 ? '#f2c66d' : '#86b0ea', wx, wy, 2, 2);
            }
        }
    });
    // CN Tower
    p('#0b0f24', 151, 34, 2, 98); p('#0b0f24', 150, 60, 4, 30); p('#0b0f24', 147, 62, 10, 5); p('#0b0f24', 148, 60, 8, 2); p('#0b0f24', 149, 67, 6, 2);
    p('#f2c66d', 148, 64, 8, 1);
    // the roof
    p('#231a3a', 0, 132, W, 44); p('#3a2c5c', 0, 132, W, 3); p('#16102a', 0, 135, W, 2);
    for (let x = 6; x < W; x += 22) p('#1c1430', x, 137, 1, 39);
    // vent, telescope, cushions
    p('#3a2c5c', 14, 140, 22, 16); p('#4a3972', 14, 140, 22, 2); p('#16102a', 17, 145, 16, 1); p('#16102a', 17, 149, 16, 1);
    p('#b9b0d6', 184, 126, 14, 4); p('#8d7bb5', 196, 124, 5, 8); p('#ecebdd', 182, 127, 3, 2);
    p('#16102a', 190, 130, 1, 22); p('#16102a', 186, 138, 1, 14); p('#16102a', 194, 138, 1, 14);
    p('#e8747c', 60, 158, 22, 6); p('#c4525c', 60, 163, 22, 2);
    // poles for the string lights
    p('#16102a', 6, 96, 2, 40); p('#16102a', 216, 96, 2, 40);
}

export function rooftop(root, { go }) {
    const cv = makeCanvas(W, H);
    cv.className = 'px catworld__canvas';
    const ctx = cv.getContext('2d');
    const bg = makeCanvas(W, H);
    drawBackdrop(bg.getContext('2d'));

    const found = progress.badgeCount() + progress.itemCount() + (progress.hasBadge('rooftop') ? 0 : 1);
    const total = badges.length + Object.keys(secrets).length;
    const sky = Math.min(1, found / total);
    const stars = Array.from({ length: 14 + Math.round(sky * 70) }, (_, i) => [(i * 71 + 13) % W, (i * 37 + 5) % 92, i]);
    const wishes = []; // shooting stars: { born, x, y }
    let raf = 0;

    function wish() {
        wishes.push({ born: performance.now(), x: 40 + Math.random() * 150, y: 6 + Math.random() * 30 });
        sfx.coin();
    }

    function frame(now) {
        ctx.drawImage(bg, 0, 0);
        const p = painter(ctx);

        // sky: everything here is drawn behind the buildings, so paint it first and re-stamp the city
        if (sky >= 0.9) {
            for (let x = 0; x < W; x += 2) {
                const hgt = 8 + Math.round((Math.sin(x * 0.09 + now / 900) + 1) * 7);
                p('rgba(127,214,182,0.16)', x, 4 + Math.round(Math.sin(x * 0.05) * 3), 2, hgt);
            }
        }
        stars.forEach(([x, y, i]) => {
            if (Math.floor(now / 480 + i * 1.3) % 5) p(i % 7 === 0 ? '#f2c66d' : i % 5 === 0 ? '#86b0ea' : '#ecebdd', x, y, 1, 1);
        });
        p('#f2ecc4', 30, 16, 10, 10); p('#f2ecc4', 28, 18, 14, 6); p('#f2ecc4', 32, 14, 6, 14); p('#d9d0a0', 33, 18, 2, 2); p('#d9d0a0', 37, 22, 2, 2);
        if (sky >= 0.3) { p('#e8747c', 98, 20, 5, 5); p('#f2c66d', 95, 22, 11, 1); }
        if (sky >= 0.5) { p('#86b0ea', 190, 14, 4, 4); p('#ecebdd', 190, 14, 2, 2); }
        if (sky >= 0.7) { p('#b9b0d6', 128, 10, 7, 1); p('#b9b0d6', 131, 7, 1, 7); p('#ecebdd', 130, 9, 3, 3); }
        for (let i = wishes.length - 1; i >= 0; i--) {
            const age = (now - wishes[i].born) / 700;
            if (age >= 1) { wishes.splice(i, 1); continue; }
            const x = wishes[i].x - age * 60, y = wishes[i].y + age * 26;
            p('#ecebdd', x, y, 3, 1); p('rgba(236,235,221,0.5)', x + 3, y - 1, 4, 1); p('rgba(236,235,221,0.25)', x + 7, y - 2, 5, 1);
        }
        // the stars must not shine through buildings
        SKYLINE.forEach(([x, w, top]) => ctx.drawImage(bg, x, top, w, 132 - top, x, top, w, 132 - top));
        ctx.drawImage(bg, 146, 34, 12, 98, 146, 34, 12, 98);

        // string lights sagging between the poles
        for (let i = 0; i <= 20; i++) {
            const x = 7 + i * 10.5;
            const y = 98 + Math.round(Math.sin((i / 20) * Math.PI) * 12);
            p('#16102a', x, y, 11, 1);
            if (i % 2 === 0) {
                const on = Math.floor(now / 500 + i) % 4 !== 0;
                p(on ? BULBS[(i / 2) % BULBS.length] : '#3a2c5c', x + 4, y + 1, 2, 3);
            }
        }

        // Faraz and the cat, watching the city
        ctx.save();
        ctx.translate(96, 112);
        ctx.scale(2, 2);
        drawPlayer(ctx, 0, 0, 'up', 0, Math.floor(now / 800) % 2);
        ctx.restore();
        ctx.save();
        ctx.translate(132, 124);
        ctx.scale(2, 2);
        drawCat(ctx, 0, 0, { pose: 'sit', facing: 'right', palette: CAT_TUX });
        ctx.restore();

        raf = requestAnimationFrame(frame);
    }

    const social = (id) => profile.socials.find((s) => s.id === id);
    const link = (label, url) => h('a', { class: 'btn', href: url, target: '_blank', rel: 'noopener' }, label);
    const wishBtn = h('button', { type: 'button', class: 'btn btn--primary', onClick: wish }, 'Make a wish');
    const stage = h('div', { class: 'catworld__stage' }, cv);
    const visitors = h('p', { class: 'catworld__hint visitors' });

    root.append(h('main', { class: 'catworld rooftop', id: 'main' },
        hud(go, { home: 'room', homeLabel: 'Back to the room' }),
        h('h1', { class: 'catworld__title' }, 'The Rooftop'),
        stage,
        h('p', { class: 'catworld__status' }, `You found the secret way up. Each star is something you discovered: ${found} of ${total} so far.`),
        h('p', { class: 'catworld__hint' }, 'Thanks for exploring. If you enjoyed the climb, come say hi:'),
        h('div', { class: 'row catworld__actions' },
            h('a', { class: 'btn btn--primary', href: `mailto:${profile.email}` }, 'Email me'),
            link('LinkedIn', social('linkedin').url),
            link('GitHub', social('github').url),
            h('button', { type: 'button', class: 'btn', onClick: () => go('resume') }, 'Résumé')),
        h('div', { class: 'row catworld__actions' }, wishBtn,
            h('button', { type: 'button', class: 'btn', onClick: () => { sfx.cancel(); go('room'); } }, 'Back to the room')),
        visitors,
    ));
    showVisitorCount(visitors, (n) => `You are explorer #${n.toLocaleString('en')} to visit this site.`);

    function fit() {
        const s = Math.min((window.innerWidth - 24) / W, (window.innerHeight - 330) / H);
        const scale = s >= 2 ? Math.floor(s) : Math.max(1, s);
        stage.style.width = `${W * scale}px`;
        stage.style.height = `${H * scale}px`;
        cv.style.width = '100%';
        cv.style.height = '100%';
    }
    fit();

    const onKey = (e) => {
        if (e.key === 'Escape' && !document.querySelector('.trophies')) go('room');
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', fit);
    raf = requestAnimationFrame(frame);
    const hello = setTimeout(() => { award('rooftop'); wish(); }, 700);
    wishBtn.focus({ preventScroll: true });

    return () => {
        cancelAnimationFrame(raf);
        clearTimeout(hello);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', fit);
    };
}
