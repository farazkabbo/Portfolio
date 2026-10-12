// The art diary: a sketchbook you can flip through. Used as an overlay in the
// room and inside a window on the desktop.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { award } from '../core/progress.js';
import { art, profile } from '../content.js';

export function createGallery() {
    const seen = new Set();
    let index = 0;

    const img = h('img', { class: 'diary__img', alt: '' });
    const title = h('h3', { class: 'diary__title' });
    const note = h('p', { class: 'diary__note' });
    const count = h('span', { class: 'diary__count', 'aria-live': 'polite' });
    const prev = h('button', { type: 'button', class: 'btn btn--small', 'aria-label': 'Previous page', onClick: () => show(index - 1) }, '◀ Prev');
    const next = h('button', { type: 'button', class: 'btn btn--small btn--primary', 'aria-label': 'Next page', onClick: () => show(index + 1) }, 'Next ▶');
    const insta = profile.socials.find((s) => s.id === 'instagram');

    const el = h('div', { class: 'diary', tabindex: '0', role: 'group', 'aria-label': 'Art diary. Use the left and right arrow keys to turn pages.' },
        h('div', { class: 'diary__spine', 'aria-hidden': 'true' }),
        h('figure', { class: 'diary__page' }, img, h('figcaption', null, title, note)),
        h('div', { class: 'diary__nav' }, prev, count, next),
        insta && h('p', { class: 'diary__more' }, 'More of my art on ', h('a', { href: insta.url, target: '_blank', rel: 'noopener' }, 'Instagram'), '.'),
    );

    function show(i) {
        index = (i + art.length) % art.length;
        const piece = art[index];
        img.src = piece.src;
        img.alt = `${piece.title} — artwork by ${profile.shortName}`;
        title.textContent = piece.title;
        note.textContent = piece.note;
        count.textContent = `Page ${index + 1} of ${art.length}`;
        el.classList.remove('is-turning');
        void el.offsetWidth; // restart the page-turn animation
        el.classList.add('is-turning');
        sfx.move();
        seen.add(index);
        if (seen.size === art.length) award('artlover');
    }

    el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); show(index + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); show(index - 1); }
    });
    show(0);
    return el;
}

// Full-screen version used by the room. Returns a function that closes it.
export function openDiary(host, onClose) {
    const gallery = createGallery();
    const close = () => {
        overlay.remove();
        window.removeEventListener('keydown', onKey, true);
        sfx.close();
        onClose?.();
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    const overlay = h('div', { class: 'diary-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Art diary' },
        h('div', { class: 'diary-overlay__inner' },
            h('header', null, h('h2', null, 'Art Diary'), h('button', { type: 'button', class: 'btn btn--small', onClick: close }, 'Close')),
            gallery));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    window.addEventListener('keydown', onKey, true);
    host.append(overlay);
    sfx.open();
    gallery.focus({ preventScroll: true });
    return close;
}
