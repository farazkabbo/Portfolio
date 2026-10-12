// Per-visitor preferences (sound, CRT effect). Storage can be blocked, so every access is guarded.

const KEY = 'faraz-exe:';
const defaults = { sound: true, music: true, fx: true };
const listeners = new Set();

export function getPref(name) {
    try {
        const raw = localStorage.getItem(KEY + name);
        return raw == null ? defaults[name] : raw === '1';
    } catch {
        return defaults[name];
    }
}

export function setPref(name, value) {
    try { localStorage.setItem(KEY + name, value ? '1' : '0'); } catch { /* storage unavailable */ }
    listeners.forEach((fn) => fn(name, value));
}

export function onPref(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}
