// Bug Squash: whack the bugs before they reach production. Click, tap, or keys 1-9.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { icon } from '../art/icons.js';

const ROUND_SECONDS = 30;

export function bugs(host, { setStatus }) {
    const holes = Array.from({ length: 9 }, (_, i) =>
        h('button', { type: 'button', class: 'bugs__hole', 'aria-label': `Hole ${i + 1}, empty`, onClick: () => whack(i) }, h('kbd', null, String(i + 1))));
    const grid = h('div', { class: 'bugs', role: 'group', 'aria-label': 'Bug holes' }, holes);
    const msg = h('p', { class: 'game__msg', 'aria-live': 'polite' });
    const startBtn = h('button', { type: 'button', class: 'btn btn--small btn--primary', onClick: start }, 'Start');
    host.append(grid, msg, startBtn);

    let active = -1;
    let score = 0;
    let left = 0;
    let spawnTimer = 0;
    let clock = 0;

    function clear() {
        if (active < 0) return;
        holes[active].classList.remove('has-bug');
        holes[active].querySelector('canvas')?.remove();
        holes[active].setAttribute('aria-label', `Hole ${active + 1}, empty`);
        active = -1;
    }

    function spawn() {
        clear();
        let next;
        do { next = Math.floor(Math.random() * 9); } while (holes[next].classList.contains('has-bug'));
        active = next;
        holes[next].classList.add('has-bug');
        holes[next].append(icon('bug', 3));
        holes[next].setAttribute('aria-label', `Hole ${next + 1}, bug!`);
        spawnTimer = setTimeout(spawn, Math.max(450, 1000 - score * 25));
    }

    function whack(i) {
        if (left <= 0) return;
        if (i !== active) { sfx.hit(); return; }
        score++;
        sfx.coin();
        setStatus(`Squashed ${score} · ${left}s`);
        clearTimeout(spawnTimer);
        clear();
        spawnTimer = setTimeout(spawn, 180);
    }

    function stop() {
        clearTimeout(spawnTimer);
        clearInterval(clock);
        clear();
        left = 0;
    }

    function start() {
        stop();
        score = 0;
        left = ROUND_SECONDS;
        startBtn.textContent = 'Restart';
        msg.textContent = 'Squash them! Click, tap, or press 1–9.';
        setStatus(`Squashed 0 · ${left}s`);
        clock = setInterval(() => {
            left--;
            setStatus(`Squashed ${score} · ${Math.max(0, left)}s`);
            if (left <= 0) {
                stop();
                sfx.win();
                msg.textContent = `Time! ${score} bug${score === 1 ? '' : 's'} squashed. ${score >= 20 ? 'Ship it.' : 'QA wants a word.'}`;
            }
        }, 1000);
        spawn();
    }

    const onKey = (e) => {
        if (/^[1-9]$/.test(e.key)) { e.preventDefault(); whack(Number(e.key) - 1); }
    };
    window.addEventListener('keydown', onKey);
    msg.textContent = 'Bugs pop out of the holes. You have 30 seconds.';
    setStatus('Ready');
    startBtn.focus({ preventScroll: true });

    return () => { stop(); window.removeEventListener('keydown', onKey); };
}
