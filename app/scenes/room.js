// The walkable room: grid movement, click-to-walk, interactable objects, a cat
// that follows you around, lighting, weather, hidden items and dialog.
import { h, announce, reducedMotion } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { setRain } from '../core/music.js';
import { hud, hudButton } from '../core/hud.js';
import { progress, markSeen, collect, award, itemToast } from '../core/progress.js';
import { makeCanvas, painter } from '../art/paint.js';
import { drawPlayer, drawRobot, drawCat, PLAYER_H, CAT_TUX } from '../art/sprites.js';
import {
    T, COLS, ROWS, ROOM_W, ROOM_H, MAP, TILE_OBJECT, OBJECT_LABEL, TALL_OBJECTS,
    drawRoomStatic, drawRoomAnimated, drawLighting,
} from '../art/room.js';
import { createDialog } from './dialog.js';
import { openDiary } from './gallery.js';
import { dialog as lines, secrets } from '../content.js';

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEY_DIR = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
};
const STEP_MS = 150;
const CAT_MS = 135;
const ROBOT_MS = 420;
const ROBOT_AREA = { c0: 3, c1: 9, r0: 4, r1: 7 };
const MENU_ORDER = ['computer', 'tv', 'resume', 'diary', 'hologram', 'cat', 'trophies', 'bookshelf', 'robot', 'lamp', 'window', 'backpack', 'poster', 'plant', 'bed', 'catdoor', 'door'];
const WEATHER = ['clear', 'rain', 'snow'];

// Little pixel glyphs the cat shows above its head.
const EMOTES = {
    heart: [['coral', 0, 0, 2, 1], ['coral', 3, 0, 2, 1], ['coral', 0, 1, 5, 2], ['coral', 1, 3, 3, 1], ['coral', 2, 4, 1, 1]],
    alert: [['amber', 2, 0, 1, 3], ['amber', 2, 4, 1, 1]],
    note: [['sky', 2, 0, 3, 1], ['sky', 2, 1, 1, 3], ['sky', 0, 3, 3, 2]],
    zzz: [['paper', 0, 0, 3, 1], ['paper', 1, 1, 1, 1], ['paper', 0, 2, 3, 1]],
};

let introSeen = false;
let weatherIndex = Math.floor(Math.random() * WEATHER.length);
let lampOn = true;

export function room(root, { go }) {
    const cv = makeCanvas(ROOM_W, ROOM_H);
    cv.className = 'px room__canvas';
    cv.removeAttribute('aria-hidden');
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', "Top-down view of Faraz's room. Use the Objects button to jump to anything in it.");
    const ctx = cv.getContext('2d');
    const bg = makeCanvas(ROOM_W, ROOM_H);
    drawRoomStatic(bg.getContext('2d'));

    const player = { col: 6, row: 6, x: 6 * T, y: 6 * T, fromX: 0, fromY: 0, t0: 0, dir: 'down', moving: false, steps: 0, path: [], then: null, goal: null, lastMove: 0 };
    const robot = { col: 9, row: 5, x: 9 * T, y: 5 * T, fromX: 0, fromY: 0, t0: 0, moving: false, next: 1500 };
    const cat = { col: 7, row: 7, x: 7 * T, y: 7 * T, fromX: 0, fromY: 0, t0: 0, moving: false, steps: 0, facing: 'left', trail: [], emote: null, emoteUntil: 0 };
    const env = { lamp: lampOn, weather: WEATHER[weatherIndex], universe: progress.universe(), bookHint: progress.seen('bookshelf') };
    let shakeUntil = 0;
    let leaving = 0;
    const held = [];
    const dialog = createDialog();
    let raf = 0;
    let alive = true;
    let closeDiary = null;

    // ---- map queries -------------------------------------------------------
    const isFloor = (c, r) => MAP[r]?.[c] === '.';
    const robotAt = (c, r) => robot.col === c && robot.row === r;
    const catAt = (c, r) => cat.col === c && cat.row === r && !(player.col === c && player.row === r);
    const walkable = (c, r) => isFloor(c, r) && !robotAt(c, r); // the cat never blocks: you just swap places
    const objectAt = (c, r) => (robotAt(c, r) ? 'robot' : TILE_OBJECT[MAP[r]?.[c]] || (catAt(c, r) ? 'cat' : undefined));
    const facing = () => {
        const [dx, dy] = DIRS[player.dir];
        return objectAt(player.col + dx, player.row + dy);
    };

    // Floor tiles from which an object can be used, mapped to the direction to face.
    function standingSpots(id) {
        const spots = new Map();
        const tiles = [];
        if (id === 'robot') tiles.push([robot.col, robot.row]);
        else MAP.forEach((line, r) => [...line].forEach((ch, c) => { if (TILE_OBJECT[ch] === id) tiles.push([c, r]); }));
        for (const [c, r] of tiles) {
            for (const [dir, [dx, dy]] of Object.entries(DIRS)) {
                const sc = c - dx, sr = r - dy;
                if (walkable(sc, sr)) spots.set(`${sc},${sr}`, dir);
            }
        }
        return spots;
    }

    // Breadth-first search from the player to the nearest goal tile.
    function findPath(goals) {
        const start = `${player.col},${player.row}`;
        const prev = new Map([[start, null]]);
        const queue = [[player.col, player.row]];
        while (queue.length) {
            const [c, r] = queue.shift();
            const key = `${c},${r}`;
            if (goals.has(key)) {
                const path = [];
                for (let k = key; prev.get(k); k = prev.get(k).from) path.unshift(prev.get(k).dir);
                return { path, key };
            }
            for (const [dir, [dx, dy]] of Object.entries(DIRS)) {
                const nk = `${c + dx},${r + dy}`;
                if (!prev.has(nk) && walkable(c + dx, r + dy)) {
                    prev.set(nk, { from: key, dir });
                    queue.push([c + dx, r + dy]);
                }
            }
        }
        return null;
    }

    const emote = (name, ms = 1800) => { cat.emote = name; cat.emoteUntil = performance.now() + ms; };

    // ---- actions -----------------------------------------------------------
    function noteSeen(id) {
        if (!markSeen(id)) return;
        if (progress.seenCount() >= 5) award('curious');
        if (Object.keys(OBJECT_LABEL).every((k) => progress.seen(k))) award('explorer');
    }

    async function interact(id) {
        if (dialog.open || closeDiary || leaving) return;
        held.length = 0;
        player.path = [];

        if (id === 'lamp') { // a light switch needs no conversation
            env.lamp = lampOn = !lampOn;
            sfx.select();
            emote(env.lamp ? 'note' : 'zzz');
            announce(env.lamp ? 'Lamp on.' : 'Lamp off.');
            noteSeen(id);
            award('lights');
            env.universe = progress.universe();
            return;
        }

        let entry = lines[id];
        if (id === 'bookshelf' && progress.seen('bookshelf')) entry = lines.bookshelfSecret; // second look: the passage
        if (id === 'catdoor' && !progress.hasBadge('hooman')) entry = lines.catdoorLocked;   // cats only
        if (!entry) return;
        const secret = secrets[id];
        const fresh = secret && !progress.hasItem(id);
        if (id === 'cat') { sfx.meow(640 + Math.random() * 160); emote('heart', 2600); } else sfx.select();

        const accepted = await dialog.play(fresh ? { ...entry, lines: [...entry.lines, secret.line] } : entry);
        if (!alive) return;

        noteSeen(id);
        if (id === 'cat') award('hooman');
        if (fresh && collect(id)) { itemToast(secret.item); emote('alert'); }
        if (id === 'window') {
            weatherIndex = (weatherIndex + 1) % WEATHER.length;
            env.weather = WEATHER[weatherIndex];
            setRain(env.weather === 'rain');
            announce(`The weather changes to ${env.weather}.`);
            award('weather');
        }
        env.universe = progress.universe();
        env.bookHint = progress.seen('bookshelf');

        if (accepted && entry.choice?.rumble && !reducedMotion()) {
            // the passage grinds open before you go through
            sfx.rumble();
            shakeUntil = performance.now() + 700;
            leaving = setTimeout(() => go(entry.choice.go), 750);
            return;
        }
        if (accepted && entry.choice?.action === 'diary') {
            closeDiary = openDiary(main, () => { closeDiary = null; env.universe = progress.universe(); cv.focus({ preventScroll: true }); });
        } else if (accepted && entry.choice?.go) go(entry.choice.go);
        else cv.focus({ preventScroll: true });
    }

    // Walk next to an object, turn towards it, then use it.
    function approach(id) {
        if (dialog.open || closeDiary) return;
        const spots = standingSpots(id);
        const route = spots.size ? findPath(spots) : null;
        if (!route) { interact(id); return; }
        player.goal = { id };
        player.path = route.path;
        player.then = () => { player.goal = null; player.dir = spots.get(route.key); interact(id); };
    }

    function walkTo(c, r) {
        const route = findPath(new Map([[`${c},${r}`, null]]));
        if (!route) return;
        player.goal = { c, r };
        player.path = route.path;
        player.then = () => { player.goal = null; };
    }

    // Something (usually the robot) wandered into the way: plan a new route to the same place.
    function replan() {
        const goal = player.goal;
        player.path = [];
        player.then = null;
        player.goal = null;
        if (goal?.id) approach(goal.id);
        else if (goal) walkTo(goal.c, goal.r);
    }

    function step(dir, now) {
        player.dir = dir;
        const [dx, dy] = DIRS[dir];
        if (!walkable(player.col + dx, player.row + dy)) return false;
        cat.trail.push({ col: player.col, row: player.row }); // the cat walks where you just were
        player.fromX = player.x; player.fromY = player.y;
        player.col += dx; player.row += dy;
        player.t0 = now; player.moving = true; player.steps++;
        player.lastMove = now;
        sfx.step();
        return true;
    }

    // ---- simulation ---------------------------------------------------------
    function glide(body, ms, now) {
        const k = Math.min(1, (now - body.t0) / ms);
        body.x = body.fromX + (body.col * T - body.fromX) * k;
        body.y = body.fromY + (body.row * T - body.fromY) * k;
        if (k >= 1) body.moving = false;
    }
    const startMove = (body, c, r, now) => {
        body.fromX = body.x; body.fromY = body.y;
        body.col = c; body.row = r; body.t0 = now; body.moving = true;
    };

    function update(now) {
        if (player.moving) glide(player, STEP_MS, now);
        if (!player.moving && !dialog.open && !closeDiary) {
            if (player.path.length) {
                if (!step(player.path.shift(), now)) replan();
            } else if (player.then) {
                const fn = player.then;
                player.then = null;
                fn();
            } else if (held.length) {
                step(held[held.length - 1], now);
            }
        }

        if (cat.moving) glide(cat, CAT_MS, now);
        while (!cat.moving && cat.trail.length) {
            const next = cat.trail.shift();
            if (next.col === cat.col && next.row === cat.row) continue;
            if (next.col === player.col && next.row === player.row) continue; // never sit on the player
            if (next.col !== cat.col) cat.facing = next.col < cat.col ? 'left' : 'right';
            startMove(cat, next.col, next.row, now);
            cat.steps++;
        }
        if (!cat.moving && player.col !== cat.col) cat.facing = player.col < cat.col ? 'left' : 'right';

        if (robot.moving) glide(robot, ROBOT_MS, now);
        else if (!dialog.open && now > robot.next && !reducedMotion()) {
            robot.next = now + 900 + Math.random() * 1800;
            const [dx, dy] = Object.values(DIRS)[Math.floor(Math.random() * 4)];
            const c = robot.col + dx, r = robot.row + dy;
            const inArea = c >= ROBOT_AREA.c0 && c <= ROBOT_AREA.c1 && r >= ROBOT_AREA.r0 && r <= ROBOT_AREA.r1;
            const taken = (player.col === c && player.row === r) || (cat.col === c && cat.row === r);
            if (inArea && isFloor(c, r) && !taken) startMove(robot, c, r, now);
        }
    }

    let lastHint = '';
    function draw(now) {
        const shaking = now < shakeUntil;
        if (shaking) {
            ctx.save();
            ctx.translate(Math.round(Math.random() * 2 - 1), Math.round(Math.random() * 2 - 1));
        }
        ctx.drawImage(bg, 0, 0);
        drawRoomAnimated(ctx, now, env);

        const walkFrame = player.moving && (now - player.t0) < STEP_MS * 0.6 ? 1 + (player.steps % 2) : 0;
        const bob = !player.moving && !reducedMotion() && Math.floor(now / 700) % 2 ? 1 : 0;
        const napping = !cat.moving && now - player.lastMove > 7000 && !dialog.open;
        const catPose = cat.moving ? 'walk' : napping ? 'sleep' : 'sit';
        const things = TALL_OBJECTS.map((o) => ({ y: o.baseY, draw: () => o.draw(ctx, now) }));
        things.push({ y: player.y + T, draw: () => drawPlayer(ctx, Math.round(player.x), Math.round(player.y) + T - PLAYER_H, player.dir, walkFrame, bob) });
        things.push({ y: robot.y + T - 1, draw: () => drawRobot(ctx, Math.round(robot.x), Math.round(robot.y), now) });
        things.push({
            y: cat.y + T - 2,
            draw: () => drawCat(ctx, Math.round(cat.x), Math.round(cat.y), {
                pose: catPose, frame: cat.moving ? cat.steps % 2 : Math.floor(now / 900) % 2, facing: cat.facing, palette: CAT_TUX,
            }),
        });
        things.sort((a, b) => a.y - b.y).forEach((t) => t.draw());

        drawLighting(ctx, now, env);

        // the cat's mood, floating above its head
        const mood = now < cat.emoteUntil ? cat.emote : napping ? 'zzz' : null;
        if (mood) {
            const lift = Math.floor(now / 250) % 2;
            const p = painter(ctx, Math.round(cat.x) + 5, Math.round(cat.y) - 9 - lift);
            p('night', -2, -2, 9, 9); p('paper', -1, -1, 7, 7);
            EMOTES[mood].forEach(([color, x, y, w, hgt]) => p(mood === 'zzz' ? 'deep' : color, x, y, w, hgt));
        }

        // "!" bubble + hint when something usable is right in front of the player
        const target = !player.moving && !dialog.open ? facing() : null;
        if (target) {
            const p = painter(ctx, Math.round(player.x) + 5, Math.round(player.y) - 16 - (Math.floor(now / 300) % 2));
            p('night', -1, -1, 8, 10); p('paper', 0, 0, 6, 8); p('night', 2, 8, 2, 1);
            p('coral', 2, 1, 2, 4); p('coral', 2, 6, 2, 1);
        }
        const hintText = target ? `Enter: ${OBJECT_LABEL[target]}` : 'Move: arrows / WASD  ·  Interact: Enter  ·  or click anything';
        if (hintText !== lastHint) { hint.textContent = hintText; lastHint = hintText; }
        if (shaking) ctx.restore();
    }

    function frame(now) {
        update(now);
        draw(now);
        raf = requestAnimationFrame(frame);
    }

    // ---- input ---------------------------------------------------------------
    const press = (dir) => {
        if (!held.includes(dir)) held.push(dir);
        player.path = [];
        player.then = null;
        player.goal = null;
    };
    const release = (dir) => {
        const i = held.indexOf(dir);
        if (i >= 0) held.splice(i, 1);
    };
    const act = () => {
        const id = facing();
        if (id && !player.moving) interact(id);
    };
    const overlayOpen = () => Boolean(closeDiary || document.querySelector('.trophies'));

    const onKeyDown = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey || overlayOpen()) return;
        if (dialog.open) { dialog.handleKey(e); return; }
        if (e.target.closest?.('[role="menu"]')) {
            if (e.key === 'Escape') closeMenu();
            return; // the objects menu keeps its own arrow keys
        }
        const dir = KEY_DIR[e.key];
        const onControl = e.target.closest?.('button, a'); // Enter / Space belong to a focused button
        if (dir) { e.preventDefault(); press(dir); }
        else if (e.key === 'e' || e.key === 'E') act();
        else if (!onControl && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); act(); }
        else if (e.key === 'Escape') go('select');
    };
    const onKeyUp = (e) => { const dir = KEY_DIR[e.key]; if (dir) release(dir); };
    const onBlur = () => { held.length = 0; };

    cv.addEventListener('click', (e) => {
        if (dialog.open || closeDiary) return;
        const rect = cv.getBoundingClientRect();
        const c = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
        const r = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
        cv.focus({ preventScroll: true });
        if (catAt(c, r)) { // your buddy is right there: no need to walk
            if (cat.col !== player.col) player.dir = cat.col < player.col ? 'left' : 'right';
            interact('cat');
            return;
        }
        // Furniture is taller than its footprint: clicks on its upper half count too.
        let id = objectAt(c, r);
        if (!id && r < 2) id = objectAt(c, 2);
        if (!id && TILE_OBJECT[MAP[r + 1]?.[c]] === 'tv') id = 'tv';
        if (!id && TILE_OBJECT[MAP[r + 1]?.[c]] === 'hologram') id = 'hologram';
        if (id) { approach(id); return; }
        if (walkable(c, r)) walkTo(c, r);
    });

    // ---- DOM -------------------------------------------------------------------
    const hint = h('p', { class: 'room__hint' });
    const menu = h('div', { class: 'room__menu', role: 'menu', 'aria-label': 'Objects in the room', hidden: true },
        MENU_ORDER.map((id) => h('button', {
            type: 'button', role: 'menuitem', class: 'room__menuitem',
            onClick: () => { closeMenu(); approach(id); },
        }, OBJECT_LABEL[id])),
    );
    const menuBtn = hudButton('list', 'Objects in the room', () => {
        menu.hidden = !menu.hidden;
        menuBtn.setAttribute('aria-expanded', String(!menu.hidden));
        if (!menu.hidden) { sfx.open(); menu.querySelector('button').focus(); }
    });
    menuBtn.setAttribute('aria-haspopup', 'menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    function closeMenu() {
        if (menu.hidden) return;
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
    }
    menu.addEventListener('keydown', (e) => {
        const items = [...menu.querySelectorAll('button')];
        const i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });

    const padBtn = (dir, label) => {
        const b = h('button', { class: `dpad__btn dpad__btn--${dir}`, type: 'button', 'aria-label': label }, '');
        b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(dir); });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, () => release(dir)));
        return b;
    };
    const pad = h('div', { class: 'dpad', 'aria-hidden': 'true' },
        h('div', { class: 'dpad__cross' }, padBtn('up', 'Up'), padBtn('left', 'Left'), padBtn('right', 'Right'), padBtn('down', 'Down')),
        h('button', { class: 'dpad__act', type: 'button', tabindex: '-1', onClick: act }, 'A'),
    );
    pad.querySelectorAll('button').forEach((b) => b.setAttribute('tabindex', '-1'));

    cv.setAttribute('tabindex', '0');
    const stage = h('div', { class: 'room__stage' }, cv);
    const main = h('main', { class: 'room', id: 'main' },
        hud(go, { extra: [menuBtn] }),
        menu,
        stage,
        hint,
        pad,
        dialog.el,
    );
    root.append(main);

    // Scale the canvas by whole pixels whenever there is room for it.
    function fit() {
        const padShown = getComputedStyle(pad).display !== 'none';
        const availW = window.innerWidth - 24;
        const availH = window.innerHeight - 64 - 44 - (padShown ? 150 : 0);
        let s = Math.min(availW / ROOM_W, availH / ROOM_H);
        s = s >= 2 ? Math.floor(s) : Math.max(1, s);
        cv.style.width = `${ROOM_W * s}px`;
        cv.style.height = `${ROOM_H * s}px`;
    }
    fit();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    window.addEventListener('resize', fit);
    setRain(env.weather === 'rain');
    player.lastMove = performance.now();
    raf = requestAnimationFrame(frame);
    cv.focus({ preventScroll: true });

    const hello = setTimeout(() => award('welcome'), 900);
    if (!introSeen) {
        introSeen = true;
        dialog.play(lines.intro).then(() => { if (alive) cv.focus({ preventScroll: true }); });
    } else {
        announce("Faraz's room. Arrow keys to move, Enter to interact.");
        if (progress.hasBadge('catworld')) emote('heart', 2500);
    }

    return () => {
        alive = false;
        clearTimeout(hello);
        clearTimeout(leaving);
        cancelAnimationFrame(raf);
        dialog.close();
        closeDiary?.();
        setRain(false);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('blur', onBlur);
        window.removeEventListener('resize', fit);
    };
}
