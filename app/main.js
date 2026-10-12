// Entry point: a tiny hash router that swaps scenes in and out of #app.
import { unlockAudio } from './core/audio.js';
import { getPref, onPref } from './core/prefs.js';
import { setMusic } from './core/music.js';
import { title } from './scenes/title.js';
import { select } from './scenes/select.js';
import { room } from './scenes/room.js';
import { os } from './scenes/os.js';
import { games } from './scenes/games.js';
import { resume } from './scenes/resume.js';
import { catworld } from './scenes/catworld.js';
import { rooftop } from './scenes/rooftop.js';

const scenes = { title, select, room, os, games, resume, catworld, rooftop };
// Everything not listed gets the cosy loop. The console is silent here: it starts its own music after the boot intro.
const MUSIC = { games: null, catworld: 'cat', rooftop: 'cat' };
const app = document.getElementById('app');
let unmount = null;

function go(name) {
    const hash = `#/${name}`;
    if (location.hash === hash) render();
    else location.hash = hash;
}

function render() {
    const name = location.hash.replace(/^#\/?/, '');
    const scene = scenes[name] ? name : 'title';
    unmount?.();
    app.replaceChildren();
    app.dataset.scene = scene;
    setMusic(scene in MUSIC ? MUSIC[scene] : 'cozy');
    unmount = scenes[scene](app, { go }) || null;
    window.scrollTo(0, 0);
}

const applyFx = () => document.body.classList.toggle('no-fx', !getPref('fx'));
onPref(applyFx);
applyFx();

window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);
window.addEventListener('hashchange', render);
render();
