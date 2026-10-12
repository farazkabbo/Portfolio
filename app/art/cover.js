// Generated pixel-art covers for projects that have no screenshot yet.
import { painter } from './paint.js';

const cache = new Map();
const W = 84;
const H = 60;

function draw(kind) {
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d');
    const p = painter(ctx);
    ['#1d1230', '#251a40', '#2e1f47', '#392a5c'].forEach((c, i) => p(c, 0, i * 15, W, 15));
    for (let x = 6; x < W; x += 12) p('rgba(134,176,234,0.08)', x, 0, 1, H);
    for (let y = 6; y < H; y += 12) p('rgba(134,176,234,0.08)', 0, y, W, 1);
    const h = painter(ctx, W / 2, H / 2);
    if (kind === 'agent') {
        [[-24, -16], [20, -16], [20, 12], [-24, 12]].forEach(([x, y], i) => {
            h(['mint', 'amber', 'coral', 'sky'][i], x, y, 6, 6);
            for (let s = 1; s < 5; s++) h('lilac', Math.round((x + 3) * (s / 5)), Math.round((y + 3) * (s / 5)), 2, 2);
        });
        h('paper', -5, -5, 10, 10); h('deep', -3, -3, 6, 6);
    } else if (kind === 'graph') {
        const nodes = [[0, -20], [20, -9], [20, 11], [0, 20], [-22, 11], [-22, -9]];
        nodes.forEach(([x, y], i) => {
            for (let s = 1; s < 6; s++) h('lilac', Math.round(x * (s / 6)), Math.round(y * (s / 6)), 1, 1);
            h(i % 2 ? 'sky' : 'mint', x - 2, y - 2, 5, 5);
        });
        h('amber', -4, -4, 8, 8); h('paper', -2, -2, 4, 4);
    } else {
        [6, 14, 26, 18, 34, 22, 40, 16, 28, 12, 20, 8].forEach((hgt, i) => h(i % 3 ? 'sky' : 'mint', -34 + i * 6, -hgt / 2, 3, hgt));
    }
    p('rgba(18,11,28,0.25)', 0, H - 3, W, 3);
    return cv.toDataURL('image/png');
}

export function projectImage(project) {
    if (project.image) return project.image;
    const kind = project.kind || 'wave';
    if (!cache.has(kind)) cache.set(kind, draw(kind));
    return cache.get(kind);
}
