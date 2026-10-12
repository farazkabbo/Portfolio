// The bedroom, drawn in code. The room is a 14 x 11 grid of 16px tiles.
import { painter, makeCanvas } from './paint.js';
import { drawCat, CAT_ORANGE } from './sprites.js';

export const T = 16;
export const COLS = 14;
export const ROWS = 11;
export const ROOM_W = COLS * T;
export const ROOM_H = ROWS * T;
const LEFT = 16;
const RIGHT = ROOM_W - 16;
const INNER = RIGHT - LEFT;

// Character-based map (in the spirit of 42's so_long):
//   #  wall        .  walkable floor
//   Letters are solid tiles that belong to an interactable object.
export const MAP = [
    '##############',
    '##############',
    '#BBPDDDWWSSAA#',
    '#BB.DDD....AA#',
    '#K...........#',
    '#...........H#',
    '#TT..........#',
    '#............F',
    '#........NEEC#',
    '#L.......MEEE#',
    '######O#######',
];

export const TILE_OBJECT = {
    B: 'bookshelf', P: 'poster', D: 'computer', W: 'window', S: 'trophies', A: 'diary',
    K: 'backpack', H: 'hologram', T: 'tv', N: 'resume', M: 'lamp', E: 'bed', C: 'cat',
    L: 'plant', O: 'door', F: 'catdoor',
};

export const OBJECT_LABEL = {
    computer: 'Computer', tv: 'Game console', resume: 'Résumé', diary: 'Art diary', hologram: 'Hologram projector',
    cat: 'Cat', trophies: 'Trophy shelf', bookshelf: 'Bookshelf', robot: 'Cutebot', lamp: 'Lamp', window: 'Window',
    backpack: 'Backpack', poster: 'Poster', bed: 'Bed', plant: 'Plant', catdoor: 'Tiny door', door: 'Door',
};

// Everything that never moves: walls, floor, rug and wall-side furniture.
export function drawRoomStatic(ctx) {
    const p = painter(ctx);

    p('ink', 0, 0, ROOM_W, ROOM_H);

    // back wall
    p('#3a2c5c', LEFT, 0, INNER, 48);
    p('#2c2148', LEFT, 0, INNER, 6);
    p('#4a3972', LEFT, 6, INNER, 1);
    p('#56447f', LEFT, 43, INNER, 1);
    p('#241a3b', LEFT, 44, INNER, 4);

    // wooden floor
    p('#4d3d70', LEFT, 48, INNER, 112);
    for (let y = 48, row = 0; y < 160; y += 8, row++) {
        p('#42335f', LEFT, y + 7, INNER, 1);
        for (let x = LEFT + (row % 2 ? 22 : 46); x < RIGHT; x += 48) p('#42335f', x, y, 1, 7);
        if (row % 3 === 0) p('#58477e', 30 + row * 11, y + 2, 10, 1);
    }
    p('rgba(18,11,28,0.3)', LEFT, 48, INNER, 3); // wall shadow on the floor

    // side + bottom walls
    p('#2c2148', LEFT - 2, 0, 2, 160); p('#2c2148', RIGHT, 0, 2, 160);
    p('#2c2148', LEFT - 2, 160, INNER + 4, 2);
    // a tiny cat door in the right-hand wall
    p('woodDark', RIGHT, 114, 7, 14); p('woodDark', RIGHT + 1, 113, 5, 1);
    p('woodLight', RIGHT + 1, 116, 5, 11); p('wood', RIGHT + 1, 116, 5, 1);
    p('ink', RIGHT + 3, 121, 2, 2); p('ink', RIGHT + 2, 119, 1, 1); p('ink', RIGHT + 4, 119, 1, 1); p('ink', RIGHT + 5, 120, 1, 1);
    // doorway and mat
    p('#4d3d70', 96, 160, 16, 16); p('#42335f', 96, 167, 16, 1);
    p('#8d7bb5', 94, 160, 2, 16); p('#8d7bb5', 112, 160, 2, 16);
    p('#5b84c9', 98, 151, 12, 8); p('#86b0ea', 99, 152, 10, 6); p('#5b84c9', 101, 154, 6, 2);

    // rug
    p('#5b84c9', 80, 80, 64, 48);
    for (let ry = 0; ry < 5; ry++) {
        for (let rx = 0; rx < 7; rx++) {
            p((rx + ry) % 2 ? '#a9c8f2' : '#86b0ea', 84 + rx * 8, 84 + ry * 8, 8, 8);
        }
    }

    // bookshelf
    p('woodDark', 17, 12, 30, 51); p('wood', 17, 12, 30, 1); p('#3f2a24', 17, 62, 30, 1);
    const books = ['coral', 'sky', 'amber', 'mint', 'paper', 'lilac', 'deep'];
    for (let s = 0; s < 4; s++) {
        const sy = 15 + s * 12;
        p('#2a1c2e', 19, sy, 26, 10);
        let bx = 20;
        for (let b = 0; bx < 43; b++) {
            const w = 2 + ((b + s) % 2);
            const hgt = 6 + ((b * 3 + s) % 4);
            if ((b + s * 2) % 6 !== 5) p(books[(b + s * 3) % books.length], bx, sy + 10 - hgt, w, hgt);
            bx += w + 1;
        }
    }

    // poster: a streak calendar
    p('night', 50, 11, 13, 21); p('paper', 51, 12, 11, 19);
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
            p((r * 3 + c) % 7 === 3 ? 'mist' : (r + c) % 3 ? 'mint' : '#3f9c78', 52 + c * 3, 14 + r * 3, 2, 2);
        }
    }

    // window frame, glass and the Toronto skyline (sky details are animated)
    p('mist', 114, 8, 28, 29); p('#141a3a', 116, 10, 24, 25);
    p('#1c2550', 116, 24, 24, 11);
    p('#0b0f24', 116, 28, 5, 7); p('#0b0f24', 124, 26, 3, 9); p('#0b0f24', 130, 29, 4, 6); p('#0b0f24', 134, 26, 6, 9);
    p('#0b0f24', 122, 13, 1, 22); p('#0b0f24', 121, 19, 3, 2); p('#0b0f24', 121, 22, 3, 1);
    p('amber', 117, 30, 1, 1); p('amber', 119, 32, 1, 1); p('amber', 125, 28, 1, 1); p('amber', 131, 31, 1, 1);
    p('amber', 135, 28, 1, 1); p('amber', 137, 31, 1, 1); p('amber', 138, 28, 1, 1); p('coral', 122, 12, 1, 1);
    p('paper', 113, 36, 30, 2);

    // trophy shelf
    p('wood', 146, 26, 28, 2); p('woodDark', 148, 28, 1, 3); p('woodDark', 171, 28, 1, 3);
    p('amber', 150, 16, 6, 5); p('amber', 149, 17, 1, 2); p('amber', 156, 17, 1, 2);
    p('#fff3c4', 151, 17, 1, 3); p('amber', 152, 21, 2, 3); p('#b98a3a', 151, 24, 4, 2);
    p('coral', 160, 15, 2, 6); p('deep', 162, 15, 2, 6); p('amber', 160, 21, 4, 4); p('#fff3c4', 161, 22, 1, 1);
    p('woodDark', 166, 17, 6, 9); p('amber', 167, 19, 4, 3); p('paper', 167, 23, 4, 1);

    // desk
    p('#3f2a24', 64, 54, 48, 10); p('wood', 65, 54, 46, 8);
    p('woodLight', 64, 42, 48, 12); p('#c08a62', 64, 42, 48, 1); p('woodDark', 64, 53, 48, 1);
    p('woodDark', 67, 56, 12, 5); p('amber', 72, 58, 2, 1); p('woodDark', 97, 56, 12, 5); p('amber', 102, 58, 2, 1);
    // monitor, tower, keyboard, mouse, mug
    p('night', 74, 15, 28, 24); p('#22335c', 76, 17, 24, 19);
    p('night', 86, 39, 4, 3); p('night', 82, 42, 12, 2);
    p('mist', 104, 25, 7, 19); p('lilac', 104, 25, 7, 1); p('night', 105, 28, 5, 1); p('night', 105, 30, 5, 1); p('mint', 109, 40, 1, 1);
    p('paper', 77, 46, 20, 5); p('mist', 78, 47, 18, 1); p('mist', 78, 49, 18, 1);
    p('paper', 100, 47, 3, 4); p('mist', 101, 47, 1, 1);
    p('coral', 66, 44, 4, 5); p('coral', 70, 45, 1, 2); p('#3f2a24', 67, 44, 2, 1);

    // art corner: three framed paintings...
    p('woodDark', 178, 9, 13, 16); p('#27406e', 179, 10, 11, 14);
    p('amber', 181, 12, 2, 2); p('amber', 186, 13, 2, 3); p('#c96a3a', 183, 17, 3, 7); p('#1b2a4d', 179, 20, 4, 4); p('#f2ecc4', 188, 16, 1, 1);
    p('night', 193, 8, 13, 20); p('#7a2230', 194, 9, 11, 18);
    p('#c8404a', 197, 10, 6, 6); p('#a8323c', 198, 11, 2, 2); p('#1a0f14', 199, 14, 2, 8); p('#1a0f14', 197, 17, 6, 1); p('#3a1118', 194, 24, 11, 3);
    p('woodDark', 180, 28, 10, 10); p('#3c4b94', 181, 29, 8, 8);
    p('#f0b63f', 182, 30, 6, 6); p('ink', 183, 32, 1, 1); p('ink', 186, 32, 1, 1); p('ink', 184, 34, 2, 1);
    // ...and the drawing table with the open art diary
    p('#3f2a24', 177, 54, 30, 10); p('wood', 178, 54, 28, 8); p('woodDark', 181, 56, 1, 6); p('woodDark', 202, 56, 1, 6);
    p('#d8c39a', 176, 42, 32, 12); p('#ecdcb8', 176, 42, 32, 1); p('woodDark', 176, 53, 32, 1);
    p('night', 179, 43, 17, 10); p('paper', 180, 44, 15, 8); p('mist', 187, 44, 1, 8);
    p('coral', 181, 45, 3, 3); p('deep', 183, 48, 3, 2); p('amber', 189, 45, 2, 2); p('ink', 189, 48, 4, 1); p('ink', 190, 50, 3, 1);
    p('deep', 199, 44, 5, 7); p('sky', 199, 44, 5, 1);
    p('amber', 200, 40, 1, 4); p('coral', 201, 39, 1, 5); p('mint', 203, 41, 1, 3);
    p('paper', 201, 38, 1, 1);

    // bed (pillow left, blanket right)
    const b = painter(ctx, 32, 0);
    b('woodDark', 128, 128, 48, 32); b('#3f2a24', 128, 157, 48, 3);
    b('paper', 130, 130, 44, 26);
    b('white', 132, 133, 11, 19); b('mist', 132, 150, 11, 2); b('mist', 142, 133, 1, 19);
    b('deep', 146, 130, 28, 26); b('sky', 146, 130, 3, 26); b('#4a70b0', 146, 153, 28, 3);
    b('sky', 154, 146, 4, 4); b('sky', 164, 150, 3, 3); b('sky', 158, 142, 2, 2);

    // bedside dresser with the résumé on top
    p('#3f2a24', 145, 128, 14, 32); p('woodLight', 145, 128, 14, 23); p('#c08a62', 145, 128, 14, 1);
    p('wood', 145, 151, 14, 7); p('woodDark', 146, 153, 12, 1); p('amber', 149, 155, 2, 1); p('amber', 154, 155, 2, 1);
    p('night', 147, 129, 10, 11); p('paper', 148, 130, 8, 9);
    p('deep', 149, 131, 4, 1); p('lilac', 149, 133, 6, 1); p('lilac', 149, 135, 6, 1); p('lilac', 149, 137, 4, 1);
    p('coral', 151, 129, 3, 1);
}

const STARS = [
    [118, 12], [125, 15], [131, 11], [138, 19], [119, 20], [132, 22], [117, 16], [124, 11], [130, 17], [137, 11],
    [120, 14], [133, 19], [139, 15], [126, 20], [118, 22], [130, 13], [124, 18], [136, 22], [129, 21], [120, 10],
];

// Things that move or change, drawn over the static room every frame.
// env = { lamp: boolean, weather: 'clear' | 'rain' | 'snow', universe: 0..1, bookHint: boolean }
export function drawRoomAnimated(ctx, t, env) {
    const p = painter(ctx);

    // monitor: lines of "code" with a blinking cursor
    const widths = [10, 16, 7, 13, 18, 9];
    const tints = ['sky', 'mint', 'paper', 'amber', 'sky', 'coral'];
    const scroll = Math.floor(t / 900);
    for (let i = 0; i < 5; i++) {
        const k = (i + scroll) % widths.length;
        p(tints[k], 78 + (k % 2) * 2, 19 + i * 3, widths[k], 1);
    }
    if (Math.floor(t / 400) % 2) p('paper', 78, 34, 2, 1);

    // the sky outside grows with every discovery
    const u = env.universe;
    const count = 4 + Math.round(u * (STARS.length - 4));
    STARS.slice(0, count).forEach(([x, y], i) => {
        if (Math.floor(t / 500 + i * 1.7) % 4) p(i % 5 === 0 ? 'amber' : 'paper', x, y, 1, 1);
    });
    p('#f2ecc4', 134, 13, 3, 3); p('#141a3a', 136, 13, 1, 1); // moon
    if (u >= 0.2) { p('coral', 130, 15, 2, 2); p('amber', 129, 16, 4, 1); }             // ringed planet
    if (u >= 0.4) { p('sky', 118, 17, 2, 2); p('paper', 118, 17, 1, 1); }                 // blue planet
    if (u >= 0.6) { p('lilac', 136, 20, 3, 1); p('lilac', 137, 19, 1, 3); p('paper', 137, 20, 1, 1); } // galaxy
    if (u >= 0.4) {                                                                       // shooting star
        const s = (t % 7000) / 40;
        if (s < 14) { p('paper', 139 - s, 10 + s * 0.5, 2, 1); p('rgba(236,235,221,0.4)', 141 - s, 9.5 + s * 0.5, 2, 1); }
    }
    if (u >= 1) {                                                                         // aurora
        for (let x = 116; x < 140; x++) {
            const hgt = 2 + Math.round(Math.sin(x * 0.6 + t / 600) + 1);
            p('rgba(127,214,182,0.35)', x, 10, 1, hgt);
        }
    }
    if (env.weather === 'rain') {
        for (let i = 0; i < 10; i++) {
            p('rgba(170,200,255,0.75)', 116 + ((i * 7 + Math.floor(t / 45)) % 24), 10 + ((i * 11 + Math.floor(t / 22) * 2) % 24), 1, 2);
        }
    } else if (env.weather === 'snow') {
        for (let i = 0; i < 9; i++) {
            const drift = Math.round(Math.sin(t / 700 + i));
            p('white', 116 + ((i * 5 + 24 + drift) % 24), 10 + ((i * 9 + Math.floor(t / 130)) % 25), 1, 1);
        }
    }
    p('mist', 127, 10, 2, 25); // window mullion stays on top of the sky

    // table lamp on the dresser
    p('night', 150, 149, 4, 1); p('night', 151, 146, 2, 3);
    p(env.lamp ? 'amber' : 'lilac', 148, 141, 8, 5); p(env.lamp ? 'amber' : 'lilac', 149, 140, 6, 1);
    if (env.lamp) p('#fff3c4', 149, 142, 6, 3);

    // once the shelf has been looked at, one book gives itself away
    if (env.bookHint) {
        p('amber', 36, 28, 2, 9);
        if (Math.floor(t / 300) % 3 === 0) { p('white', 36, 26, 2, 1); p('white', 39, 29, 1, 2); }
    }

    // a twinkle on the résumé so people notice it
    if (Math.floor(t / 350) % 4 === 0) { p('white', 155, 129, 1, 3); p('white', 154, 130, 3, 1); }

    // the cat asleep at the foot of the bed
    drawCat(ctx, 192, 127, { pose: 'sleep', frame: Math.floor(t / 900) % 2, palette: CAT_ORANGE });
    const z = Math.floor(t / 600) % 3;
    p('paper', 204 + z, 127 - z * 2, 2, 1); p('paper', 205 + z, 128 - z * 2, 1, 1); p('paper', 204 + z, 129 - z * 2, 2, 1);
}

// --- lighting: a dark veil over the room with pools of light cut out of it ---
let veil = null;

function glow(ctx, x, y, r, a, color = '0,0,0') {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    // hard steps instead of a smooth fade keep the light looking like pixel art
    [[0, a], [0.4, a], [0.4, a * 0.6], [0.7, a * 0.6], [0.7, a * 0.28], [1, a * 0.28], [1, 0]]
        .forEach(([stop, alpha]) => g.addColorStop(stop, `rgba(${color},${alpha})`));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

export function drawLighting(ctx, t, env) {
    if (!veil) veil = makeCanvas(ROOM_W, ROOM_H);
    const v = veil.getContext('2d');
    const flicker = Math.sin(t / 130) * 0.6;
    v.globalCompositeOperation = 'source-over';
    v.clearRect(0, 0, ROOM_W, ROOM_H);
    v.fillStyle = env.lamp ? 'rgba(12,7,30,0.34)' : 'rgba(8,5,26,0.62)';
    v.fillRect(0, 0, ROOM_W, ROOM_H);
    v.globalCompositeOperation = 'destination-out';
    glow(v, 88, 36, 38 + flicker, 0.95);           // monitor
    glow(v, 29, 90, 27 - flicker, 0.85);           // TV
    glow(v, 128, 30, 30, 0.9);                     // window
    v.fillStyle = 'rgba(0,0,0,0.3)';               // moonlight on the floor
    v.fillRect(112, 48, 36, 30);
    glow(v, 200, 76, 26 + flicker, 0.9);           // hologram
    glow(v, 210, 121, 12, 0.7);                    // light leaking under the cat door
    if (env.lamp) glow(v, 152, 146, 62, 1);        // lamp
    ctx.drawImage(veil, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (env.lamp) glow(ctx, 152, 146, 58, 0.11, '255,190,90');
    glow(ctx, 200, 76, 22, 0.1, '110,170,255');
    glow(ctx, 88, 36, 30, 0.06, '110,170,255');
    ctx.restore();

    // dust drifting through the lamp light
    if (env.lamp) {
        const p = painter(ctx);
        for (let i = 0; i < 6; i++) {
            const x = 128 + ((i * 17 + t / 260) % 46);
            const y = 150 - ((i * 23 + t / 190) % 44);
            p('rgba(255,236,180,0.5)', Math.round(x), Math.round(y), 1, 1);
        }
    }
}

// The hologram cycles through three AI projects: agents, a knowledge graph, a voice waveform.
function drawHologram(ctx, t) {
    const p = painter(ctx);
    p('night', 194, 88, 12, 6); p('mist', 195, 89, 10, 3); p('sky', 197, 90, 6, 1); p('night', 195, 93, 10, 1);
    for (let y = 64; y < 88; y += 2) {
        const w = 14 - Math.round(((y - 64) / 24) * 8);
        p('rgba(134,176,234,0.13)', 200 - w / 2, y, w, 1);
    }
    const glitch = Math.floor(t / 90) % 23 === 0 ? 1 : 0;
    const bob = Math.round(Math.sin(t / 500));
    const h = painter(ctx, 200 + glitch, 73 + bob);
    const blue = 'rgba(160,200,255,0.9)';
    const white = 'rgba(236,245,255,0.95)';
    const shape = Math.floor(t / 2600) % 3;
    if (shape === 0) {
        // agent: a core wired to four tools, one lit at a time
        const lit = Math.floor(t / 300) % 4;
        [[-6, -6], [5, -6], [5, 5], [-6, 5]].forEach(([x, y], i) => {
            h(i === lit ? white : blue, x, y, 2, 2);
            h(blue, Math.sign(x) * 3, Math.sign(y) * 3, 1, 1);
        });
        h(white, -1, -1, 3, 3);
    } else if (shape === 1) {
        // knowledge graph: a ring of nodes with a signal running round it
        const lit = Math.floor(t / 200) % 6;
        [[0, -7], [6, -3], [6, 4], [0, 7], [-6, 4], [-6, -3]].forEach(([x, y], i) => h(i === lit ? white : blue, x, y, 2, 2));
        h(white, 0, 0, 2, 2); h(blue, 0, -4, 1, 3); h(blue, 3, 1, 3, 1); h(blue, -3, 1, 3, 1);
    } else {
        // voice: a waveform
        for (let i = 0; i < 7; i++) {
            const hgt = 2 + Math.round(Math.abs(Math.sin(t / 220 + i * 0.9)) * 9);
            h(i % 2 ? blue : white, -7 + i * 2, -Math.floor(hgt / 2), 1, hgt);
        }
    }
}

// Tall objects that the player can walk behind. Sorted with the player by baseY.
export const TALL_OBJECTS = [
    {
        id: 'tv', baseY: 112,
        draw(ctx, t) {
            const p = painter(ctx);
            p('woodDark', 17, 100, 30, 12); p('wood', 17, 100, 30, 1); p('#3f2a24', 17, 110, 30, 2);
            p('#3f2a24', 31, 102, 1, 8); p('amber', 28, 105, 1, 2); p('amber', 34, 105, 1, 2);
            p('night', 18, 78, 22, 22); p('#22335c', 20, 80, 18, 15);
            // a tiny game on screen
            const bx = 21 + (Math.floor(t / 180) % 14);
            p('mint', bx, 86 + (Math.floor(t / 360) % 2), 2, 2);
            p('coral', 34, 82, 2, 2); p('amber', 24, 91, 10, 1);
            p('lilac', 21, 97, 2, 1); p('mint', 36, 97, 1, 1);
            // console
            p('night', 41, 92, 6, 8); p('mist', 42, 93, 4, 6); p('night', 42, 95, 4, 1); p('mint', 45, 97, 1, 1);
        },
    },
    {
        id: 'backpack', baseY: 80,
        draw(ctx) {
            const p = painter(ctx, -144, -16);
            p('rgba(18,11,28,0.35)', 162, 93, 12, 2);
            p('#23202e', 163, 83, 10, 11); p('#23202e', 164, 82, 8, 1); p('#23202e', 167, 80, 2, 2);
            p('#34303f', 165, 88, 6, 5); p('amber', 167, 88, 2, 1); p('#34303f', 164, 84, 8, 1);
            p('coral', 170, 90, 2, 2); p('mint', 164, 91, 2, 1);
        },
    },
    {
        id: 'plant', baseY: 160,
        draw(ctx) {
            const p = painter(ctx);
            p('rgba(18,11,28,0.35)', 18, 157, 12, 2);
            p('#3f9c78', 22, 138, 4, 14); p('#3f9c78', 18, 142, 4, 7); p('#3f9c78', 26, 141, 4, 8);
            p('mint', 23, 139, 2, 6); p('mint', 19, 143, 2, 3); p('mint', 27, 142, 2, 3);
            p('#2f7a5d', 21, 148, 6, 4);
            p('#c2704f', 20, 152, 8, 6); p('#d98a66', 19, 151, 10, 2); p('#9c563b', 21, 157, 6, 1);
        },
    },
    { id: 'hologram', baseY: 96, draw: drawHologram },
];
