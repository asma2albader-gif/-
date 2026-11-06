// Real-image stations: the same student's real footage + evidence cards (real photos or written notes).
import React from 'react';
import {Img} from 'remotion';
import {REAL, ST} from './data';
import {Footage, asset} from './components';
import {ar, clamp, easeOut} from './lib';

/** Real footage of station `si` for one phase, starting at local time `from`. */
export const RealScene: React.FC<{si: number; mode: 'bg' | 'rew' | 'wrong'; from?: number; dur?: number}> = ({si, mode, from = 0, dur}) => {
  const r = REAL[si];
  const [k, start] = mode === 'rew' ? r.rew : mode === 'wrong' ? (r.wrong ?? r.bg) : r.bg;
  return <Footage k={k} from={from} dur={dur} startFrom={start} />;
};

const CW = 380, CH = 330;

/** One evidence card. `flip`: 0 = face down (?), 1 = face up. `o` = opacity, `pop` = entry scale. */
export const EvidenceCard: React.FC<{si: number; i: number; flip: number; o?: number; pop?: number}> = ({si, i, flip, o = 1, pop = 1}) => {
  const c = ST[si].clues[i];
  const card = REAL[si].cards[i];
  const front = flip >= 0.5;
  const sx = Math.abs(Math.cos(clamp(flip, 0, 1) * Math.PI));
  const box: React.CSSProperties = {width: CW, height: CH, borderRadius: 22, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,.45)',
    transform: `scale(${pop}) scaleX(${Math.max(sx, 0.02)})`, opacity: o};
  return (
    <div className="pin" style={{left: c[1], top: c[2], zIndex: 12}}>
      {front ? (
        <div style={{...box, background: '#fff', padding: 12, color: 'var(--ink)', display: 'flex', flexDirection: 'column'}}>
          {card.img
            ? <Img src={asset(`cards/${card.img}.jpg`)} style={{width: CW - 24, height: 220, objectFit: 'cover', borderRadius: 12}} />
            : <div style={{height: 220, borderRadius: 12, background: 'linear-gradient(160deg,#134854,#0a2530)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center', gap: 10}}>
                <span style={{fontSize: 22, fontWeight: 900, color: 'var(--amber)', border: '2px solid var(--amber)', borderRadius: 999, padding: '2px 16px'}}>ملاحظة المحققة</span>
                <span style={{fontSize: 32, fontWeight: 700, lineHeight: 1.45}}>{card.note}</span>
              </div>}
          <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '0 6px', fontSize: 30, fontWeight: 900, lineHeight: 1.2}}>
            <span style={{flex: 'none', width: 46, height: 46, borderRadius: '50%', background: 'var(--amber)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26}}>{ar(i + 1)}</span>
            {c[0]}
          </div>
        </div>
      ) : (
        <div style={{...box, background: 'rgba(10,37,48,.88)', border: '4px dashed var(--amber)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          <span style={{fontSize: 120, fontWeight: 900, color: 'var(--amber)', lineHeight: 1}}>؟</span>
          <span style={{fontSize: 30, fontWeight: 700}}>دليل {ar(i + 1)}</span>
        </div>
      )}
    </div>
  );
};

/** Linear video: cards enter face down at `enter`, flip one by one at 4.2 + i·1.25, leave at `leave`. */
export const LinearCards: React.FC<{si: number; t: number; enter: number; leave: number}> = ({si, t, enter, leave}) => (
  <>{[0, 1, 2].map((i) => {
    const t0 = 4.2 + i * 1.25;
    const pop = 0.7 + 0.3 * easeOut(clamp((t - enter - i * 0.1) / 0.4, 0, 1));
    const o = clamp((t - enter - i * 0.1) / 0.3, 0, 1) * clamp((leave - t) / 0.3, 0, 1);
    return <EvidenceCard key={i} si={si} i={i} flip={clamp((t - t0) / 0.45, 0, 1)} o={o} pop={pop} />;
  })}</>
);
