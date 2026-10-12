// Visitor counter. A static site has no server of its own, so the count lives in
// a small free counting service. Each browser is counted once; later visits only
// read the number. If the service is unreachable the counter simply stays hidden.
import { visitorCounter as config } from '../content.js';

const SERVICE = 'https://abacus.jasoncameron.dev';
const FLAG = 'faraz-exe:counted';
let pending = null;

function alreadyCounted() {
    try { return localStorage.getItem(FLAG) === '1'; } catch { return false; }
}

export function visitorCount() {
    if (!config?.enabled) return Promise.resolve(null);
    if (!pending) {
        // working on the site locally should not inflate the number
        const local = ['localhost', '127.0.0.1', ''].includes(location.hostname);
        const action = local || alreadyCounted() ? 'get' : 'hit';
        pending = fetch(`${SERVICE}/${action}/${config.namespace}/${config.key}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && action === 'hit') {
                    try { localStorage.setItem(FLAG, '1'); } catch { /* storage unavailable */ }
                }
                return typeof data?.value === 'number' ? data.value : null;
            })
            .catch(() => null);
    }
    return pending;
}

// Fills `el` once the number arrives.
export function showVisitorCount(el, format = (n) => `Visitor #${n.toLocaleString('en')}`) {
    if (!el) return;
    visitorCount().then((n) => {
        if (n != null && el.isConnected) el.textContent = format(n);
    });
}
