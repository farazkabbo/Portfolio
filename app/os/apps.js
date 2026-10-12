// Every program that can run on the desktop. Each app is
//   { title, icon, w, h, render(body, api, arg) -> { cleanup?, onArg? } }
// and gets its text from content.js.
import { h } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { icon } from '../art/icons.js';
import { C } from '../art/paint.js';
import { projectImage } from '../art/cover.js';
import { createGallery } from '../scenes/gallery.js';
import { profile, experience, education, certificates, achievements, skills, projects } from '../content.js';

const ext = (label, url, cls = 'btn') => h('a', { class: cls, href: url, target: '_blank', rel: 'noopener' }, label);
const tags = (list) => h('ul', { class: 'tags' }, list.map((t) => h('li', null, t)));

// --------------------------------------------------------------------------
// Browser: the "about me" site, with internal pages
// --------------------------------------------------------------------------
const PAGES = {
    summary: {
        label: 'Summary',
        view: () => [
            h('p', { class: 'page__kicker' }, 'Welcome to'),
            h('h3', { class: 'page__name' }, profile.name),
            h('p', { class: 'page__role' }, `${profile.title} Portfolio`),
            h('section', { class: 'card' }, h('h4', null, 'Summary'), h('p', null, profile.summary), h('p', null, profile.about)),
            h('section', { class: 'card' }, h('h4', null, 'Highlights'),
                h('ul', null, achievements.map((a) => h('li', null, h('strong', null, a.title), ` — ${a.detail}`)))),
        ],
    },
    experience: {
        label: 'Professional Experience',
        view: () => [
            h('h3', null, 'Professional Experience'),
            experience.map((e) => h('section', { class: 'card' },
                h('p', { class: 'card__date' }, e.date),
                h('h4', null, e.role),
                h('p', { class: 'card__org' }, e.org),
                h('ul', null, e.points.map((p) => h('li', null, p))),
                tags(e.tags))),
        ],
    },
    education: {
        label: 'Education',
        view: () => [
            h('h3', null, 'Education'),
            education.map((e) => h('section', { class: 'card' },
                h('p', { class: 'card__date' }, e.date), h('h4', null, e.title), h('p', { class: 'card__org' }, e.org), h('p', null, e.note))),
            h('h3', null, 'Certificates'),
            h('section', { class: 'card' }, h('ul', null, certificates.map((c) => h('li', null, h('strong', null, c.title), ` — ${c.org}`)))),
        ],
    },
    skills: {
        label: 'Skills',
        view: () => [
            h('h3', null, 'Skills & Technologies'),
            skills.map((s) => h('section', { class: 'card' }, h('h4', null, s.group), tags(s.items))),
        ],
    },
    contact: {
        label: 'Contact',
        view: () => [
            h('h3', null, 'Contact'),
            h('section', { class: 'card' },
                h('p', null, 'The fastest way to reach me is email:'),
                h('p', null, h('a', { href: `mailto:${profile.email}` }, profile.email)),
                h('p', null, profile.location),
                h('div', { class: 'row' }, profile.socials.map((s) => ext(s.label, s.url)))),
        ],
    },
};

const browser = {
    title: 'Browser', icon: 'browser', w: 460, h: 420,
    render(body, api, page = 'summary') {
        const url = h('span', { class: 'browser__url' });
        const view = h('div', { class: 'browser__view page', tabindex: '0' });
        const nav = h('nav', { class: 'browser__nav', 'aria-label': 'Pages' },
            Object.entries(PAGES).map(([id, pg]) => h('button', { type: 'button', class: 'linkbtn', 'data-page': id, onClick: () => show(id) }, pg.label)));
        function show(id) {
            const pg = PAGES[id] || PAGES.summary;
            url.textContent = `faraz://${PAGES[id] ? id : 'summary'}`;
            nav.querySelectorAll('button').forEach((b) => b.toggleAttribute('aria-current', b.dataset.page === id));
            view.replaceChildren(...pg.view().flat(Infinity));
            view.scrollTop = 0;
        }
        body.append(h('div', { class: 'browser__bar' }, h('span', null, 'Address:'), url), nav, view);
        show(page);
        return { onArg: (p) => p && show(p) };
    },
};

// --------------------------------------------------------------------------
// Projects folder + one window per project
// --------------------------------------------------------------------------
const projectsApp = {
    title: 'Projects', icon: 'folder', w: 440, h: 360,
    render(body, api) {
        body.append(
            h('p', { class: 'folder__path' }, `C:\\Faraz\\Projects — ${projects.length} items`),
            h('ul', { class: 'folder__grid' }, projects.map((p) => h('li', null,
                h('button', { type: 'button', class: 'file', onClick: () => api.open('project', p.id) },
                    h('img', { src: projectImage(p), alt: '', loading: 'lazy' }),
                    h('span', null, p.name))))),
        );
    },
};

const projectApp = {
    icon: 'folder', w: 400, h: 440,
    keyFor: (id) => `project:${id}`,
    titleFor: (id) => projects.find((p) => p.id === id)?.name || 'Project',
    render(body, api, id) {
        const p = projects.find((x) => x.id === id);
        if (!p) { body.append(h('p', null, 'File not found.')); return; }
        body.append(h('article', { class: 'page' },
            h('img', { class: 'project__img', src: projectImage(p), alt: p.image ? `${p.name} screenshot` : '' }),
            h('p', { class: 'badge' }, p.badge),
            h('h3', null, p.name),
            h('p', null, p.desc),
            tags(p.tech),
            p.link && h('div', { class: 'row' }, ext('View project ↗', p.link, 'btn btn--primary')),
        ));
    },
};

// --------------------------------------------------------------------------
// Résumé, certificates, welcome, recycle bin
// --------------------------------------------------------------------------
const resumeApp = {
    title: 'Resume.pdf', icon: 'resume', w: 380, h: 360,
    render(body, api) {
        body.append(h('article', { class: 'page' },
            h('h3', null, profile.name),
            h('p', { class: 'page__role' }, profile.tagline),
            h('p', null, profile.summary),
            h('div', { class: 'row' },
                h('button', { type: 'button', class: 'btn btn--primary', onClick: () => api.go('resume') }, 'Open full résumé'),
                h('a', { class: 'btn', href: profile.resumePdf, download: true }, 'Download PDF')),
        ));
    },
};

const certsApp = {
    title: 'Certificates', icon: 'trophy', w: 420, h: 360,
    render(body) {
        body.append(h('div', { class: 'page' },
            h('h3', null, 'Certificates'),
            h('ul', { class: 'certs' }, certificates.map((c) => h('li', null,
                h('img', { src: c.image, alt: `${c.title} certificate from ${c.org}`, loading: 'lazy' }),
                h('strong', null, c.title), h('span', null, c.org)))),
            h('h3', null, 'Achievements'),
            h('ul', null, achievements.map((a) => h('li', null, h('strong', null, a.title), ` — ${a.detail}`))),
        ));
    },
};

const welcomeApp = {
    title: 'Welcome', icon: 'star', w: 400, h: 380,
    render(body, api) {
        body.append(h('div', { class: 'page' },
            h('h3', { class: 'page__name' }, 'FarazOS'),
            h('p', { class: 'page__role' }, 'Web Edition'),
            h('p', null, `This is ${profile.shortName}'s portfolio dressed up as a retro desktop. Everything here is real — open things and look around.`),
            h('section', { class: 'card' }, h('h4', null, 'Where to start'),
                h('div', { class: 'row' },
                    h('button', { type: 'button', class: 'btn btn--primary', onClick: () => api.open('browser', 'summary') }, 'About me'),
                    h('button', { type: 'button', class: 'btn', onClick: () => api.open('projects') }, 'Projects'),
                    h('button', { type: 'button', class: 'btn', onClick: () => api.open('art') }, 'Art diary'),
                    h('button', { type: 'button', class: 'btn', onClick: () => api.open('terminal') }, 'Terminal'))),
            h('section', { class: 'card' }, h('h4', null, 'Keyboard'),
                h('ul', null,
                    h('li', null, h('kbd', null, 'Tab'), ' moves between icons, windows and buttons'),
                    h('li', null, h('kbd', null, 'Esc'), ' closes the focused window'),
                    h('li', null, h('kbd', null, 'Alt'), ' + ', h('kbd', null, 'arrows'), ' moves the focused window'))),
            h('p', { class: 'fine' }, 'Hand-built with plain HTML, CSS and JavaScript — no frameworks, no image sprites. Concept inspired by MewmewDevArt’s “PortfolioWeb XP”.'),
        ));
    },
};

const trashApp = {
    title: 'Recycle Bin', icon: 'trash', w: 340, h: 260,
    render(body) {
        body.append(
            h('p', { class: 'folder__path' }, 'Recycle Bin — 3 items'),
            h('ul', { class: 'trash' },
                h('li', null, h('a', { href: './classic.html' }, 'old-portfolio.html'), h('span', null, 'my previous site — still works')),
                h('li', null, 'node_modules', h('span', null, '4.2 GB')),
                h('li', null, 'final_FINAL_v7.zip', h('span', null, 'do not restore'))),
        );
    },
};

// --------------------------------------------------------------------------
// Terminal
// --------------------------------------------------------------------------
const terminal = {
    title: 'Terminal', icon: 'terminal', w: 460, h: 320,
    render(body, api) {
        const out = h('div', { class: 'term__out', role: 'log', 'aria-live': 'polite' });
        const input = h('input', { class: 'term__input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Terminal command' });
        const form = h('form', { class: 'term__line' }, h('span', { 'aria-hidden': 'true' }, 'faraz@os:~$'), input);
        const history = [];
        let cursor = 0;

        const print = (...nodes) => { out.append(h('div', null, ...nodes)); out.scrollTop = out.scrollHeight; };
        const files = {
            'about.txt': () => [profile.summary, '', profile.about],
            'experience.log': () => experience.flatMap((e) => [`[${e.date}] ${e.role} @ ${e.org}`, ...e.points.map((p) => `    - ${p}`)]),
            'skills.json': () => [JSON.stringify(Object.fromEntries(skills.map((s) => [s.group, s.items])), null, 2)],
            'contact.txt': () => [profile.email, profile.location, ...profile.socials.map((s) => `${s.label}: ${s.url}`)],
            'achievements.md': () => achievements.map((a) => `* ${a.title}: ${a.detail}`),
        };
        const findProject = (q) => projects.find((p) => p.id === q || p.name.toLowerCase().startsWith(q));

        const commands = {
            help: () => [
                'Available commands:',
                '  whoami            who is this guy',
                '  ls                list files',
                '  cat <file>        read a file',
                '  projects          list projects',
                '  open <project>    open a project window',
                '  skills | experience | contact',
                '  resume            open the résumé',
                '  games             switch on the console',
                '  clear | date | echo <text> | exit',
            ],
            whoami: () => [`${profile.name} — ${profile.tagline}`],
            ls: () => [[...Object.keys(files), 'projects/', 'resume.pdf'].join('   ')],
            cat: (arg) => (files[arg] ? files[arg]() : [`cat: ${arg || '(nothing)'}: no such file. Try "ls".`]),
            projects: () => projects.map((p) => `${p.id.padEnd(14)} ${p.badge}`),
            open: (arg) => {
                const p = arg && findProject(arg);
                if (!p) return [`open: unknown project "${arg || ''}". Try "projects".`];
                api.open('project', p.id);
                return [`Opening ${p.name}…`];
            },
            skills: () => files['skills.json'](),
            experience: () => files['experience.log'](),
            contact: () => files['contact.txt'](),
            resume: () => { api.go('resume'); return ['Opening résumé…']; },
            games: () => { api.go('games'); return ['Booting console…']; },
            date: () => [new Date().toString()],
            echo: (arg) => [arg],
            sudo: () => ['Nice try. This incident will be reported… to nobody.'],
            exit: () => { api.close(); return []; },
        };

        function run(raw) {
            const line = raw.trim();
            print(h('span', { class: 'term__prompt' }, 'faraz@os:~$ '), line);
            if (!line) return;
            history.push(line);
            cursor = history.length;
            const [name, ...rest] = line.split(/\s+/);
            const cmd = name.toLowerCase();
            if (cmd === 'clear') { out.replaceChildren(); return; }
            const fn = commands[cmd];
            if (!fn) { sfx.error(); print(`${name}: command not found. Type "help".`); return; }
            fn(cmd === 'echo' ? rest.join(' ') : rest.join(' ').toLowerCase()).forEach((l) => print(h('pre', null, l)));
        }

        form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && cursor > 0) { e.preventDefault(); input.value = history[--cursor]; }
            if (e.key === 'ArrowDown') { e.preventDefault(); cursor = Math.min(history.length, cursor + 1); input.value = history[cursor] || ''; }
        });
        body.addEventListener('click', () => { if (!String(getSelection())) input.focus(); });
        body.append(out, form);
        print(`FarazOS terminal. Type "help" to see what you can do.`);
        requestAnimationFrame(() => input.focus());
    },
};

// --------------------------------------------------------------------------
// Paint
// --------------------------------------------------------------------------
const PAINT_W = 160;
const PAINT_H = 100;
const PAINT_COLORS = [C.ink, C.paper, C.coral, C.amber, C.mint, C.sky, C.deep, C.lilac, C.wood, '#f0b63f'];

const paint = {
    title: 'Paint', icon: 'paint', w: 420, h: 450,
    render(body) {
        const cv = h('canvas', { class: 'px paint__canvas', width: PAINT_W, height: PAINT_H, role: 'img', 'aria-label': 'Drawing canvas' });
        const ctx = cv.getContext('2d');
        let color = C.ink;
        let size = 2;
        let last = null;

        const blank = () => { ctx.fillStyle = C.paper; ctx.fillRect(0, 0, PAINT_W, PAINT_H); };
        const dot = (x, y) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size); };
        const stroke = (a, b) => {
            const n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
            for (let i = 0; i <= n; i++) dot(a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n);
        };
        const at = (e) => {
            const r = cv.getBoundingClientRect();
            return { x: ((e.clientX - r.left) / r.width) * PAINT_W, y: ((e.clientY - r.top) / r.height) * PAINT_H };
        };
        // start with the smiley from Faraz's shirt
        const smiley = () => {
            blank();
            for (let y = -14; y <= 14; y++) for (let x = -14; x <= 14; x++) if (x * x + y * y <= 196) { ctx.fillStyle = '#f0b63f'; ctx.fillRect(80 + x, 50 + y, 1, 1); }
            ctx.fillStyle = C.ink;
            [[-7, -6], [-6, -7], [-5, -6], [5, -6], [6, -7], [7, -6]].forEach(([x, y]) => ctx.fillRect(80 + x, 50 + y, 2, 2));
            for (let x = -7; x <= 7; x++) ctx.fillRect(80 + x, 50 + 3 + Math.round(4 - (x * x) / 12), 2, 2);
        };
        smiley();

        cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); last = at(e); dot(last.x, last.y); });
        cv.addEventListener('pointermove', (e) => { if (!last) return; const p = at(e); stroke(last, p); last = p; });
        ['pointerup', 'pointercancel'].forEach((ev) => cv.addEventListener(ev, () => { last = null; }));

        const swatches = h('div', { class: 'paint__colors', role: 'radiogroup', 'aria-label': 'Colour' },
            PAINT_COLORS.map((c, i) => h('button', {
                type: 'button', class: 'paint__swatch', role: 'radio', 'aria-checked': String(i === 0), 'aria-label': `Colour ${i + 1}`, style: { background: c },
                onClick: (e) => {
                    color = c;
                    swatches.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b === e.currentTarget)));
                    sfx.move();
                },
            })));
        const sizes = h('div', { class: 'paint__sizes', role: 'radiogroup', 'aria-label': 'Brush size' },
            [1, 2, 4, 8].map((s) => h('button', {
                type: 'button', class: 'btn btn--small', role: 'radio', 'aria-checked': String(s === size),
                onClick: (e) => {
                    size = s;
                    sizes.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b === e.currentTarget)));
                },
            }, `${s}px`)));

        body.append(
            h('div', { class: 'paint__tools' }, swatches, sizes,
                h('button', { type: 'button', class: 'btn btn--small', onClick: () => { blank(); sfx.cancel(); } }, 'Clear'),
                h('button', {
                    type: 'button', class: 'btn btn--small',
                    onClick: () => {
                        // export at 4x so the saved picture is not tiny
                        const big = document.createElement('canvas');
                        big.width = PAINT_W * 4; big.height = PAINT_H * 4;
                        const bctx = big.getContext('2d');
                        bctx.imageSmoothingEnabled = false;
                        bctx.drawImage(cv, 0, 0, big.width, big.height);
                        h('a', { href: big.toDataURL('image/png'), download: 'faraz-os-painting.png' }).click();
                        sfx.coin();
                    },
                }, 'Save PNG')),
            h('div', { class: 'paint__stage' }, cv),
        );
    },
};

const artApp = {
    title: 'Art Diary', icon: 'art', w: 440, h: 520,
    render(body) {
        const gallery = createGallery();
        body.append(gallery);
        requestAnimationFrame(() => gallery.focus({ preventScroll: true }));
    },
};

export const APPS = {
    art: artApp,
    welcome: welcomeApp,
    browser,
    projects: projectsApp,
    project: projectApp,
    resume: resumeApp,
    terminal,
    paint,
    certs: certsApp,
    trash: trashApp,
};

// Desktop icons, top to bottom. `go` switches scene instead of opening a window.
export const DESKTOP = [
    { label: 'About Me', icon: 'browser', app: 'browser' },
    { label: 'Projects', icon: 'folder', app: 'projects' },
    { label: 'Art Diary', icon: 'art', app: 'art' },
    { label: 'Resume.pdf', icon: 'resume', app: 'resume' },
    { label: 'Terminal', icon: 'terminal', app: 'terminal' },
    { label: 'Paint', icon: 'paint', app: 'paint' },
    { label: 'Certificates', icon: 'trophy', app: 'certs' },
    { label: 'Games', icon: 'gamepad', go: 'games' },
    { label: 'Recycle Bin', icon: 'trash', app: 'trash' },
    { label: 'Welcome', icon: 'star', app: 'welcome' },
];
