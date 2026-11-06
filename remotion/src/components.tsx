import React, {CSSProperties} from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {FOOTAGE} from './footage';
import {CURSOR, MAG} from './art';
import {V, clamp} from './lib';

// ---------- fonts (official @remotion/fonts loader; Remotion waits for them before rendering) ----------
const FONTS: Array<[string, string, string]> = [
  ['Cairo', '400', 'Cairo-400.ttf'], ['Cairo', '700', 'Cairo-700.ttf'], ['Cairo', '900', 'Cairo-900.ttf'],
  ['Tajawal', '500', 'Tajawal-500.ttf'], ['Tajawal', '800', 'Tajawal-800.ttf'],
];
FONTS.forEach(([family, weight, file]) => loadFont({family, weight, url: staticFile('fonts/' + file)}));

export const CSS = `
:root{--ink:#0a2530;--ink2:#113845;--teal:#127369;--teal2:#1fa595;--mint:#bfe9df;--paper:#fbf6ea;--amber:#f4ab3c;--red:#e2584c;--green:#35b37a}
.stage *{box-sizing:border-box;margin:0;padding:0}
.stage{font-family:Cairo,Tajawal,sans-serif;color:#fff;direction:rtl}
.p{transform-box:fill-box;transform-origin:50% 100%} .c{transform-box:fill-box;transform-origin:50% 50%}
.abs{position:absolute} .center{position:absolute;left:0;right:0;text-align:center}
.pin{position:absolute;width:0;height:0;display:flex;align-items:center;justify-content:center} .pin>*{flex:none}
.h1{font-weight:900;font-size:150px;line-height:1.1} .h2{font-weight:900;font-size:72px;line-height:1.2} .h3{font-weight:700;font-size:44px;line-height:1.35}
.pill{display:inline-block;padding:10px 34px;border-radius:999px;background:rgba(31,165,149,.18);border:2px solid rgba(31,165,149,.6);font-weight:700;font-size:32px;color:var(--mint)}
.amber{color:var(--amber)} .mint{color:var(--mint)}
.card{background:#fff;color:var(--ink);border-radius:28px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.btn{display:inline-block;padding:18px 56px;border-radius:999px;background:var(--amber);color:var(--ink);font-weight:900;font-size:40px;box-shadow:0 10px 0 #b9761d,0 18px 40px rgba(0,0,0,.35)}
.chip{white-space:nowrap;padding:10px 26px;border-radius:16px;background:#fff;color:var(--ink);font-weight:700;font-size:30px;border-inline-start:10px solid var(--amber);box-shadow:0 10px 30px rgba(0,0,0,.3)}
.ring{width:150px;height:150px;border-radius:50%;border:6px solid var(--amber);box-shadow:0 0 0 8px rgba(244,171,60,.25)}
.topbar{position:absolute;left:0;right:0;top:0;height:96px;background:linear-gradient(180deg,rgba(6,23,30,.92),rgba(6,23,30,.75));display:flex;align-items:center;justify-content:space-between;padding:0 50px;z-index:20}
.topbar .ttl{font-weight:900;font-size:38px} .steps{display:flex;gap:16px}
.step{padding:8px 26px;border-radius:999px;font-weight:700;font-size:26px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.55)}
.step.on{background:var(--amber);color:var(--ink)}
.counter{font-weight:700;font-size:30px;color:var(--mint)}
.vhs{position:absolute;inset:0;z-index:15;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px)}
.vhsband{position:absolute;left:0;right:0;height:60px;background:rgba(255,255,255,.12);filter:blur(6px)}
.vhstag{position:absolute;top:130px;right:70px;font-family:'DejaVu Sans Mono',monospace;font-weight:700;font-size:44px;color:#fff;text-shadow:0 0 12px rgba(255,255,255,.6)}
.vhstag .ar{font-family:Cairo}
.tc{position:absolute;bottom:60px;left:70px;font-family:'DejaVu Sans Mono',monospace;font-size:36px;color:#fff;text-shadow:0 0 10px #fff8;direction:ltr}
.caption{position:absolute;left:0;right:0;bottom:70px;display:flex;justify-content:center;z-index:16}
.captxt{white-space:nowrap;background:rgba(0,0,0,.78);padding:16px 44px;border-radius:14px;font-size:40px;font-weight:700}
.dim{position:absolute;inset:0;background:rgba(6,23,30,.8);z-index:25}
.opt{position:absolute;top:350px;width:520px;height:350px;padding:30px 34px;border-radius:30px;background:#fff;color:var(--ink);font-size:31px;font-weight:700;line-height:1.5;z-index:26;border:6px solid transparent}
.opt .let{width:66px;height:66px;border-radius:50%;background:var(--ink2);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:36px;margin-bottom:14px}
.opt .mark{position:absolute;left:24px;top:24px;width:66px;height:66px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;color:#fff}
.fb{position:absolute;left:0;right:0;top:740px;text-align:center;z-index:27}
.fbin{display:inline-block;padding:22px 60px;border-radius:24px;background:var(--green);color:#fff;font-weight:900;font-size:50px;box-shadow:0 16px 40px rgba(0,0,0,.35)}
.fbsub{font-size:36px;font-weight:700;margin-top:14px;color:var(--mint)}
.page{position:absolute;left:560px;top:150px;width:800px;height:600px;background:var(--paper);color:var(--ink);border-radius:18px;padding:60px 70px;box-shadow:0 30px 80px rgba(0,0,0,.45);background-image:repeating-linear-gradient(180deg,transparent 0 63px,rgba(18,115,105,.18) 63px 65px);z-index:30}
.page:before{content:"";position:absolute;right:46px;top:0;bottom:0;width:3px;background:rgba(226,88,76,.45)}
.page .num{font-weight:900;font-size:30px;color:var(--teal)} .page .lt{font-weight:900;font-size:52px;line-height:1.3;margin:6px 0 24px} .page .law{font-weight:700;font-size:40px;line-height:1.6}
.slot{position:absolute;top:0;width:220px;height:130px;border-radius:16px;border:3px dashed rgba(191,233,223,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:24px;color:rgba(191,233,223,.8);text-align:center;line-height:1.3}
.slot.full{border:3px solid var(--teal2);background:var(--teal);color:#fff} .slot .ic{font-size:34px;font-weight:900}
`;

export const BG: CSSProperties = {background: 'radial-gradient(ellipse at 50% 40%,#123f4a 0%,#0a2530 55%,#06171e 100%)'};

/** Full-frame SVG layer: html is placed inside a <g> at (tx,ty) whose CSS transform is `style`. */
export const Layer: React.FC<{html: string; tx?: number; ty?: number; cls?: string; style?: CSSProperties; opacity?: number}> =
  ({html, tx = 0, ty = 0, cls = 'c', style, opacity = 1}) => (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible', opacity}}>
      <g transform={`translate(${tx},${ty})`}><g className={cls} style={style} dangerouslySetInnerHTML={{__html: html}} /></g>
    </svg>
  );
export const Svg: React.FC<{html: string; style?: CSSProperties}> = ({html, style}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, ...style}} dangerouslySetInnerHTML={{__html: html}} />
);

/** Real-footage slot. Renders the clip (seconds, local time) if configured, else nothing. */
export const hasFootage = (key: string) => !!FOOTAGE[key];
export const Footage: React.FC<{k: string; from?: number; dur?: number; style?: CSSProperties}> = ({k, from = 0, dur, style}) => {
  const {fps} = useVideoConfig();
  const f = FOOTAGE[k];
  if (!f) return null;
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none">
      <AbsoluteFill style={style}><OffthreadVideo src={staticFile('footage/' + f)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
    </Sequence>
  );
};

/** Sound effect cue at local time `at` (seconds). */
export const Sfx: React.FC<{at: number; type: string; volume?: number}> = ({at, type, volume = 0.8}) => {
  const {fps} = useVideoConfig();
  return <Sequence from={Math.max(0, Math.round(at * fps))} layout="none"><Audio src={staticFile(`audio/sfx/${type}.wav`)} volume={volume} /></Sequence>;
};
export const Cues: React.FC<{cues: Array<[number, string]>}> = ({cues}) => <>{cues.map(([a, ty], i) => <Sfx key={i} at={a} type={ty} />)}</>;

/** Animated mouse cursor: path [[t,x,y],...]; clicks = times. */
export const Cursor: React.FC<{t: number; path: Array<[number, number, number]>; clicks?: number[]; hidden?: boolean}> = ({t, path, clicks = [], hidden}) => {
  const x = V(t, path.map((p) => [p[0], p[1]] as [number, number])), y = V(t, path.map((p) => [p[0], p[2]] as [number, number]));
  let s = 1; clicks.forEach((c) => {if (t > c && t < c + 0.25) s = 1 - 0.25 * Math.sin(((t - c) / 0.25) * Math.PI);});
  const o = hidden ? 0 : V(t, [[path[0][0] - 0.3, 0], [path[0][0], 1]]);
  return <div style={{position: 'absolute', left: 0, top: 0, zIndex: 50, opacity: o, transform: `translate(${x}px,${y}px) scale(${s})`}} dangerouslySetInnerHTML={{__html: CURSOR}} />;
};
export const Magnifier: React.FC<{style: CSSProperties}> = ({style}) => (
  <div className="pin" style={{left: 0, top: 0, zIndex: 14, ...style}}><div style={{margin: '70px 0 0 70px'}} dangerouslySetInnerHTML={{__html: MAG}} /></div>
);

/** Word-by-word reveal of a sentence between t0 and t1. */
export const Words: React.FC<{text: string; t: number; t0: number; t1: number}> = ({text, t, t0, t1}) => {
  const ws = text.trim().split(/\s+/);
  return <>{ws.map((w, i) => {const a = t0 + ((t1 - t0) * i) / ws.length; return <React.Fragment key={i}><span style={{opacity: clamp((t - a) / 0.22, 0, 1)}}>{w}</span>{i < ws.length - 1 ? ' ' : ''}</React.Fragment>;})}</>;
};
