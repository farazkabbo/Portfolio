// 16x16 pixel icons, written in the "color x y w h" rect format from paint.js.
import { makeCanvas, drawSpec } from './paint.js';

const ICONS = {
    // --- HUD ---
    home: 'ink 7 2 2 1;ink 6 3 4 1;ink 5 4 6 1;ink 4 5 8 1;ink 3 6 10 1;ink 2 7 12 1;ink 4 8 8 6;sky 7 10 2 4',
    back: 'ink 7 3 2 2;ink 5 5 2 2;ink 3 7 10 2;ink 5 9 2 2;ink 7 11 2 2',
    soundOn: 'ink 2 6 3 4;ink 5 5 1 6;ink 6 4 1 8;ink 7 3 1 10;ink 10 5 1 1;ink 11 6 1 4;ink 10 10 1 1;ink 12 3 1 1;ink 13 4 1 8;ink 12 12 1 1',
    soundOff: 'ink 2 6 3 4;ink 5 5 1 6;ink 6 4 1 8;ink 7 3 1 10;ink 10 5 1 1;ink 11 6 1 1;ink 12 7 1 2;ink 13 9 1 1;ink 14 10 1 1;ink 14 5 1 1;ink 13 6 1 1;ink 11 9 1 1;ink 10 10 1 1',
    fx: 'ink 5 4 6 1;ink 3 5 2 1;ink 11 5 2 1;ink 2 6 1 1;ink 13 6 1 1;ink 1 7 1 2;ink 14 7 1 2;ink 2 9 1 1;ink 13 9 1 1;ink 3 10 2 1;ink 11 10 2 1;ink 5 11 6 1;ink 6 6 4 4;paper 7 7 2 2',
    list: 'ink 2 3 2 2;ink 6 3 8 2;ink 2 7 2 2;ink 6 7 8 2;ink 2 11 2 2;ink 6 11 8 2',
    music: 'ink 6 2 8 2;ink 6 4 2 8;ink 12 4 2 6;ink 3 10 5 4;ink 9 8 5 4',
    trophyHud: 'ink 3 2 10 1;ink 4 3 8 5;ink 1 3 2 3;ink 13 3 2 3;ink 5 8 6 1;ink 7 9 2 3;ink 4 12 8 2',
    power: 'ink 7 1 2 7;ink 4 4 2 2;ink 10 4 2 2;ink 2 6 2 5;ink 12 6 2 5;ink 4 11 2 2;ink 10 11 2 2;ink 6 13 4 1',
    // --- socials ---
    mail: 'night 1 3 14 10;paper 2 4 12 8;night 2 4 2 1;night 4 5 2 1;night 6 6 1 1;night 7 7 2 1;night 9 6 1 1;night 10 5 2 1;night 12 4 2 1',
    linkedin: 'deep 1 1 14 14;sky 2 2 12 1;paper 3 6 2 7;paper 3 3 2 2;paper 7 6 2 7;paper 9 6 3 2;paper 11 8 2 5',
    github: 'night 1 1 14 14;paper 4 3 2 3;paper 10 3 2 3;paper 3 5 10 5;paper 4 10 8 2;paper 6 12 4 2;night 5 7 2 2;night 9 7 2 2;paper 2 11 2 1',
    youtube: 'coral 1 3 14 10;coral 2 2 12 12;paper 6 5 1 6;paper 7 6 1 4;paper 8 6 1 4;paper 9 7 1 2',
    instagram: 'coral 2 1 12 14;coral 1 2 14 12;paper 3 3 10 10;coral 4 4 8 8;paper 6 6 4 4;coral 7 7 2 2;paper 10 4 1 1',
    // --- journeys / desktop ---
    resume: 'night 2 0 12 16;paper 3 1 10 14;sky 3 1 10 2;lilac 5 5 6 1;lilac 5 7 6 1;lilac 5 9 6 1;lilac 5 11 4 1;coral 12 9 2 2;amber 11 11 2 2;amber 10 13 2 2;night 9 15 2 1',
    computer: 'night 1 1 14 10;plum 2 2 12 8;sky 3 3 10 6;paper 4 4 4 1;paper 4 6 6 1;night 6 11 4 2;night 3 13 10 2;mist 4 13 8 1',
    gamepad: 'night 1 5 14 8;night 2 4 12 1;night 2 13 3 1;night 11 13 3 1;mist 2 6 12 6;night 4 7 1 3;night 3 8 3 1;coral 11 7 1 1;sky 12 8 1 1;amber 10 8 1 1;mint 11 9 1 1;night 7 9 2 1',
    browser: 'night 4 1 8 14;night 1 4 14 8;night 2 2 12 12;sky 4 2 8 12;sky 2 4 12 8;mint 5 3 3 3;mint 4 6 5 3;mint 9 8 4 3;mint 7 11 3 2;paper 10 4 2 1',
    folder: 'night 1 3 7 2;night 1 4 14 10;amber 2 4 5 1;amber 2 5 12 8;woodLight 2 12 12 1;paper 3 6 10 1',
    terminal: 'night 1 2 14 12;ink 2 4 12 9;mist 2 3 12 1;mint 3 6 1 1;mint 4 7 1 1;mint 3 8 1 1;mint 6 8 3 1',
    paint: 'night 3 2 9 1;night 2 3 12 1;night 1 4 14 7;night 2 11 9 1;night 3 12 7 1;paper 3 3 9 1;paper 2 4 12 7;paper 3 11 7 1;coral 4 5 2 2;amber 8 4 2 2;mint 11 6 2 2;sky 5 8 2 2;night 10 9 2 2',
    trophy: 'night 3 1 10 1;amber 4 2 8 6;amber 2 3 2 3;amber 12 3 2 3;paper 5 3 1 3;amber 5 8 6 1;amber 7 9 2 3;night 4 12 8 2;amber 5 12 6 1',
    trash: 'night 6 1 4 1;night 2 2 12 2;night 3 4 10 11;mist 4 5 8 9;night 5 6 1 7;night 7 6 2 7;night 10 6 1 7',
    info: 'night 2 1 12 14;sky 3 2 10 12;paper 7 4 2 2;paper 6 7 3 1;paper 7 8 2 4;paper 6 12 4 1',
    star: 'amber 7 1 2 3;amber 6 4 4 2;amber 1 6 14 2;amber 3 8 10 2;amber 4 10 8 2;amber 3 12 4 2;amber 9 12 4 2;paper 7 5 1 2',
    bug: 'night 4 1 1 2;night 11 1 1 2;night 5 3 6 2;coral 4 5 8 8;night 7 5 2 8;night 1 6 3 1;night 12 6 3 1;night 1 9 3 1;night 12 9 3 1;night 2 12 2 1;night 12 12 2 1;paper 5 7 1 1;paper 10 7 1 1',
    snake: 'mint 2 3 9 3;mint 2 6 3 4;mint 2 10 12 3;night 9 4 1 1;coral 11 4 2 1;amber 12 6 2 2',
    cards: 'night 1 2 8 11;paper 2 3 6 9;coral 4 6 2 3;night 7 4 8 11;sky 8 5 6 9;paper 10 8 2 3',
    lock: 'night 5 2 6 1;night 4 3 2 4;night 10 3 2 4;night 3 7 10 8;lilac 4 8 8 6;night 7 10 2 3',
    art: 'night 2 1 12 14;coral 3 2 10 12;mist 4 2 1 12;paper 6 4 6 6;amber 7 5 2 2;deep 9 7 2 2;mint 7 8 2 1',
    cat: 'night 3 2 2 3;night 11 2 2 3;night 3 4 10 8;night 4 12 8 1;amber 5 7 2 2;amber 9 7 2 2;coral 7 10 2 1',
    save: 'night 2 1 12 14;mist 3 2 10 12;night 5 2 6 4;paper 6 2 3 3;paper 4 8 8 5;lilac 5 10 6 1',
};

export function icon(name, scale = 2) {
    const cv = makeCanvas(16, 16, scale);
    drawSpec(cv.getContext('2d'), ICONS[name] || ICONS.info);
    return cv;
}

// The dark-on-light HUD icons recoloured for use on dark backgrounds.
export function iconLight(name, scale = 2) {
    const cv = makeCanvas(16, 16, scale);
    drawSpec(cv.getContext('2d'), (ICONS[name] || ICONS.info).replaceAll('ink', 'paper'));
    return cv;
}
