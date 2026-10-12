// The game console: a memory-card browser. Slots are either playable
// mini-games or "save files" for the featured projects.
import { h, roving } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { hud } from '../core/hud.js';
import { award } from '../core/progress.js';
import { makeCanvas, painter } from '../art/paint.js';
import { icon } from '../art/icons.js';
import { snake } from '../games/snake.js';
import { memory } from '../games/memory.js';
import { bugs } from '../games/bugs.js';
import { projects } from '../content.js';

const GAMES = [
    { id: 'snake', name: 'Snake', icon: 'snake', tags: 'Canvas, JS', desc: 'The classic. Eat, grow, and try not to bite your own tail.', run: snake },
    { id: 'memory', name: 'Stack Match', icon: 'cards', tags: 'DOM, JS', desc: 'A memory game built from my tech stack. Match every pair in as few moves as you can.', run: memory },
    { id: 'bugs', name: 'Bug Squash', icon: 'bug', tags: 'DOM, JS', desc: 'Thirty seconds, nine holes, endless bugs. Squash them before they reach production.', run: bugs },
];

const SLOTS = [
    ...GAMES.map((g) => ({ ...g, type: 'GAME', size: '8KB' })),
    ...projects.filter((p) => p.featured).map((p) => ({
        id: p.id, name: p.name, short: p.short, icon: 'save', tags: p.tech.join(', '), desc: p.desc, type: 'SAVE', size: p.badge, link: p.link,
    })),
];

// A little cartridge with the slot's icon on its label.
function cartridge(iconName, scale = 3) {
    const cv = makeCanvas(24, 24, scale);
    const ctx = cv.getContext('2d');
    const p = painter(ctx);
    p('night', 1, 0, 22, 24); p('lilac', 2, 1, 20, 22); p('mist', 2, 1, 20, 1);
    p('night', 3, 2, 18, 18); p('paper', 4, 3, 16, 16);
    p('night', 6, 21, 2, 2); p('night', 11, 21, 2, 2); p('night', 16, 21, 2, 2);
    ctx.drawImage(icon(iconName, 1), 4, 3);
    return cv;
}

export function games(root, { go }) {
    let current = SLOTS[0];
    let stopGame = null;

    // ---- info card ----
    const title = h('h1', { class: 'card__title' });
    const tags = h('dd');
    const type = h('dd');
    const desc = h('dd');
    const status = h('strong', { class: 'memcard__ok' }, 'OK');
    const action = h('button', { type: 'button', class: 'btn btn--primary', onClick: () => activate(current) });
    const card = h('section', { class: 'memcard', 'aria-live': 'polite' },
        h('p', { class: 'memcard__legend' }, 'Memory Card (Slot 1)'),
        h('div', { class: 'memcard__main' },
            title,
            h('dl', null, h('dt', null, 'Tags:'), tags, h('dt', null, 'Type:'), type, h('dt', null, 'Desc:'), desc),
            h('div', { class: 'row' }, action)),
        h('div', { class: 'memcard__side' }, h('span', null, 'Status'), status, h('div', { class: 'memcard__bar' })),
    );

    function describe(slot) {
        current = slot;
        title.textContent = slot.name;
        tags.textContent = slot.tags;
        type.textContent = slot.type;
        desc.textContent = `“${slot.desc}”`;
        action.textContent = slot.type === 'GAME' ? 'Play' : slot.link ? 'View project ↗' : 'No link yet';
        action.disabled = slot.type !== 'GAME' && !slot.link;
    }

    // ---- slots ----
    const list = h('div', { class: 'slots', role: 'group', 'aria-label': 'Memory card slots' },
        SLOTS.map((slot) => h('button', { type: 'button', class: 'slot', onClick: () => activate(slot) },
            h('span', { class: 'slot__art' }, cartridge(slot.icon)),
            h('span', { class: 'slot__name' }, slot.short || slot.name),
            h('span', { class: 'slot__size' }, slot.size))));
    const perRow = () => {
        const tops = [...list.children].map((el) => el.offsetTop);
        return tops.filter((t) => t === tops[0]).length;
    };

    // ---- game overlay ----
    const gameTitle = h('h2', { id: 'game-title' });
    const gameStatus = h('p', { class: 'game__status', 'aria-live': 'polite' });
    const gameBody = h('div', { class: 'game__body' });
    const overlay = h('div', { class: 'game', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'game-title', hidden: true },
        h('div', { class: 'game__frame' },
            h('header', { class: 'game__head' }, gameTitle, gameStatus,
                h('button', { type: 'button', class: 'btn btn--small', onClick: () => quit() }, 'Quit')),
            gameBody));

    function activate(slot) {
        describe(slot);
        if (slot.type !== 'GAME') {
            if (slot.link) { sfx.confirm(); window.open(slot.link, '_blank', 'noopener'); } else sfx.error();
            return;
        }
        sfx.confirm();
        award('gamer');
        gameTitle.textContent = slot.name;
        gameBody.replaceChildren();
        overlay.hidden = false;
        stopGame = slot.run(gameBody, { setStatus: (t) => { gameStatus.textContent = t; } });
    }

    function quit() {
        if (overlay.hidden) return;
        sfx.cancel();
        stopGame?.();
        stopGame = null;
        overlay.hidden = true;
        gameBody.replaceChildren();
        list.querySelector('[tabindex="0"]')?.focus();
    }

    root.append(h('main', { class: 'console', id: 'main' },
        hud(go),
        card,
        list,
        h('footer', { class: 'console__keys', 'aria-hidden': 'true' },
            h('span', null, h('kbd', null, '↵'), 'Enter'), h('span', null, h('kbd', null, 'Esc'), 'Back'), h('span', null, h('kbd', null, '←→'), 'Select')),
        overlay,
    ));

    const nav = roving(list, '.slot', { cols: perRow, onMove: (i) => { describe(SLOTS[i]); sfx.move(); } });
    list.addEventListener('mouseover', (e) => {
        const btn = e.target.closest('.slot');
        if (btn) describe(SLOTS[[...list.children].indexOf(btn)]);
    });
    describe(SLOTS[0]);
    nav.select(0);

    const onKey = (e) => {
        if (e.key !== 'Escape' || document.querySelector('.trophies')) return;
        if (!overlay.hidden) quit();
        else go('select');
    };
    window.addEventListener('keydown', onKey);
    return () => { stopGame?.(); window.removeEventListener('keydown', onKey); };
}
