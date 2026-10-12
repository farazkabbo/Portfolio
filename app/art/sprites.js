// Character art: the player (Faraz), the dialog portraits and the Cutebot.
// To restyle the character, change the colours in LOOK or redraw the rects below.
import { painter, makeCanvas } from './paint.js';

export const LOOK = {
    hair: '#2d2c2a',
    hairLight: '#4a4844',
    skin: '#e3b48c',
    skinShade: '#c4916b',
    frame: '#17131d',
    lens: '#ffffff',
    shirt: '#3c4b94',
    shirtShade: '#2d3973',
    shirtLight: '#5567b8',
    smile: '#f0b63f',
    pants: '#2f4a3c',
    shoe: '#17131d',
    sole: '#ecebdd',
};

export const PLAYER_W = 16;
export const PLAYER_H = 22;

// dir: 'down' | 'up' | 'left' | 'right'.  frame: 0 = idle, 1 / 2 = walk steps.
export function drawPlayer(ctx, x, y, dir, frame = 0, bob = 0) {
    const L = LOOK;
    if (dir === 'right') {
        ctx.save();
        ctx.translate(x + PLAYER_W, y);
        ctx.scale(-1, 1);
        drawPlayer(ctx, 0, 0, 'left', frame, bob);
        ctx.restore();
        return;
    }
    const lift = frame ? 1 : bob;       // whole upper body rises a pixel mid-step
    const legL = frame === 1 ? 1 : 0;   // which foot is off the ground
    const legR = frame === 2 ? 1 : 0;
    const p = painter(ctx, x, y);
    const u = painter(ctx, x, y - lift);

    p('rgba(18,11,28,0.35)', 3, 20, 10, 2); // shadow

    if (dir === 'left') {
        p(L.pants, 5, 17, 6, 1);
        p(L.pants, 5, 18, 3, 2 - legL); p(L.pants, 8, 18, 3, 2 - legR);
        p(L.shoe, 4, 20 - legL, 4, 2); p(L.shoe, 8, 20 - legR, 4, 2);
        // body + swinging arm
        u(L.shirt, 4, 10, 7, 7); u(L.shirtShade, 4, 16, 7, 1);
        u(L.shirtShade, 6 + legL - legR, 11, 3, 5); u(L.skin, 6 + legL - legR, 16, 2, 1);
        // head: face on the left, hair sweeping up and back
        u(L.skin, 3, 5, 6, 4); u(L.skin, 4, 9, 5, 1);
        u(L.hair, 10, 0, 4, 1); u(L.hair, 5, 1, 9, 1); u(L.hair, 3, 2, 10, 3);
        u(L.hair, 8, 5, 5, 4); u(L.hair, 9, 9, 3, 1);
        u(L.hairLight, 6, 2, 5, 1);
        u(L.frame, 3, 5, 6, 1); u(L.lens, 3, 6, 3, 2); u(L.frame, 4, 7, 1, 1); u(L.frame, 6, 6, 2, 1);
        u(L.lens, 4, 9, 2, 1);
        return;
    }

    // legs (shared by front and back views)
    p(L.pants, 4, 17, 8, 1);
    p(L.pants, 4, 18, 3, 2 - legL); p(L.pants, 9, 18, 3, 2 - legR);
    p(L.shoe, 3, 20 - legL, 4, 2); p(L.shoe, 9, 20 - legR, 4, 2);
    p(L.sole, 3, 21 - legL, 4, 1); p(L.sole, 9, 21 - legR, 4, 1);

    // torso + arms
    u(L.shirt, 3, 10, 10, 7); u(L.shirt, 2, 11, 12, 5);
    u(L.shirtShade, 2, 14, 1, 2); u(L.shirtShade, 13, 14, 1, 2);
    u(L.shirtShade, 3, 16, 10, 1);
    u(L.skin, 2, 16, 1, 1); u(L.skin, 13, 16, 1, 1);

    if (dir === 'up') {
        u(L.shirtLight, 5, 11, 6, 1);
        u(L.skin, 6, 9, 4, 1);
        u(L.hair, 2, 0, 4, 1); u(L.hair, 2, 1, 9, 1); u(L.hair, 3, 2, 10, 7); u(L.hair, 4, 9, 8, 1);
        u(L.hairLight, 5, 3, 5, 1);
        return;
    }

    // smiley logo
    u(L.smile, 6, 12, 4, 4); u(L.smile, 5, 13, 6, 2);
    u(L.frame, 6, 13, 1, 1); u(L.frame, 9, 13, 1, 1);
    // head
    u(L.skin, 4, 5, 8, 4); u(L.skin, 5, 9, 6, 1);
    u(L.hair, 10, 0, 4, 1); u(L.hair, 6, 1, 8, 1); u(L.hair, 4, 2, 9, 1); u(L.hair, 3, 3, 10, 2);
    u(L.hair, 3, 5, 1, 2); u(L.hair, 12, 5, 1, 2);
    u(L.hairLight, 6, 2, 5, 1);
    // white glasses + grin
    u(L.frame, 4, 5, 8, 1);
    u(L.lens, 4, 6, 3, 2); u(L.lens, 9, 6, 3, 2);
    u(L.frame, 7, 6, 2, 1); u(L.frame, 5, 7, 1, 1); u(L.frame, 10, 7, 1, 1);
    u(L.lens, 6, 9, 4, 1);
}

// Standalone canvas of the player, used for menu icons.
export function playerIcon(scale = 4, dir = 'down') {
    const cv = makeCanvas(PLAYER_W, PLAYER_H, scale);
    drawPlayer(cv.getContext('2d'), 0, 0, dir, 0);
    return cv;
}

// 40x40 bust shown next to the dialog box.
export function portrait(who = 'Faraz', scale = 5) {
    const cv = makeCanvas(40, 40, scale);
    const ctx = cv.getContext('2d');
    const p = painter(ctx);
    const L = LOOK;

    if (who === 'Cutebot') {
        p('#17131d', 8, 14, 24, 20); p('#ecebdd', 9, 15, 22, 18);
        p('#17131d', 11, 17, 8, 8); p('#17131d', 21, 17, 8, 8);
        p('#7fd6b6', 12, 18, 6, 6); p('#7fd6b6', 22, 18, 6, 6);
        p('#ffffff', 13, 19, 2, 2); p('#ffffff', 23, 19, 2, 2);
        p('#17131d', 15, 28, 10, 1); p('#17131d', 14, 27, 1, 1); p('#17131d', 25, 27, 1, 1);
        p('#17131d', 19, 8, 2, 6); p('#e8747c', 18, 5, 4, 4);
        p('#17131d', 4, 22, 4, 12); p('#17131d', 32, 22, 4, 12);
        p('#5b84c9', 9, 34, 22, 6); p('#17131d', 8, 34, 24, 1);
        return cv;
    }

    if (who === 'Cat') {
        const k = CAT_TUX;
        p(k.b, 6, 32, 28, 8); p(k.w, 14, 31, 12, 9);
        p(k.b, 8, 10, 24, 22); p(k.b, 8, 5, 7, 6); p(k.b, 25, 5, 7, 6); p(k.b, 9, 3, 4, 2); p(k.b, 27, 3, 4, 2);
        p('#e8747c', 10, 7, 3, 4); p('#e8747c', 27, 7, 3, 4);
        p(k.w, 18, 12, 4, 12); p(k.w, 14, 23, 12, 8);
        p(k.e, 12, 16, 6, 6); p(k.e, 22, 16, 6, 6); p('#17131d', 14, 16, 2, 6); p('#17131d', 24, 16, 2, 6);
        p('#ffffff', 12, 16, 2, 2); p('#ffffff', 22, 16, 2, 2);
        p('#e8747c', 18, 23, 4, 2); p('#17131d', 19, 25, 2, 2); p('#17131d', 16, 27, 3, 1); p('#17131d', 21, 27, 3, 1);
        p(k.w, 2, 22, 6, 1); p(k.w, 2, 26, 6, 1); p(k.w, 32, 22, 6, 1); p(k.w, 32, 26, 6, 1);
        return cv;
    }

    // shirt, neck, necklace with the smiley pendant
    p(L.shirtShade, 0, 33, 40, 7); p(L.shirt, 2, 31, 36, 9); p(L.shirtLight, 4, 31, 32, 1);
    p(L.skinShade, 16, 27, 8, 4); p(L.skin, 14, 30, 12, 2); p(L.skin, 16, 32, 8, 1);
    p(L.frame, 14, 32, 1, 1); p(L.frame, 15, 33, 1, 1); p(L.frame, 16, 34, 1, 1); p(L.frame, 17, 35, 1, 1);
    p(L.frame, 25, 32, 1, 1); p(L.frame, 24, 33, 1, 1); p(L.frame, 23, 34, 1, 1); p(L.frame, 22, 35, 1, 1);
    p(L.smile, 18, 35, 4, 5); p(L.smile, 17, 36, 6, 3);
    p(L.frame, 18, 36, 1, 1); p(L.frame, 21, 36, 1, 1); p(L.frame, 19, 38, 2, 1);
    // head + ears
    p(L.skin, 11, 10, 18, 16); p(L.skin, 13, 26, 14, 2); p(L.skinShade, 15, 27, 10, 1);
    p(L.skin, 9, 16, 2, 5); p(L.skin, 29, 16, 2, 5); p(L.skinShade, 9, 20, 2, 1); p(L.skinShade, 29, 20, 2, 1);
    // hair: big mass swept up to a point on the right
    p(L.hair, 29, 0, 7, 1); p(L.hair, 24, 1, 11, 1); p(L.hair, 14, 2, 20, 1); p(L.hair, 11, 3, 22, 1);
    p(L.hair, 9, 4, 23, 8); p(L.hair, 8, 6, 1, 6);
    p(L.hair, 9, 12, 3, 5); p(L.hair, 28, 12, 3, 4);
    p(L.hair, 12, 12, 7, 2); p(L.hair, 19, 12, 4, 1); p(L.hair, 25, 12, 3, 2);
    p(L.hairLight, 14, 5, 9, 1); p(L.hairLight, 22, 3, 9, 1); p(L.hairLight, 12, 7, 4, 1);
    // white rectangular glasses with happy closed eyes
    p(L.frame, 10, 15, 9, 7); p(L.frame, 21, 15, 9, 7); p(L.frame, 19, 17, 2, 1);
    p(L.lens, 11, 16, 7, 5); p(L.lens, 22, 16, 7, 5);
    p(L.frame, 12, 19, 1, 1); p(L.frame, 13, 18, 3, 1); p(L.frame, 16, 19, 1, 1);
    p(L.frame, 23, 19, 1, 1); p(L.frame, 24, 18, 3, 1); p(L.frame, 27, 19, 1, 1);
    // nose + grin
    p(L.skinShade, 19, 20, 2, 2);
    p(L.frame, 14, 23, 1, 2); p(L.frame, 25, 23, 1, 2); p(L.frame, 15, 24, 10, 3);
    p(L.lens, 15, 24, 10, 2); p(L.frame, 16, 26, 8, 1); p(L.skin, 15, 26, 1, 1); p(L.skin, 24, 26, 1, 1);
    return cv;
}

// 16x16 robot buddy that wanders around the room.
export function drawRobot(ctx, x, y, t = 0) {
    const p = painter(ctx, x, y);
    const blink = Math.floor(t / 300) % 12 === 0;
    p('rgba(18,11,28,0.35)', 2, 14, 12, 2);
    p('#17131d', 1, 9, 3, 6); p('#17131d', 12, 9, 3, 6);
    p('#17131d', 3, 4, 10, 10); p('#ecebdd', 4, 5, 8, 8);
    p('#17131d', 4, 6, 4, 4); p('#17131d', 8, 6, 4, 4);
    if (!blink) { p('#7fd6b6', 5, 7, 2, 2); p('#7fd6b6', 9, 7, 2, 2); }
    p('#5b84c9', 4, 11, 8, 2);
    p('#17131d', 7, 1, 2, 3); p('#e8747c', 7, 0, 2, 2);
}

// ---------------------------------------------------------------------------
// Cats
// ---------------------------------------------------------------------------
export const CAT_TUX = { b: '#2a2633', w: '#ecebdd', e: '#7fd6b6', s: null };
export const CAT_ORANGE = { b: '#e39a4c', w: '#fff3dc', e: '#3f9c78', s: '#c47a34' };
export const CAT_GREY = { b: '#9a98a8', w: '#ecebdd', e: '#f2c66d', s: '#77758a' };
export const CAT_WHITE = { b: '#ecebdd', w: '#ffffff', e: '#5b84c9', s: null };
export const CAT_SIAMESE = { b: '#e0d2b8', w: '#fff8ea', e: '#5b84c9', s: '#5a4638' };

const SHADOW = 'rgba(18,11,28,0.35)';

// Side-on cat in a 16x16 box. pose: 'walk' | 'sit' | 'sleep'. Faces left unless facing is 'right'.
export function drawCat(ctx, x, y, { pose = 'sit', frame = 0, facing = 'left', palette = CAT_TUX } = {}) {
    if (facing === 'right') {
        ctx.save();
        ctx.translate(x + 16, y);
        ctx.scale(-1, 1);
        drawCat(ctx, 0, 0, { pose, frame, palette });
        ctx.restore();
        return;
    }
    const k = palette;
    const p = painter(ctx, x, y);
    const ink = '#17131d';

    if (pose === 'sleep') {
        p(SHADOW, 2, 15, 12, 1);
        p(k.b, 4, 9, 10, 6); p(k.b, 5, 8, 8, 1);
        if (frame) p(k.b, 6, 7, 6, 1);
        if (k.s) { p(k.s, 8, 8, 1, 3); p(k.s, 11, 8, 1, 3); }
        p(k.s || k.b, 12, 13, 3, 1); p(k.b, 14, 12, 1, 1);
        p(k.b, 1, 8, 6, 6); p(k.b, 1, 6, 2, 2); p(k.b, 5, 6, 2, 2);
        p(ink, 2, 11, 1, 1); p(ink, 5, 11, 1, 1);
        p(k.w, 3, 12, 2, 1); p('#e8747c', 3, 12, 1, 1);
        return;
    }
    if (pose === 'sit') {
        p(SHADOW, 3, 15, 11, 1);
        p(k.b, 13, 10, 1, 5); p(k.b, 14, 8, 1, 3);
        p(k.b, 6, 7, 7, 8); p(k.w, 6, 10, 2, 4);
        if (k.s) p(k.s, 10, 8, 1, 4);
        p(k.b, 2, 3, 8, 6); p(k.b, 2, 1, 2, 2); p(k.b, 8, 1, 2, 2);
        p(k.e, 3, 5, 2, 2); p(k.e, 7, 5, 2, 2); p(ink, 3, 5, 1, 2); p(ink, 7, 5, 1, 2);
        p(k.w, 4, 7, 4, 2); p('#e8747c', 5, 7, 2, 1);
        p(k.w, 6, 14, 2, 1); p(k.w, 10, 14, 2, 1);
        return;
    }
    // walk: the whole cat hops a pixel on the second frame
    const hop = frame ? 1 : 0;
    const u = painter(ctx, x, y - hop);
    p(SHADOW, 2, 15, 12, 1);
    u(k.b, 14, 5, 1, 5); u(k.b, 13, 9, 1, 1);
    u(k.b, 5, 8, 9, 4); u(k.w, 5, 10, 2, 2);
    if (k.s) { u(k.s, 9, 8, 1, 3); u(k.s, 12, 8, 1, 3); }
    u(k.b, 1, 4, 7, 6); u(k.b, 1, 2, 2, 2); u(k.b, 6, 2, 2, 2);
    u(k.e, 2, 6, 2, 2); u(k.e, 5, 6, 2, 2); u(ink, 2, 6, 1, 2); u(ink, 5, 6, 1, 2);
    u(k.w, 3, 8, 3, 2); u('#e8747c', 4, 8, 1, 1);
    if (frame) {
        u(k.b, 7, 12, 2, 3); u(k.b, 10, 12, 2, 3); u(k.w, 7, 14, 2, 1); u(k.w, 10, 14, 2, 1);
    } else {
        p(k.b, 6, 12, 2, 3); p(k.b, 11, 12, 2, 3); p(k.w, 6, 14, 2, 1); p(k.w, 11, 14, 2, 1);
    }
}

// Front-facing sitting cat (16x16) for the cat world choir.
export function drawCatFront(ctx, x, y, palette = CAT_TUX, singing = false) {
    const k = palette;
    const p = painter(ctx, x, y);
    const ink = '#17131d';
    p(SHADOW, 3, 15, 10, 1);
    p(k.b, 12, 11, 2, 1); p(k.b, 13, 8, 1, 3);
    p(k.b, 4, 10, 8, 5); p(k.w, 6, 10, 4, 4);
    p(k.b, 3, 3, 10, 7); p(k.b, 3, 1, 3, 2); p(k.b, 10, 1, 3, 2); p(k.b, 4, 0, 1, 1); p(k.b, 11, 0, 1, 1);
    p('#e8747c', 4, 2, 1, 1); p('#e8747c', 11, 2, 1, 1);
    if (k.s) p(k.s, 7, 3, 2, 2);
    p(k.w, 6, 7, 4, 2); p('#e8747c', 7, 7, 2, 1);
    if (singing) {
        p(ink, 5, 6, 2, 1); p(ink, 9, 6, 2, 1);
        p(ink, 7, 8, 2, 2); p('#e8747c', 7, 9, 2, 1);
    } else {
        p(k.e, 5, 5, 2, 2); p(k.e, 9, 5, 2, 2); p(ink, 6, 5, 1, 2); p(ink, 10, 5, 1, 2);
    }
    p(k.w, 5, 14, 2, 1); p(k.w, 9, 14, 2, 1);
}
