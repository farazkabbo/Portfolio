// The little row of square buttons (home, effects, sound, music, trophies) shared by the scenes.
import { h } from './dom.js';
import { icon } from '../art/icons.js';
import { getPref, setPref } from './prefs.js';
import { sfx } from './audio.js';
import { openTrophyPanel } from './progress.js';

export function hudButton(iconName, label, onClick) {
    return h('button', { class: 'hud__btn', type: 'button', 'aria-label': label, title: label, onClick }, icon(iconName, 2));
}

function toggleButton(pref, label, iconFor) {
    const btn = hudButton(iconFor(getPref(pref)), label, () => {
        const next = !getPref(pref);
        setPref(pref, next);
        btn.replaceChildren(icon(iconFor(next), 2));
        btn.setAttribute('aria-pressed', String(next));
        sfx.select();
    });
    btn.setAttribute('aria-pressed', String(getPref(pref)));
    return btn;
}

export const soundButton = () => toggleButton('sound', 'Sound effects', (on) => (on ? 'soundOn' : 'soundOff'));
export const musicButton = () => toggleButton('music', 'Music', () => 'music');
export const fxButton = () => toggleButton('fx', 'CRT screen effect', () => 'fx');
export const trophyButton = () => {
    const btn = hudButton('trophyHud', 'Achievements', () => openTrophyPanel(btn));
    return btn;
};

export function hud(go, { home = 'select', homeLabel = 'Back to menu', extra = [] } = {}) {
    return h('div', { class: 'hud', role: 'toolbar', 'aria-label': 'Game controls' },
        hudButton('home', homeLabel, () => { sfx.cancel(); go(home); }),
        fxButton(),
        soundButton(),
        musicButton(),
        trophyButton(),
        extra,
    );
}
