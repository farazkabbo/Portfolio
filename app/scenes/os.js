// FarazOS: desktop icons, windows, taskbar, start menu and a helpful robot.
import { h, reducedMotion } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { fxButton, soundButton, musicButton, trophyButton } from '../core/hud.js';
import { award } from '../core/progress.js';
import { icon } from '../art/icons.js';
import { portrait } from '../art/sprites.js';
import { createWM } from '../os/wm.js';
import { APPS, DESKTOP } from '../os/apps.js';

let booted = false;

export function os(root, { go }) {
    const layer = h('div', { class: 'os__windows' });
    const tasks = h('div', { class: 'taskbar__tasks', role: 'group', 'aria-label': 'Open windows' });
    const wm = createWM({ layer, tasks, apps: APPS, api: { go } });
    const timers = [];

    const launch = (item) => {
        if (item.go) { sfx.confirm(); go(item.go); } else wm.open(item.app);
    };

    // ---- desktop icons ----
    const icons = h('ul', { class: 'os__icons', 'aria-label': 'Desktop' },
        DESKTOP.map((item) => h('li', null,
            h('button', { type: 'button', class: 'deskicon', onClick: () => launch(item) },
                icon(item.icon, 3), h('span', null, item.label)))));

    // ---- start menu ----
    const startMenu = h('div', { class: 'startmenu', role: 'menu', 'aria-label': 'Start menu', hidden: true },
        h('div', { class: 'startmenu__head' }, 'FarazOS'),
        DESKTOP.map((item) => h('button', { type: 'button', role: 'menuitem', class: 'startmenu__item', onClick: () => { toggleStart(false); launch(item); } },
            icon(item.icon, 1), item.label)),
        h('a', { class: 'startmenu__item', role: 'menuitem', href: './classic.html' }, icon('browser', 1), 'Classic site'),
        h('button', { type: 'button', role: 'menuitem', class: 'startmenu__item startmenu__item--off', onClick: () => { sfx.cancel(); go('select'); } },
            icon('power', 1), 'Shut down'),
    );
    const startBtn = h('button', { type: 'button', class: 'taskbar__start', 'aria-haspopup': 'menu', 'aria-expanded': 'false', onClick: () => toggleStart() },
        icon('star', 1), 'START');
    function toggleStart(force) {
        const show = force ?? startMenu.hidden;
        startMenu.hidden = !show;
        startBtn.setAttribute('aria-expanded', String(show));
        if (show) { sfx.open(); startMenu.querySelector('[role="menuitem"]').focus(); }
    }
    startMenu.addEventListener('keydown', (e) => {
        const items = [...startMenu.querySelectorAll('[role="menuitem"]')];
        const i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
        if (e.key === 'Escape') { toggleStart(false); startBtn.focus(); }
    });
    const onDocPointer = (e) => {
        if (!startMenu.hidden && !e.target.closest('.startmenu, .taskbar__start')) toggleStart(false);
    };

    // ---- clock ----
    const clock = h('time', { class: 'taskbar__clock' });
    const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
    tick();
    timers.push(setInterval(tick, 15000));

    // ---- assistant ----
    const assistant = h('aside', { class: 'assistant', 'aria-label': 'Assistant', hidden: true },
        h('div', { class: 'assistant__bubble' },
            h('p', null, 'Looks like you’re exploring a portfolio. Want to see the résumé?'),
            h('div', { class: 'row' },
                h('button', { type: 'button', class: 'btn btn--small btn--primary', onClick: () => { assistant.hidden = true; wm.open('resume'); } }, 'Sure'),
                h('button', { type: 'button', class: 'btn btn--small', onClick: () => { assistant.hidden = true; sfx.cancel(); } }, 'No thanks'))),
        portrait('Cutebot', 2),
    );

    // ---- boot screen (first visit only) ----
    const boot = h('div', { class: 'os__boot', 'aria-hidden': 'true' },
        h('p', { class: 'os__bootlogo' }, 'FarazOS'), h('div', { class: 'os__bootbar' }, h('span')), h('p', null, 'Starting up…'));

    const desktop = h('div', { class: 'os__desktop' }, icons, layer, assistant);
    root.append(h('main', { class: 'os', id: 'main' },
        desktop,
        startMenu,
        h('footer', { class: 'taskbar' },
            startBtn, tasks,
            h('div', { class: 'taskbar__tray' }, trophyButton(), fxButton(), soundButton(), musicButton(), clock)),
        boot,
    ));

    const ready = () => {
        boot.remove();
        wm.open('welcome');
        timers.push(setTimeout(() => award('boot'), 1200));
        timers.push(setTimeout(() => { assistant.hidden = false; sfx.move(); }, 6000));
    };
    if (booted || reducedMotion()) ready();
    else {
        booted = true;
        sfx.boot();
        timers.push(setTimeout(ready, 1100));
    }

    document.addEventListener('pointerdown', onDocPointer);
    return () => {
        timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
        document.removeEventListener('pointerdown', onDocPointer);
        wm.closeAll();
    };
}
