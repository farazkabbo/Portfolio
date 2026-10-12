// Title screen: logo, "press any key", contact shortcuts.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { makeCanvas } from '../art/paint.js';
import { icon } from '../art/icons.js';
import { ROOM_W, ROOM_H, drawRoomStatic, TALL_OBJECTS } from '../art/room.js';
import { profile } from '../content.js';
import { showVisitorCount } from '../core/visitors.js';

// Blurred snapshot of the room, used as a backdrop by the title and menu screens.
export function roomBackdrop() {
    const cv = makeCanvas(ROOM_W, ROOM_H);
    const ctx = cv.getContext('2d');
    drawRoomStatic(ctx);
    TALL_OBJECTS.forEach((o) => o.draw(ctx, 0));
    cv.className = 'px backdrop';
    cv.style.cssText = ''; // sized by CSS, not by the sprite scale
    return cv;
}

export function title(root, { go }) {
    const start = () => { sfx.confirm(); go('select'); };
    const link = (id, label, url) =>
        h('a', { class: 'title__social', href: url, target: '_blank', rel: 'noopener', 'aria-label': label, title: label }, icon(id, 2));
    const social = (id) => profile.socials.find((s) => s.id === id);

    const screen = h('main', { class: 'title', id: 'main' },
        roomBackdrop(),
        h('div', { class: 'title__inner' },
            h('h1', { class: 'logo', 'aria-label': `${profile.name} — portfolio` },
                h('span', { class: 'logo__line' }, 'Portfolio'),
                h('span', { class: 'logo__line' }, profile.shortName, h('em', null, '.exe')),
            ),
            h('button', { class: 'title__start', type: 'button' }, 'Press / touch any key to start'),
            h('nav', { class: 'title__socials', 'aria-label': 'Contact links' },
                link('mail', `Email ${profile.shortName}`, `mailto:${profile.email}`),
                link('linkedin', 'LinkedIn', social('linkedin').url),
                link('github', 'GitHub', social('github').url),
            ),
        ),
        h('p', { class: 'title__credit' }, `Developed by ${profile.name}`, h('span', { class: 'visitors' })),
    );
    root.append(screen);
    showVisitorCount(screen.querySelector('.visitors'));
    screen.querySelector('.title__start').focus({ preventScroll: true });

    const onKey = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey || ['Tab', 'Shift', 'Escape'].includes(e.key)) return;
        if (e.target.closest?.('a')) return;
        e.preventDefault();
        start();
    };
    const onClick = (e) => { if (!e.target.closest('a')) start(); };
    window.addEventListener('keydown', onKey);
    screen.addEventListener('click', onClick);
    return () => window.removeEventListener('keydown', onKey);
}
