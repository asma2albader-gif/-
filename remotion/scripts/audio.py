"""Synthesise the royalty-free music bed and sound effects used by the Remotion video.
Usage: python3 scripts/audio.py public/audio <total_seconds>
Writes public/audio/music.wav and public/audio/sfx/<name>.wav
"""
import json, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

def env(n, a=0.01, r=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    rel = np.clip((n / SR - t) / max(r, 1e-4), 0, 1)
    return e * rel

def tone(f, dur, kind='sine', decay=None, a=0.005):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * f * t
    if kind == 'sine': w = np.sin(ph)
    elif kind == 'tri': w = 2 / np.pi * np.arcsin(np.sin(ph))
    elif kind == 'bell': w = np.sin(ph) + .35 * np.sin(2.76 * ph) * np.exp(-t * 6) + .2 * np.sin(5.4 * ph) * np.exp(-t * 10)
    else: w = np.sin(ph)
    e = env(n, a, min(.08, dur / 3))
    if decay: e = e * np.exp(-t * decay)
    return w * e

def lowpass(x, cutoff):
    """one-pole low-pass, cutoff may be array"""
    cutoff = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += alpha[i] * (x[i] - acc); y[i] = acc
    return y

def noise(dur): return rng.uniform(-1, 1, int(dur * SR))

def chirp(f0, f1, dur, kind='sine'):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if kind == 'sine' else 2 * (ph / (2 * np.pi) % 1) - 1
    return w

def m2f(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- sound effects ----------------
def sfx(kind):
    if kind in ('whoosh', 'swish'):
        d = .7 if kind == 'whoosh' else .38
        n = noise(d); t = np.linspace(0, 1, len(n))
        cut = 300 + 4200 * np.sin(np.pi * t) ** 2
        return lowpass(n, cut) * np.sin(np.pi * t) ** 1.5 * (.55 if kind == 'whoosh' else .4)
    if kind == 'pop':
        x = chirp(950, 320, .09) * env(int(.09 * SR), .002, .05); return x * .45
    if kind == 'click':
        x = tone(2200, .035, decay=90) * .3; x[:80] += noise(80 / SR) * .4; return x
    if kind == 'boom':
        x = tone(55, 1.4, decay=3, a=.004) * .9 + lowpass(noise(1.4), 400) * np.exp(-np.arange(int(1.4 * SR)) / SR * 5) * .6
        return x * .8
    if kind == 'shimmer':
        out = np.zeros(int(1.6 * SR))
        for i, m in enumerate([76, 79, 83, 86, 88, 91]):
            s = int(i * .09 * SR); x = tone(m2f(m), .9, 'bell', decay=4) * .16; out[s:s + len(x)] += x
        return out
    if kind == 'type':
        out = np.zeros(int(2.2 * SR))
        for i in range(16):
            s = int((i * .13 + rng.uniform(0, .04)) * SR); x = lowpass(noise(.02), 3000) * env(int(.02 * SR), .001, .015) * .35
            out[s:s + len(x)] += x
        return out
    if kind == 'rewind':
        d = 1.0; n = int(d * SR); t = np.arange(n) / SR
        x = chirp(1400, 260, d, 'saw') * (.5 + .5 * np.sin(2 * np.pi * 22 * t))
        return lowpass(x, 2500) * env(n, .02, .1) * .22
    if kind == 'tick':
        out = np.zeros(int(2.3 * SR))
        for i in range(9):
            s = int(i * .26 * SR); x = tone(1600 if i % 2 else 1200, .03, decay=120) * .18; out[s:s + len(x)] += x
        return out
    if kind == 'pause':
        a = tone(m2f(64), .16, 'tri') * .28; b = tone(m2f(64), .16, 'tri') * .28
        return np.concatenate([a, np.zeros(int(.06 * SR)), b])
    if kind == 'wrong':
        a = tone(m2f(64), .22, 'tri') * .3; b = tone(m2f(60), .4, 'tri', decay=3) * .3
        return np.concatenate([a, b])
    if kind == 'splash':
        d = .9; n = int(d * SR); t = np.arange(n) / SR
        return lowpass(noise(d), 1800 * np.exp(-t * 2) + 200) * np.exp(-t * 4) * .7
    if kind == 'success':
        out = np.zeros(int(1.8 * SR))
        for i, m in enumerate([72, 76, 79, 84]):
            s = int(i * .1 * SR); x = tone(m2f(m), 1.3, 'bell', decay=3) * .22; out[s:s + len(x)] += x
        return out
    if kind == 'page':
        d = .7; n = int(d * SR); t = np.arange(n) / SR
        return lowpass(noise(d), 2600) * (.5 + .5 * np.sin(2 * np.pi * 14 * t)) * np.sin(np.pi * t / d) * .35
    if kind == 'chime':
        out = np.zeros(int(2 * SR))
        for i, m in enumerate([84, 88]):
            s = int(i * .12 * SR); x = tone(m2f(m), 1.6, 'bell', decay=2.5) * .2; out[s:s + len(x)] += x
        return out
    if kind == 'ding':
        return tone(m2f(88), .8, 'bell', decay=5) * .18
    if kind == 'zoom':
        d = .5; return chirp(300, 1500, d) * env(int(d * SR), .05, .15) * .15
    return np.zeros(10)

# ---------------- music bed ----------------
def music(total):
    n = int(total * SR); out = np.zeros(n + SR * 14)
    bpm = 92; beat = 60 / bpm; bar = beat * 4
    prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
    t_ = 0.0; ci = 0
    while t_ < total:
        ch = prog[ci % 4]
        # pad (2 bars per chord)
        d = bar * 2; nn = int(d * SR); tt = np.arange(nn) / SR
        pad = np.zeros(nn)
        for m in ch:
            for det in (-0.08, 0.08):
                f = m2f(m) * 2 ** (det / 12)
                pad += np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)
        pad *= env(nn, 1.2, 1.2) * .022
        s = int(t_ * SR); out[s:s + nn] += pad
        # bass on beats 1 and 3
        for b in range(8):
            if b % 2 == 0:
                x = tone(m2f(ch[0] - 12), beat * 1.6, decay=2.2, a=.01) * .16
                ss = int((t_ + b * beat) * SR); out[ss:ss + len(x)] += x
        # arpeggio 8ths
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12, ch[1] + 12, ch[0] + 24, ch[2] + 12]
        for k in range(16):
            m = arp[k % 8]; x = tone(m2f(m), .45, 'bell', decay=7) * .05
            ss = int((t_ + k * beat / 2) * SR); out[ss:ss + len(x)] += x
        # soft hats on offbeats
        for k in range(8):
            x = lowpass(noise(.05), 7000) * env(int(.05 * SR), .001, .04) * .03
            x = x - lowpass(x, 3000)
            ss = int((t_ + k * beat + beat / 2) * SR); out[ss:ss + len(x)] += x
        t_ += d; ci += 1
    out = out[:n]
    tt = np.arange(n) / SR
    fade = np.minimum(1, tt / 2.5) * np.clip((total - tt) / 4, 0, 1)
    return out * fade

def write_wav(path, mono):
    peak = np.max(np.abs(mono)) or 1
    d = int(.012 * SR)
    L = mono; R = np.concatenate([np.zeros(d), mono[:-d]]) * .97 + mono * .03
    pcm = (np.clip(np.stack([L, R], 1), -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

SFX = ['whoosh', 'swish', 'pop', 'click', 'boom', 'shimmer', 'type', 'rewind', 'tick', 'pause',
       'wrong', 'splash', 'success', 'page', 'chime', 'ding', 'zoom']

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'public/audio'
    total = float(sys.argv[2]) if len(sys.argv) > 2 else 210
    m = music(total); write_wav(f'{out}/music.wav', m / np.max(np.abs(m)) * .5)
    import subprocess
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{out}/music.wav', '-c:a', 'aac', '-b:a', '192k', f'{out}/music.m4a'], check=True)
    import os; os.remove(f'{out}/music.wav')
    for k in SFX:
        x = sfx(k); write_wav(f'{out}/sfx/{k}.wav', np.clip(x * 1.6, -1, 1))
    print('wrote music', f'{total:.0f}s', 'and', len(SFX), 'sfx to', out)

if __name__ == '__main__': main()
