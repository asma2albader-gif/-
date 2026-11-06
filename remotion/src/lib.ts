import type {CSSProperties} from 'react';

export type EaseFn = (p: number) => number;
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const ease: EaseFn = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const easeOut: EaseFn = (p) => 1 - Math.pow(1 - p, 3);
export const back: EaseFn = (p) => {const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);};
export const lin: EaseFn = (p) => p;
export const ar = (n: number | string) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

/** Piecewise keyframe interpolation on numbers: [[time, value, easeIntoThisKey?], ...] */
export function V(t: number, kf: Array<[number, number, EaseFn?]>): number {
  if (t <= kf[0][0]) return kf[0][1];
  const L = kf[kf.length - 1];
  if (t >= L[0]) return L[1];
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (t >= a[0] && t < b[0]) {const p = (t - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (b[2] || ease)(p);}
  }
  return L[1];
}

export type P = {o?: number; x?: number; y?: number; s?: number; r?: number; b?: number; cl?: number; dash?: number};
export type KF = Array<[number, P, EaseFn?]>;

export function props(t: number, kf: KF): P {
  const keys = new Set<keyof P>();
  kf.forEach((k) => (Object.keys(k[1]) as (keyof P)[]).forEach((x) => keys.add(x)));
  const out: P = {};
  for (const key of keys) {
    const fr = kf.filter((k) => key in k[1]).map((k) => [k[0], k[1][key] as number, k[2]] as [number, number, EaseFn?]);
    out[key] = V(t, fr);
  }
  return out;
}
export function sty(p: P): CSSProperties {
  const st: CSSProperties = {};
  if (p.o !== undefined) st.opacity = clamp(p.o, 0, 1);
  if (p.x !== undefined || p.y !== undefined || p.s !== undefined || p.r !== undefined)
    st.transform = `translate(${p.x || 0}px,${p.y || 0}px) rotate(${p.r || 0}deg) scale(${p.s ?? 1})`;
  if (p.b !== undefined) st.filter = p.b > 0.01 ? `blur(${p.b}px)` : 'none';
  if (p.cl !== undefined) st.clipPath = `inset(-20px -20px -20px ${100 - clamp(p.cl, 0, 100)}%)`;
  if (p.dash !== undefined) st.strokeDashoffset = p.dash;
  return st;
}
/** keyframes -> style */
export const K = (t: number, kf: KF, extra?: CSSProperties): CSSProperties => ({...extra, ...sty(props(t, kf))});

export const pop = (t0: number, dur = 0.5): KF => [[t0, {o: 0, s: 0.6}], [t0 + dur, {o: 1, s: 1}, back]];
export const fadeUp = (t0: number, d = 0.6, dy = 40): KF => [[t0, {o: 0, y: dy}], [t0 + d, {o: 1, y: 0}, easeOut]];
export const sceneFade = (t: number, dur: number) => K(t, [[0, {o: 0}], [0.45, {o: 1}], [dur - 0.45, {o: 1}], [dur, {o: 0}]]);
