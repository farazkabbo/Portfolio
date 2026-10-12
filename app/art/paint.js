// Pixel-art toolkit. Every sprite in the project is drawn in code from flat
// rectangles, so there are no image assets to load and everything stays crisp.

export const C = {
    ink: '#120b1c',
    night: '#1d1230',
    plum: '#2e1f47',
    grape: '#4a3570',
    lilac: '#8d7bb5',
    mist: '#b9b0d6',
    paper: '#ecebdd',
    sky: '#86b0ea',
    deep: '#5b84c9',
    amber: '#f2c66d',
    coral: '#e8747c',
    mint: '#7fd6b6',
    wood: '#7a5544',
    woodDark: '#5a3d33',
    woodLight: '#a9744f',
    white: '#ffffff',
};

export function makeCanvas(w, h, scale = 1) {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    cv.className = 'px';
    cv.style.width = `${w * scale}px`;
    cv.style.height = `${h * scale}px`;
    cv.setAttribute('aria-hidden', 'true');
    return cv;
}

// Returns p(color, x, y, w, h): fill a rectangle, offset by (ox, oy).
export function painter(ctx, ox = 0, oy = 0) {
    return (color, x, y, w = 1, h = 1) => {
        ctx.fillStyle = C[color] || color;
        ctx.fillRect(ox + x, oy + y, w, h);
    };
}

// Compact sprite format: "color x y w h; color x y w h; ..."
export function drawSpec(ctx, spec, ox = 0, oy = 0) {
    const p = painter(ctx, ox, oy);
    for (const part of spec.split(';')) {
        const [color, x, y, w = 1, h = 1] = part.trim().split(/\s+/);
        if (color) p(color, +x, +y, +w, +h);
    }
}
