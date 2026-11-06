import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ST, stationTimes} from './data';
import {BAG, DROPS, MATE, PUDDLE, SALMA, SHARDS, STRIP, cupSvg, hazard, person, stationBg, tissue, tube} from './art';
import {Cues, Cursor, Footage, Layer, Magnifier, Svg, Words, hasFootage} from './components';
import {K, V, ar, back, clamp, easeOut, fadeUp, lin, pop, sceneFade} from './lib';

export const stationDuration = (si: number) => stationTimes(ST[si]).dur;

/** Illustrated actors for station `si` at station-local time `t` (supports the rewind and the station-1 wrong branch). */
export function buildActors(si: number, t: number, T: ReturnType<typeof stationTimes>): React.ReactNode[] {
  const s = ST[si];
  const {R, D, W, D2} = T;
  const inR = t >= R && t < D;
  const bob = (t0: number, t1: number) => (t > t0 && t < t1 ? -Math.abs(Math.sin((t - t0) * 9)) * 10 : 0);
  const actors: React.ReactNode[] = [];
  const salmaAt = (tx: number, ty: number, html: string, x: number, y: number, r = 0, op = 1) =>
    actors.push(<Layer key="salma" html={html} tx={tx} ty={ty} cls="p" opacity={op} style={{transform: `translate(${x}px,${y}px) rotate(${r}deg)`}} />);
  switch (s.n) {
    case 1: {
      let x = V(t, [[R, 0], [R + 1, 520, lin], [R + 1.2, 520], [R + 3.2, 0, easeOut]]);
      let y = bob(R, R + 1) + bob(R + 1.2, R + 3.2);
      if (s.wrong && t > W) {x = V(t, [[W, 0], [W + 1.6, -330, easeOut]]); y = bob(W, W + 1.6); if (t > D2 - 0.4) x = V(t, [[D2 - 0.4, -330], [D2, 0]]);}
      const wrongNow = t > W + 0.9 && t < D2 - 0.4;
      const cupRot = wrongNow ? -80 * easeOut(clamp((t - W - 0.9) / 0.5, 0, 1)) : 0;
      const spillOn = t > W + 1.1 && t < D2 - 0.4;
      actors.push(<Layer key="spill" html={`<ellipse cx="0" cy="0" rx="130" ry="26" fill="#c7553a" opacity=".75"/>`} tx={1130} ty={790} opacity={spillOn ? 0.9 : 0}
        style={{transform: `scale(${easeOut(clamp((t - W - 1.1) / 0.9, 0, 1))})`}} />);
      salmaAt(1350, 760, person({...SALMA, coat: false, open: true, armR: -40, hand: cupSvg(cupRot)}), x, y);
      break;
    }
    case 2: {
      let bag = {o: 1, x: 0, y: 0, r: 0};
      if (t >= R && t < R + 1) bag = {o: 1 - (t - R), x: 0, y: 0, r: 0};
      else if (t >= R + 1) bag = {o: V(t, [[R + 2.3, 0], [R + 2.35, 1]]), x: V(t, [[R + 2.3, 140], [R + 3, 0]]), y: V(t, [[R + 2.3, -160], [R + 2.9, 0, easeOut]]), r: V(t, [[R + 2.3, -20], [R + 2.9, 0]])};
      actors.push(<Layer key="bag" html={BAG} tx={960} ty={742} opacity={bag.o} style={{transform: `translate(${bag.x}px,${bag.y}px) rotate(${bag.r}deg)`}} />);
      salmaAt(1060, 760, person(SALMA), V(t, [[R + 1, -1300], [R + 2.3, 0, easeOut]]), bob(R + 1, R + 2.3), 0, inR && t > R + 1 ? 1 : 0);
      break;
    }
    case 3: {
      const dash = t < R ? 0 : t < R + 1 ? (t - R) * 900 : V(t, [[R + 1, 900], [R + 2.2, 900], [R + 3.2, 0]]);
      const fadeBack = (a: number, b: number) => (t < R ? 1 : t < R + 1 ? 1 - (t - R) : V(t, [[a, 0], [b, 1]]));
      actors.push(<Svg key="cord" html={`<path d="M1565,450 C1560,520 1400,540 1300,548 S960,560 790,552" stroke="#2a2f3a" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="${dash}"/>`} />);
      actors.push(<Svg key="strip" html={STRIP} style={{opacity: fadeBack(R + 3, R + 3.2)}} />);
      actors.push(<Svg key="drops" html={DROPS} style={{opacity: fadeBack(R + 2.4, R + 3.2)}} />);
      salmaAt(1250, 760, person({...SALMA, armR: -60}), V(t, [[R + 1, 500], [R + 2.2, 0, easeOut], [R + 3, 0], [R + 3.3, 60]]), bob(R + 1, R + 2.2), 0, t > R + 1 && t < D + 0.4 ? 1 : 0);
      break;
    }
    case 4: {
      const inRR = t >= R && t < D + 0.4;
      actors.push(<Layer key="puddle" html={PUDDLE} tx={980} ty={850} />);
      actors.push(<Layer key="mate" html={person({...MATE, armR: -70, hand: tissue})} tx={600} ty={800} cls="p" opacity={inRR ? 0 : 1} style={{transform: `rotate(${-12 + Math.sin(t * 2) * 2}deg)`}} />);
      salmaAt(860, 820, person({...SALMA, armR: -70, hand: tissue}), V(t, [[R + 1, 800], [R + 2.3, 0, easeOut]]), bob(R + 1, R + 2.3), V(t, [[R + 2.4, 0], [R + 3.1, -14]]), inRR && t > R + 1 ? 1 : 0);
      break;
    }
    case 5: {
      const inRR = t >= R && t < D + 0.4;
      const p = clamp((t - R - 1.6) / 0.8, 0, 1);
      actors.push(<Layer key="ft" html={tube(0, 0, '#e2584c')} tx={1040} ty={560} opacity={inRR && t > R + 1.6 && t < R + 2.4 ? 1 : 0} style={{transform: `translate(0px,${240 * p * p}px) rotate(${200 * p}deg)`}} />);
      actors.push(<Svg key="shards" html={SHARDS} style={{opacity: t < R ? 1 : t < R + 1 ? 1 - (t - R) : t > R + 2.4 ? 1 : 0}} />);
      actors.push(<Layer key="mate" html={person({...MATE, armL: 30, armR: -20})} tx={1480} ty={800} cls="p" opacity={inRR ? 0 : 1} style={{transform: `rotate(${-14 + Math.sin(t * 2) * 2}deg)`}} />);
      salmaAt(1180, 780, person(SALMA), V(t, [[R + 1, -900], [R + 2.0, 0, easeOut]]), bob(R + 1, R + 2.0), V(t, [[R + 2.7, 0], [R + 3.2, -16]]), inRR && t > R + 1 ? 1 : 0);
      break;
    }
  }
  return actors;
}


/** Restored page flying into the notebook + slot strip. `P` = start time. */
export const PageRestore: React.FC<{si: number; t: number; P: number}> = ({si, t, P}) => {
  const s = ST[si];
  const scx = 350 + (4 - si) * 250 + 110;
  const done = t > P + 3.5;
  return <>
      <div className="abs" style={{inset: 0, background: 'rgba(6,23,30,.88)', zIndex: 28, ...K(t, [[P - 0.2, {o: 0}], [P + 0.3, {o: 1}]])}} />
      <div className="page" style={K(t, [[P, {o: 0, s: 0.4, r: -12, x: 0, y: -200}], [P + 0.6, {o: 1, s: 1, r: 0, x: 0, y: 0}, back], [P + 2.9, {s: 1, x: 0, y: 0, r: 0}], [P + 3.5, {s: 0.275, x: scx - 960, y: 480, r: 0}], [P + 3.55, {o: 1}], [P + 3.65, {o: 0}]])}>
        <div className="num">الصفحة {ar(s.n)} — مستعادة ✓</div><div className="lt">{s.law}</div><div className="law"><Words text={s.page} t={t} t0={P + 0.6} t1={P + 2.4} /></div>
      </div>
      <div className="abs" style={{left: 0, right: 0, top: 860, height: 140, zIndex: 29, ...K(t, [[P + 0.2, {o: 0, y: 40}], [P + 0.7, {o: 1, y: 0}]])}}>
        {ST.map((x, i) => {const full = i < si || (i === si && done);
          return <div key={i} className={'slot' + (full ? ' full' : '')} style={{left: 350 + (4 - i) * 250, ...(i === si ? K(t, [[P + 3.5, {s: 1}], [P + 3.75, {s: 1.15}, easeOut], [P + 4.0, {s: 1}]]) : {})}}>
            <div className="ic">{full ? '✓' : ar(x.n)}</div><div>{x.name}</div></div>;})}
      </div>
  </>;
};

export const Station: React.FC<{si: number}> = ({si}) => {
  const {fps} = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const s = ST[si];
  const T = stationTimes(s);
  const {R, D, W, D2, P} = T;
  const inR = t >= R && t < D;
  const ph = t < R ? 0 : t < D ? 1 : 2;
  const live = hasFootage(`st${s.n}`), liveRew = hasFootage(`st${s.n}_rewind`), liveWrong = hasFootage('st1_wrong');

  // ---------- sound cues ----------
  const cues: Array<[number, string]> = [[0.1, 'whoosh'], [0.5, 'boom'], [3.4, 'swish']];
  s.clues.forEach((_, i) => cues.push([4.2 + i * 1.25, 'pop']));
  if (s.lens) cues.push([7.9, 'zoom']);
  cues.push([R, 'rewind'], [R + 1.0, 'tick'], [R + 3.3, 'pause'], [D, 'swish']);
  if (s.wrong) cues.push([D + 2.3, 'click'], [D + 2.45, 'wrong'], [W + 1.0, 'splash'], [W + 4.4, 'click'], [D2 + 2.3, 'click']);
  else cues.push([D + 2.3, 'click']);
  cues.push([D2 + 2.45, 'success'], [P, 'page'], [P + 0.6, 'type'], [P + 3.1, 'swish'], [P + 3.5, 'chime']);

  const actors = buildActors(si, t, T);
  const showIllus = !(live && !inR) && !(liveRew && inR) && !(s.wrong && liveWrong && t > W && t < D2);

  // ---------- magnifier path ----------
  const mp: Array<[number, number, number]> = [[3.4, 1920, 1080]];
  s.clues.forEach((c, i) => {mp.push([3.85 + i * 1.25, c[1], c[2]]); mp.push([4.25 + i * 1.25, c[1], c[2]]);});
  if (s.lens) {mp.push([7.7, 1400, 470]); mp.push([7.9 + T.L - 0.4, 1400, 470]);}
  mp.push([R - 0.4, 1700, 1150]);
  const magStyle = {transform: `translate(${V(t, mp.map((p) => [p[0], p[1]] as [number, number]))}px,${V(t, mp.map((p) => [p[0], p[2]] as [number, number]))}px)`, opacity: V(t, [[3.3, 0], [3.5, 1], [R - 0.5, 1], [R - 0.3, 0]])};

  // ---------- rewind HUD ----------
  const sec = t < R + 1 ? Math.max(0, 12 - (t - R) * 12) : Math.min(9, (t - R - 1) * 2.6 + 3.5);
  const tc = `00:00:${String(Math.floor(sec)).padStart(2, '0')}:${String(Math.floor((sec % 1) * 30)).padStart(2, '0')}`;
  const vtag = t < R + 1 ? <>◀◀ <span className="ar">إعادة الشريط</span></> : t < R + 3.3 ? <>▶ <span className="ar">تشغيل</span></> : <>❚❚ <span className="ar">لحظة حرجة</span></>;
  const artStyle: React.CSSProperties = {filter: inR ? 'sepia(.55) saturate(.85) contrast(1.08)' : 'none', transform: inR && t < R + 1 ? `translateX(${Math.sin(t * 90) * 6}px)` : 'none'};

  // ---------- decision ----------
  const optL = [1270, 700, 130];
  const dimKf: any = [[D, {o: 0}], [D + 0.4, {o: 1}]]; if (s.wrong) dimKf.push([W - 0.1, {o: 1}], [W + 0.3, {o: 0}], [D2 - 0.4, {o: 0}], [D2, {o: 1}]);
  const qk: any = [[D + 0.2, {o: 0, y: -30}], [D + 0.6, {o: 1, y: 0}]]; if (s.wrong) qk.push([W - 0.1, {o: 1, y: 0}], [W + 0.2, {o: 0, y: -30}], [D2 - 0.3, {o: 0, y: -30}], [D2, {o: 1, y: 0}]);
  const cpath: Array<[number, number, number]> = s.wrong
    ? [[D + 1.2, 960, 1100], [D + 2.1, 1530, 560], [W, 1530, 560], [W + 3.6, 1300, 1100], [W + 4.3, 960, 990], [D2 + 1.2, 960, 990], [D2 + 2.1, 960, 560]]
    : [[D + 1.2, 960, 1100], [D + 2.1, 960, 560]];
  const cursorHidden = t < D + 1.0 || t > P - 0.2 || (s.wrong && t > W + 0.2 && t < W + 3.3);
  const scx = 350 + (4 - si) * 250 + 110;
  const done = t > P + 3.5;

  return (
    <AbsoluteFill className="stage" style={sceneFade(t, T.dur)}>
      <Cues cues={cues} />
      {/* scene: illustration or real footage */}
      <AbsoluteFill style={artStyle}>
        {showIllus && <><Svg html={stationBg(s.n)} />{actors}</>}
        {live && <Footage k={`st${s.n}`} from={2.6} dur={R - 2.6} />}
        {live && <Footage k={`st${s.n}`} from={D} />}
        {liveRew && <Footage k={`st${s.n}_rewind`} from={R} dur={D - R} />}
        {s.wrong && liveWrong && <Footage k="st1_wrong" from={W} dur={D2 - W} />}
      </AbsoluteFill>
      {/* rewind overlay */}
      <div className="vhs" style={K(t, [[R - 0.05, {o: 0}], [R, {o: 1}], [D - 0.1, {o: 1}], [D + 0.1, {o: 0}]])}>
        <div className="vhsband" style={{top: ((t * 700) % 1200) - 100}} />
        <div className="vhstag" style={{color: t >= R + 3.3 ? '#f4ab3c' : '#fff'}}>{vtag}</div>
        <div className="tc">{tc}</div>
      </div>
      <div className="caption" style={K(t, [[R + 3.3, {o: 0, y: 30}], [R + 3.7, {o: 1, y: 0}], [D - 0.1, {o: 1}], [D + 0.1, {o: 0}]])}><div className="captxt">{s.rew}</div></div>
      {/* clues */}
      {s.clues.map((c, i) => {
        const t0 = 4.2 + i * 1.25; const dy = c[3] ?? (c[2] > 700 ? -115 : 115);
        return <React.Fragment key={i}>
          <div className="pin" style={{left: c[1], top: c[2], zIndex: 12}}><div className="ring" style={K(t, [[t0, {o: 0, s: 0.3}], [t0 + 0.4, {o: 1, s: 1 + 0.06 * Math.sin(t * 6)}, back], [R - 0.2, {o: 1}], [R + 0.2, {o: 0}]])} /></div>
          <div className="pin" style={{left: c[1], top: c[2] + dy, zIndex: 13}}><div className="chip" style={K(t, [[t0 + 0.1, {o: 0, s: 0.6}], [t0 + 0.5, {o: 1, s: 1}, back], [R - 0.2, {o: 1}], [R + 0.2, {o: 0}]])}>
            <span style={{color: 'var(--amber)', fontWeight: 900}}>{ar(i + 1)}</span>&nbsp; {c[0]}</div></div>
        </React.Fragment>;
      })}
      <Magnifier style={magStyle} />
      {s.lens && <div className="pin" style={{left: 1000, top: 520, zIndex: 17}}>
        <div style={{width: 600, height: 600, borderRadius: '50%', background: '#fff', border: '16px solid var(--amber)', boxShadow: '0 0 0 12px rgba(0,0,0,.25),0 30px 80px rgba(0,0,0,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', textAlign: 'center',
          ...K(t, [[7.9, {o: 0, s: 0.2}], [8.4, {o: 1, s: 1}, back], [7.9 + T.L - 0.3, {o: 1, s: 1}], [7.9 + T.L, {o: 0, s: 0.6}]])}}>
          <svg width={220} height={220} viewBox="-80 -80 160 160" dangerouslySetInnerHTML={{__html: hazard(0, 0, 1.05)}} />
          <div style={{fontSize: 44, fontWeight: 900, marginTop: 10}}>مادة أكّالة</div>
          <div style={{fontSize: 30, fontWeight: 700, color: '#c0392b'}}>تحذير: تجنّبي اللمس المباشر</div>
          <div style={{fontSize: 24, color: '#567'}}>(ملصق افتراضي)</div>
        </div></div>}
      {/* top bar */}
      <div className="topbar" style={K(t, [[3.0, {o: 0, y: -60}], [3.6, {o: 1, y: 0}]])}>
        <div className="ttl">المحطة {s.ord}: <span className="amber">{s.name}</span></div>
        <div className="steps">{['العدسة', 'إعادة الشريط', 'القرار'].map((x, k) => <div key={k} className={'step' + (k === ph ? ' on' : '')}>{x}</div>)}</div>
        <div className="counter">الصفحات {ar(si + (done ? 1 : 0))} / ٥</div>
      </div>
      {/* decision */}
      <div className="dim" style={K(t, dimKf)} />
      <div className="center h2" style={{top: 220, zIndex: 26, fontSize: 64, ...K(t, qk)}}>ماذا تفعلين؟</div>
      {s.opts.map((o, i) => {
        const k: any = [[D + 0.4 + i * 0.2, {o: 0, y: 80}], [D + 0.9 + i * 0.2, {o: 1, y: 0}, back]];
        if (s.wrong) k.push([W - 0.1, {o: 1, y: 0}], [W + 0.25, {o: 0, y: 80}], [D2 - 0.3 + i * 0.12, {o: 0, y: 80}], [D2 + 0.2 + i * 0.12, {o: 1, y: 0}, back]);
        k.push([P - 0.3, {o: 1, y: 0}], [P, {o: 0, y: 0}]);
        let st = '';
        if (s.wrong && i === 0 && t > D + 2.4 && t < W + 0.3) st = 'bad';
        if (i === 1 && t > D2 + 2.4) st = 'good';
        const style: React.CSSProperties = {left: optL[i], ...K(t, k),
          borderColor: st === 'good' ? 'var(--green)' : st === 'bad' ? 'var(--red)' : 'transparent',
          boxShadow: st === 'good' ? '0 0 0 10px rgba(53,179,122,.35)' : st === 'bad' ? '0 0 0 10px rgba(226,88,76,.3)' : 'none'};
        if (st === 'bad' && t < D + 2.9) style.transform = `translateX(${Math.sin((t - D - 2.4) * 60) * 10 * (1 - (t - D - 2.4) / 0.5)}px)`;
        if (st === 'good') style.transform = `scale(${1 + 0.06 * Math.sin(clamp((t - D2 - 2.4) / 0.4, 0, 1) * Math.PI)})`;
        return <div key={i} className="opt" style={style}><div className="let">{['أ', 'ب', 'ج'][i]}</div>{o}
          <div className="mark" style={{background: st === 'good' ? 'var(--green)' : st === 'bad' ? 'var(--red)' : 'transparent'}}>{st === 'good' ? '✓' : st === 'bad' ? '✗' : ''}</div></div>;
      })}
      <div className="fb" style={K(t, [[D2 + 2.5, {o: 0, s: 0.7}], [D2 + 2.9, {o: 1, s: 1}, back], [P - 0.3, {o: 1}], [P, {o: 0}]])}><div className="fbin">قرار موفّق!</div><div className="fbsub">{s.why}</div></div>
      {s.wrong && <>
        <div className="center" style={{top: 150, zIndex: 22, ...K(t, [[W + 0.3, {o: 0, y: -30}], [W + 0.7, {o: 1, y: 0}], [D2 - 0.5, {o: 1}], [D2 - 0.2, {o: 0}]])}}>
          <div style={{display: 'inline-block', background: 'rgba(10,37,48,.9)', padding: '22px 50px', borderRadius: 24, border: '3px solid var(--amber)'}}>
            <div style={{fontSize: 54, fontWeight: 900}} className="amber">لنرَ ما سيحدث…</div><div style={{fontSize: 34, fontWeight: 700, marginTop: 6}}>{s.wrong.say}</div></div></div>
        <div className="center" style={{top: 850, zIndex: 22, ...K(t, [[W + 2.4, {o: 0, y: 30}], [W + 2.8, {o: 1, y: 0}], [D2 - 0.5, {o: 1}], [D2 - 0.2, {o: 0}]])}}>
          <div style={{display: 'inline-block', background: '#fff', color: 'var(--ink)', padding: '18px 44px', borderRadius: 20, fontSize: 36, fontWeight: 700, borderInlineStart: '12px solid var(--amber)'}}>{s.wrong.hint}</div></div>
        <div className="center" style={{top: 960, zIndex: 22, ...K(t, [[W + 3.2, {o: 0, s: 0.6}], [W + 3.6, {o: 1, s: 1}, back], [W + 4.4, {s: 0.92}], [W + 4.6, {s: 1}], [D2 - 0.5, {o: 1}], [D2 - 0.2, {o: 0}]])}}>
          <span className="btn" style={{fontSize: 34, padding: '12px 46px'}}>أعيدي المحاولة</span></div>
      </>}
      <PageRestore si={si} t={t} P={P} />
      <Cursor t={t} path={cpath} clicks={s.wrong ? [D + 2.3, W + 4.4, D2 + 2.3] : [D + 2.3]} hidden={cursorHidden} />
      {/* title card */}
      <AbsoluteFill style={{zIndex: 60, background: 'radial-gradient(ellipse at 50% 45%,#134854,#0a2530 60%,#06171e)', ...K(t, [[2.6, {o: 1}], [3.2, {o: 0}]])}}>
        <div className="center" style={{top: 120, fontSize: 420, fontWeight: 900, lineHeight: 1, color: 'rgba(31,165,149,.28)', ...K(t, [[0, {s: 0.7, o: 0}], [1, {s: 1, o: 1}, easeOut], [3.2, {s: 1.08}]])}}>{ar(s.n)}</div>
        <div className="center h3 mint" style={{top: 560, ...K(t, fadeUp(0.4))}}>المحطة {s.ord}</div>
        <div className="center h1" style={{top: 620, fontSize: 120, ...K(t, [[0.6, {o: 0, s: 1.2, b: 10}], [1.2, {o: 1, s: 1, b: 0}, easeOut]])}}>{s.name}</div>
        <div className="center h3 amber" style={{top: 800, ...K(t, [[1.2, {cl: 0}], [2.1, {cl: 100}, lin]])}}>اكتشاف {s.law}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
