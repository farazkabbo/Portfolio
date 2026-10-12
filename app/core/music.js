// Background music, generated live with WebAudio: a tiny step sequencer playing
// a chord loop (arpeggio + bass + soft hat). No audio files.
import { audioContext, unlockAudio } from './audio.js';
import { getPref, onPref } from './prefs.js';

// Notes are MIDI numbers. One chord per bar, 16 steps per bar.
const TRACKS = {
    // lo-fi and cosy: room, menus, OS, résumé
    cozy: {
        bpm: 78, wave: 'triangle', vol: 0.5,
        chords: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]],
        arp: [0, null, 2, null, 1, null, 3, null, 2, null, 3, null, 1, null, 2, null],
        bass: [0, 10], hat: [4, 12],
        lead: [[76, 0], [74, 6], [72, 8], null, [72, 0], [71, 4], [67, 8], null, [69, 0], [72, 6], [76, 8], null, [74, 0], [71, 8], [67, 12], null],
    },
    // bouncy chiptune: game console
    arcade: {
        bpm: 132, wave: 'square', vol: 0.3,
        chords: [[57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67], [52, 55, 59, 64]],
        arp: [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 3, 2, 1],
        bass: [0, 4, 8, 12], hat: [2, 6, 10, 14],
        lead: [],
    },
    // slow and dreamy: cat world (leaves room for the meows)
    cat: {
        bpm: 66, wave: 'sine', vol: 0.55,
        chords: [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]],
        arp: [0, null, null, null, 2, null, null, null, 3, null, null, null, 2, null, null, null],
        bass: [0], hat: [],
        lead: [],
    },
};

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
let wanted = null;   // track the current scene asked for
let playing = null;  // track actually sounding
let timer = 0;
let step = 0;
let nextTime = 0;
let out = null;      // master gain -> lowpass -> speakers
let rainNodes = null;
let rainWanted = false;

function output(ctx) {
    if (out) return out;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    out = ctx.createGain();
    out.gain.value = 0.11;
    out.connect(filter).connect(ctx.destination);
    return out;
}

function note(ctx, freq, t, dur, type, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(output(ctx));
    osc.start(t);
    osc.stop(t + dur + 0.05);
}

function hat(ctx, t) {
    const len = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buffer;
    gain.gain.value = 0.12;
    src.connect(gain).connect(output(ctx));
    src.start(t);
}

function playStep(ctx, track, n, t) {
    const beat = 60 / track.bpm / 4;
    const bar = Math.floor(n / 16) % track.chords.length;
    const s = n % 16;
    const chord = track.chords[bar];
    const a = track.arp[s];
    if (a != null) note(ctx, hz(chord[a]), t, beat * 3.5, track.wave, track.vol);
    if (track.bass.includes(s)) note(ctx, hz(chord[0] - 24), t, beat * 6, 'sine', 0.9);
    if (track.hat.includes(s)) hat(ctx, t);
    // the melody only plays every other time round, so the loop breathes
    if (track.lead.length && Math.floor(n / 64) % 2 === 1) {
        for (let i = 0; i < 4; i++) {
            const l = track.lead[bar * 4 + i];
            if (l && l[1] === s) note(ctx, hz(l[0]), t, beat * 5, 'sine', 0.35);
        }
    }
}

function tick() {
    const ctx = audioContext();
    const track = TRACKS[playing];
    if (!ctx || !track) return;
    while (nextTime < ctx.currentTime + 0.2) {
        playStep(ctx, track, step, nextTime);
        nextTime += 60 / track.bpm / 4;
        step++;
    }
}

function stop() {
    clearInterval(timer);
    timer = 0;
    playing = null;
}

function sync() {
    const ctx = audioContext();
    const should = getPref('music') && !document.hidden && ctx ? wanted : null;
    if (should !== playing) {
        stop();
        if (should) {
            playing = should;
            step = 0;
            nextTime = ctx.currentTime + 0.08;
            timer = setInterval(tick, 50);
            tick();
        }
    }
    syncRain(ctx);
}

// Soft rain: looping filtered noise.
function syncRain(ctx) {
    const on = rainWanted && getPref('music') && !document.hidden && ctx;
    if (on && !rainNodes) {
        const len = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        src.buffer = buffer;
        src.loop = true;
        filter.type = 'bandpass';
        filter.frequency.value = 1400;
        filter.Q.value = 0.4;
        gain.gain.value = 0.022;
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start();
        rainNodes = { src, gain };
    } else if (!on && rainNodes) {
        rainNodes.src.stop();
        rainNodes = null;
    }
}

// Scenes call this with a track name, or null for silence.
export function setMusic(name) {
    wanted = TRACKS[name] ? name : null;
    sync();
}

export const nowPlaying = () => playing;

export function setRain(on) {
    rainWanted = on;
    sync();
}

// Audio can only start after a user gesture, so retry on the first few of them.
const kick = () => { unlockAudio(); sync(); };
window.addEventListener('pointerdown', kick);
window.addEventListener('keydown', kick);
document.addEventListener('visibilitychange', sync);
onPref((name) => { if (name === 'music') sync(); });
