// "Select your journey": pick how deep you want to go.
import { h, roving } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { icon } from '../art/icons.js';
import { playerIcon } from '../art/sprites.js';
import { fxButton, soundButton, musicButton, trophyButton } from '../core/hud.js';
import { roomBackdrop } from './title.js';
import { showVisitorCount } from '../core/visitors.js';

const JOURNEYS = [
    { id: 'room', label: 'Full Experience', hint: 'Walk around my room', art: () => playerIcon(3) },
    { id: 'resume', label: 'Résumé', hint: 'Just the facts', art: () => icon('resume', 4) },
    { id: 'os', label: 'Operating System', hint: 'Projects on a retro desktop', art: () => icon('computer', 4) },
    { id: 'games', label: 'Video Game', hint: 'Mini-games and save files', art: () => icon('gamepad', 4) },
];

export function select(root, { go }) {
    const list = h('div', { class: 'select__list', role: 'group', 'aria-labelledby': 'select-title' },
        JOURNEYS.map((j) =>
            h('button', {
                class: 'select__item', type: 'button',
                onClick: () => { sfx.confirm(); go(j.id); },
                onMouseenter: () => sfx.move(),
            },
                h('span', { class: 'select__art' }, j.art()),
                h('span', { class: 'select__label' }, j.label),
                h('span', { class: 'select__hint' }, j.hint),
            )),
    );

    root.append(h('main', { class: 'select', id: 'main' },
        roomBackdrop(),
        h('div', { class: 'hud', role: 'toolbar', 'aria-label': 'Settings' }, fxButton(), soundButton(), musicButton(), trophyButton()),
        h('div', { class: 'select__inner' },
            h('h1', { class: 'select__title', id: 'select-title' }, 'Select your Journey'),
            list,
            h('p', { class: 'select__alt' },
                'Prefer plain scrolling? ',
                h('a', { href: './classic.html' }, 'Open the classic site'),
            ),
            h('p', { class: 'select__alt visitors' }),
        ),
    ));

    showVisitorCount(root.querySelector('.visitors'));
    const nav = roving(list, '.select__item', { onMove: () => sfx.move() });
    nav.select(0);

    const onKey = (e) => { if (e.key === 'Escape') go('title'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
}
