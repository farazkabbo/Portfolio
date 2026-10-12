// A small window manager: focus, stacking, drag, resize, minimise, maximise,
// taskbar buttons and keyboard control. No third-party UI library.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { icon } from '../art/icons.js';

const MIN_W = 240;
const MIN_H = 160;

export function createWM({ layer, tasks, apps, api }) {
    const wins = new Map();
    let top = 10;
    let serial = 0;

    const bounds = () => layer.getBoundingClientRect();
    const compact = () => bounds().width < 640;
    const visible = () => [...wins.values()].filter((w) => !w.el.hidden).sort((a, b) => b.z - a.z);

    function place(win) {
        Object.assign(win.el.style, {
            left: `${win.x}px`, top: `${win.y}px`, width: `${win.w}px`, height: `${win.h}px`,
        });
    }

    function focus(win, moveFocus = true) {
        win.z = ++top;
        win.el.style.zIndex = win.z;
        wins.forEach((w) => {
            w.el.classList.toggle('is-active', w === win);
            w.task.classList.toggle('is-active', w === win);
            w.task.setAttribute('aria-pressed', String(w === win));
        });
        if (moveFocus && !win.el.contains(document.activeElement)) win.el.focus({ preventScroll: true });
    }

    function focusNext(fallback) {
        const next = visible()[0];
        if (next) focus(next);
        else {
            wins.forEach((w) => { w.task.classList.remove('is-active'); w.task.setAttribute('aria-pressed', 'false'); });
            fallback?.focus?.({ preventScroll: true });
        }
    }

    function close(win) {
        if (!wins.has(win.key)) return;
        sfx.close();
        win.cleanup?.();
        win.el.remove();
        win.task.remove();
        wins.delete(win.key);
        focusNext(win.opener?.isConnected ? win.opener : null);
    }

    function minimise(win) {
        sfx.close();
        win.el.hidden = true;
        focusNext(win.task);
    }

    function toggleMax(win) {
        win.el.classList.toggle('is-max');
        sfx.move();
    }

    function open(id, arg) {
        const app = apps[id];
        if (!app) return null;
        const key = app.keyFor ? app.keyFor(arg) : id;
        const existing = wins.get(key);
        if (existing) {
            existing.el.hidden = false;
            existing.onArg?.(arg);
            focus(existing);
            return existing;
        }

        sfx.open();
        const n = ++serial;
        const titleText = app.titleFor ? app.titleFor(arg) : app.title;
        const titleId = `win-title-${n}`;
        const body = h('div', { class: `win__body win__body--${id}` });
        const ctl = (cls, label, fn) => h('button', { class: `win__ctl win__ctl--${cls}`, type: 'button', 'aria-label': `${label} ${titleText}`, title: label, onClick: fn });
        const win = { key, z: 0, opener: document.activeElement };
        const bar = h('header', { class: 'win__bar' },
            icon(app.icon, 1),
            h('h2', { class: 'win__title', id: titleId }, titleText),
            h('div', { class: 'win__ctls' },
                ctl('min', 'Minimise', () => minimise(win)),
                ctl('max', 'Maximise', () => toggleMax(win)),
                ctl('close', 'Close', () => close(win)),
            ),
        );
        const grip = h('div', { class: 'win__grip', 'aria-hidden': 'true' });
        win.el = h('section', { class: 'win', role: 'dialog', 'aria-labelledby': titleId, tabindex: '-1' }, bar, body, grip);
        win.task = h('button', { class: 'task', type: 'button', 'aria-pressed': 'false' }, icon(app.icon, 1), h('span', null, titleText));
        win.task.addEventListener('click', () => {
            if (win.el.hidden) { win.el.hidden = false; sfx.open(); focus(win); }
            else if (win.el.classList.contains('is-active')) minimise(win);
            else focus(win);
        });

        const b = bounds();
        win.w = Math.min(app.w || 420, b.width - 16);
        win.h = Math.min(app.h || 320, b.height - 16);
        win.x = Math.max(8, Math.min(b.width - win.w - 8, 230 + ((n - 1) % 6) * 28));
        win.y = Math.max(8, Math.min(b.height - win.h - 8, 24 + ((n - 1) % 6) * 24));
        if (compact()) win.el.classList.add('is-max');
        place(win);

        // --- pointer: focus, drag, resize ---
        win.el.addEventListener('pointerdown', () => focus(win, false), true);
        const track = (handle, onMove) => {
            handle.addEventListener('pointerdown', (e) => {
                if (e.button !== 0 || e.target.closest('button') || win.el.classList.contains('is-max')) return;
                e.preventDefault();
                if (!win.el.contains(document.activeElement)) win.el.focus({ preventScroll: true });
                const start ={ px: e.clientX, py: e.clientY, x: win.x, y: win.y, w: win.w, h: win.h };
                handle.setPointerCapture(e.pointerId);
                const move = (ev) => { onMove(start, ev.clientX - start.px, ev.clientY - start.py); place(win); };
                const up = () => {
                    handle.removeEventListener('pointermove', move);
                    handle.removeEventListener('pointerup', up);
                    handle.removeEventListener('pointercancel', up);
                };
                handle.addEventListener('pointermove', move);
                handle.addEventListener('pointerup', up);
                handle.addEventListener('pointercancel', up);
            });
        };
        const clampPos = () => {
            const r = bounds();
            win.x = Math.max(80 - win.w, Math.min(r.width - 80, win.x));
            win.y = Math.max(0, Math.min(r.height - 32, win.y));
        };
        track(bar, (s, dx, dy) => { win.x = s.x + dx; win.y = s.y + dy; clampPos(); });
        track(grip, (s, dx, dy) => { win.w = Math.max(MIN_W, s.w + dx); win.h = Math.max(MIN_H, s.h + dy); });
        bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button')) toggleMax(win); });

        // --- keyboard: Esc closes, Alt + arrows move ---
        win.el.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); close(win); return; }
            const delta = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[e.key];
            if (e.altKey && delta && !win.el.classList.contains('is-max')) {
                e.preventDefault();
                win.x += delta[0]; win.y += delta[1];
                clampPos();
                place(win);
            }
        });

        wins.set(key, win);
        layer.append(win.el);
        tasks.append(win.task);
        const result = app.render(body, { ...api, open, close: () => close(win) }, arg) || {};
        win.cleanup = result.cleanup;
        win.onArg = result.onArg;
        focus(win);
        return win;
    }

    return {
        open,
        closeAll: () => [...wins.values()].forEach((w) => { w.cleanup?.(); w.el.remove(); w.task.remove(); wins.delete(w.key); }),
    };
}
