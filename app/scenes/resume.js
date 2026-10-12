// Résumé: the no-nonsense, printable version of everything.
import { h } from '../core/dom.js';
import { hud } from '../core/hud.js';
import { award } from '../core/progress.js';
import { portrait } from '../art/sprites.js';
import { profile, experience, education, certificates, achievements, skills, projects } from '../content.js';

const tags = (list) => h('ul', { class: 'tags' }, list.map((t) => h('li', null, t)));
const section = (title, ...kids) => h('section', { class: 'cv__section' }, h('h2', null, title), ...kids);

export function resume(root, { go }) {
    root.append(h('main', { class: 'cv', id: 'main' },
        hud(go),
        h('article', { class: 'cv__sheet' },
            h('header', { class: 'cv__head' },
                h('div', { class: 'cv__face' }, portrait('Faraz', 3)),
                h('div', null,
                    h('h1', null, profile.name),
                    h('p', { class: 'cv__tagline' }, profile.tagline),
                    h('p', { class: 'cv__contact' },
                        h('a', { href: `mailto:${profile.email}` }, profile.email), ' · ', profile.location),
                    h('div', { class: 'row cv__actions' },
                        h('a', { class: 'btn btn--primary', href: profile.resumePdf, download: true }, 'Download PDF'),
                        h('button', { type: 'button', class: 'btn', onClick: () => window.print() }, 'Print'),
                        profile.socials.slice(0, 2).map((s) => h('a', { class: 'btn', href: s.url, target: '_blank', rel: 'noopener' }, s.label)))),
            ),
            section('Summary', h('p', null, profile.summary), h('p', null, profile.about)),
            section('Experience', experience.map((e) => h('div', { class: 'cv__item' },
                h('p', { class: 'cv__date' }, e.date),
                h('h3', null, e.role, h('span', null, ` — ${e.org}`)),
                h('ul', null, e.points.map((p) => h('li', null, p)))))),
            section('Projects', projects.map((p) => h('div', { class: 'cv__item' },
                h('p', { class: 'cv__date' }, p.badge),
                h('h3', null, p.link ? h('a', { href: p.link, target: '_blank', rel: 'noopener' }, p.name) : p.name),
                h('p', null, p.desc),
                tags(p.tech)))),
            section('Education', education.map((e) => h('div', { class: 'cv__item' },
                h('p', { class: 'cv__date' }, e.date),
                h('h3', null, e.title, h('span', null, ` — ${e.org}`)),
                h('p', null, e.note))),
                h('ul', null, certificates.map((c) => h('li', null, `${c.title} — ${c.org}`)))),
            section('Achievements', h('ul', null, achievements.map((a) => h('li', null, h('strong', null, a.title), ` — ${a.detail}`)))),
            section('Skills', skills.map((s) => h('div', { class: 'cv__skill' }, h('h3', null, s.group), tags(s.items)))),
        ),
    ));

    const hello = setTimeout(() => award('paper'), 800);
    const onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('.trophies')) go('select'); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(hello); window.removeEventListener('keydown', onKey); };
}
