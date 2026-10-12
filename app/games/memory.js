// Stack Match: find the pairs of technologies.
import { h, roving, announce } from '../core/dom.js';
import { sfx } from '../core/audio.js';

const STACK = ['Java', 'Python', 'React', 'SQL', 'AWS', 'Docker', 'Git', 'Flask'];

export function memory(host, { setStatus }) {
    const grid = h('div', { class: 'memory', role: 'group', 'aria-label': 'Cards' });
    const msg = h('p', { class: 'game__msg', 'aria-live': 'polite' }, 'Flip two cards at a time and match the pairs.');
    const again = h('button', { type: 'button', class: 'btn btn--small', onClick: deal }, 'Shuffle & restart');
    host.append(grid, msg, again);

    let open = [];
    let moves = 0;
    let found = 0;
    let lock = 0;
    let nav = null;

    function deal() {
        clearTimeout(lock);
        lock = 0; open = []; moves = 0; found = 0;
        setStatus('Moves 0');
        msg.textContent = 'Flip two cards at a time and match the pairs.';
        const deck = [...STACK, ...STACK].map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
        grid.replaceChildren(...deck.map((value, i) => {
            const card = h('button', { type: 'button', class: 'memory__card', 'aria-label': `Card ${i + 1}, face down` }, h('span', null, '?'));
            card.addEventListener('click', () => flip(card, value, i));
            return card;
        }));
        if (nav) nav.select(0, false);
        else nav = roving(grid, '.memory__card', { cols: 4 });
    }

    function show(card, value, i, up) {
        card.classList.toggle('is-up', up);
        card.firstChild.textContent = up ? value : '?';
        card.setAttribute('aria-label', up ? `Card ${i + 1}, ${value}` : `Card ${i + 1}, face down`);
    }

    function flip(card, value, i) {
        if (lock || card.classList.contains('is-up')) return;
        show(card, value, i, true);
        sfx.move();
        open.push({ card, value, i });
        if (open.length < 2) return;
        moves++;
        setStatus(`Moves ${moves}`);
        const [a, b] = open;
        open = [];
        if (a.value === b.value) {
            a.card.classList.add('is-done'); b.card.classList.add('is-done');
            found++;
            sfx.coin();
            announce(`Matched ${a.value}`);
            if (found === STACK.length) { sfx.win(); msg.textContent = `Full stack! Solved in ${moves} moves.`; }
            return;
        }
        lock = setTimeout(() => { show(a.card, a.value, a.i, false); show(b.card, b.value, b.i, false); lock = 0; }, 800);
    }

    deal();
    grid.querySelector('button').focus({ preventScroll: true });
    return () => clearTimeout(lock);
}
