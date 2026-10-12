// Tiny DOM helpers shared by every scene.

export function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'style') Object.assign(el.style, v);
        else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
        if (kid == null || kid === false) continue;
        el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
}

// Screen-reader announcement through the shared polite live region.
export function announce(msg) {
    const live = document.getElementById('live');
    if (!live) return;
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = msg; });
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () => matchMedia('(pointer: coarse)').matches;

// Arrow-key navigation across a group of buttons (roving tabindex).
export function roving(container, selector, { cols = 0, onMove } = {}) {
    const items = () => [...container.querySelectorAll(selector)];
    const select = (i, focus = true) => {
        const list = items();
        if (!list.length) return;
        const idx = (i + list.length) % list.length;
        list.forEach((el, n) => el.setAttribute('tabindex', n === idx ? '0' : '-1'));
        if (focus) list[idx].focus();
        onMove?.(idx, list[idx]);
    };
    container.addEventListener('keydown', (e) => {
        const list = items();
        const cur = list.indexOf(document.activeElement);
        if (cur < 0) return;
        const perRow = (typeof cols === 'function' ? cols() : cols) || 1;
        const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: perRow, ArrowUp: -perRow }[e.key];
        if (step) { e.preventDefault(); select(cur + step); }
        else if (e.key === 'Home') { e.preventDefault(); select(0); }
        else if (e.key === 'End') { e.preventDefault(); select(list.length - 1); }
    });
    container.addEventListener('focusin', (e) => {
        const idx = items().indexOf(e.target);
        if (idx >= 0) select(idx, false);
    });
    select(0, false);
    return { select };
}
