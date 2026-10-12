// All sound effects are synthesised with WebAudio — no audio files to load.
import { getPref } from './prefs.js';

let ctx = null;

// Browsers only allow audio after a user gesture; call this from one.
export function unlockAudio() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
}

export const audioContext = () => ctx;

function tone(freq, dur, { type = 'square', vol = 0.05, slide = 0, delay = 0 } = {}) {
    if (!ctx || !getPref('sound')) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
}

// A synthesised "mew": a saw wave whose pitch swoops up then down through a vocal-ish filter.
function meow(freq = 700) {
    if (!ctx || !getPref('sound')) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.8, t0);
    osc.frequency.linearRampToValueAtTime(freq * 1.25, t0 + 0.09);
    osc.frequency.linearRampToValueAtTime(freq * 0.95, t0 + 0.34);
    filter.type = 'bandpass';
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(900, t0);
    filter.frequency.linearRampToValueAtTime(2400, t0 + 0.1);
    filter.frequency.linearRampToValueAtTime(1300, t0 + 0.34);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.42);
}

export const sfx = {
    meow,
    move: () => tone(440, 0.05, { vol: 0.03 }),
    step: () => tone(120, 0.04, { type: 'triangle', vol: 0.05 }),
    type: () => tone(620, 0.02, { vol: 0.02 }),
    select: () => { tone(520, 0.06); tone(780, 0.08, { delay: 0.06 }); },
    confirm: () => { tone(523, 0.07); tone(659, 0.07, { delay: 0.07 }); tone(784, 0.12, { delay: 0.14 }); },
    cancel: () => tone(330, 0.12, { slide: -160 }),
    open: () => tone(300, 0.1, { slide: 400, type: 'triangle', vol: 0.07 }),
    close: () => tone(600, 0.1, { slide: -350, type: 'triangle', vol: 0.07 }),
    error: () => { tone(160, 0.12, { type: 'sawtooth' }); tone(120, 0.16, { type: 'sawtooth', delay: 0.1 }); },
    coin: () => { tone(988, 0.06); tone(1319, 0.18, { delay: 0.06 }); },
    hit: () => tone(200, 0.08, { type: 'sawtooth', slide: -120 }),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, { delay: i * 0.1 })),
    marimba: (freq) => { tone(freq, 0.24, { type: 'sine', vol: 0.14 }); tone(freq * 2, 0.07, { type: 'triangle', vol: 0.05 }); },
    chord: () => [262, 392, 523, 659, 784].forEach((f, i) => tone(f, 0.9, { type: 'triangle', vol: 0.07, delay: i * 0.03 })),
    rumble: () => [70, 55, 62, 48, 58].forEach((f, i) => tone(f, 0.16, { type: 'sawtooth', vol: 0.09, delay: i * 0.12 })),
    boot: () => [262, 330, 392, 523].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.06, delay: i * 0.12 })),
};
