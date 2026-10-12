// Visitor progress: which objects were inspected, hidden items found and
// achievements unlocked. Saved in localStorage when the browser allows it.
import { h, announce } from './dom.js';
import { sfx } from './audio.js';
import { icon } from '../art/icons.js';
import { badges, secrets } from '../content.js';

const KEY = 'faraz-exe:progress';
const state = { seen: new Set(), items: new Set(), badges: new Set() };

try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    for (const k of Object.keys(state)) (saved[k] || []).forEach((v) => state[k].add(v));
} catch { /* storage unavailable or corrupt: start fresh */ }

function save() {
    try {
        localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(Object.entries(state).map(([k, v]) => [k, [...v]]))));
    } catch { /* storage unavailable */ }
}

export const progress = {
    seen: (id) => state.seen.has(id),
    hasItem: (id) => state.items.has(id),
    hasBadge: (id) => state.badges.has(id),
    seenCount: () => state.seen.size,
    itemCount: () => state.items.size,
    badgeCount: () => state.badges.size,
    // 0..1: how much of everything has been found. Drives the sky outside the window.
    universe: () => (state.badges.size + state.items.size) / (badges.length + Object.keys(secrets).length),
};

export function markSeen(id) {
    if (state.seen.has(id)) return false;
    state.seen.add(id);
    save();
    return true;
}

export function collect(id) {
    if (state.items.has(id)) return false;
    state.items.add(id);
    save();
    if (state.items.size === Object.keys(secrets).length) award('treasure');
    return true;
}

// ---- toasts ----
function toast(kind, title, text) {
    let host = document.getElementById('toasts');
    if (!host) {
        host = h('div', { id: 'toasts', class: 'toasts', 'aria-hidden': 'true' });
        document.body.append(host);
    }
    const el = h('div', { class: `toast toast--${kind}` }, icon(kind === 'item' ? 'star' : 'trophyHud', 2),
        h('div', null, h('strong', null, title), h('span', null, text)));
    host.append(el);
    setTimeout(() => el.classList.add('is-leaving'), 3600);
    setTimeout(() => el.remove(), 4100);
}

export function award(id) {
    const badge = badges.find((b) => b.id === id);
    if (!badge || state.badges.has(id)) return false;
    state.badges.add(id);
    save();
    sfx.win();
    toast('badge', 'Achievement unlocked', badge.title);
    announce(`Achievement unlocked: ${badge.title}`);
    return true;
}

export function itemToast(name) {
    sfx.coin();
    toast('item', 'Hidden item found', `${name} (${state.items.size}/${Object.keys(secrets).length})`);
}

// ---- achievements panel ----
export function openTrophyPanel(returnFocus) {
    document.querySelector('.trophies')?.remove();
    const close = () => { panel.remove(); window.removeEventListener('keydown', onKey, true); returnFocus?.focus?.(); };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    const closeBtn = h('button', { type: 'button', class: 'btn btn--small', onClick: close }, 'Close');
    const panel = h('div', { class: 'trophies', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'trophies-title' },
        h('div', { class: 'trophies__sheet' },
            h('header', null,
                h('h2', { id: 'trophies-title' }, `Achievements ${state.badges.size}/${badges.length}`), closeBtn),
            h('ul', { class: 'trophies__list' }, badges.map((b) => {
                const got = state.badges.has(b.id);
                return h('li', { class: got ? 'is-got' : '' }, icon(got ? 'trophy' : 'lock', 2),
                    h('div', null, h('strong', null, got ? b.title : '???'), h('span', null, b.hint)));
            })),
            h('h3', null, `Hidden items ${state.items.size}/${Object.keys(secrets).length}`),
            h('ul', { class: 'trophies__items' }, Object.entries(secrets).map(([id, s]) =>
                h('li', { class: state.items.has(id) ? 'is-got' : '' }, state.items.has(id) ? s.item : '?'))),
            h('button', {
                type: 'button', class: 'linkbtn trophies__reset',
                onClick: () => { Object.values(state).forEach((set) => set.clear()); save(); close(); },
            }, 'Reset progress'),
        ));
    panel.addEventListener('click', (e) => { if (e.target === panel) close(); });
    window.addEventListener('keydown', onKey, true);
    document.body.append(panel);
    sfx.open();
    closeBtn.focus();
}
