// Short video segments played by the interactive app (@remotion/player).
// The app pauses between segments and shows real, clickable choices to the student.
import React from 'react';
import {AbsoluteFill, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {CONSEQUENCES, ST, stationTimes} from './data';
import {hazard, stationBg} from './art';
import {BG, CSS, Cues, Footage, Svg, hasFootage} from './components';
import {DUR, Intro, Mission, Outro, Reveal} from './Scenes';
import {PageRestore, buildActors} from './Station';
import {K, V, ar, back, easeOut, fadeUp, lin} from './lib';

export const FPS = 30;
const useT = () => {const {fps} = useVideoConfig(); return useCurrentFrame() / fps;};
const Shell: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={BG} dir="rtl" lang="ar"><style>{CSS}</style>{children}</AbsoluteFill>
);

/* ---------- Opening: title + supervisor's mission (the app then shows «ابدئي التحقيق») ---------- */
export const OPENING_DUR = DUR.intro + 8.8;
export const OpeningSeg: React.FC = () => (
  <Shell><Series>
    <Series.Sequence durationInFrames={Math.round(DUR.intro * FPS)}><Intro /></Series.Sequence>
    <Series.Sequence durationInFrames={Math.round(8.8 * FPS)}><Mission interactive /></Series.Sequence>
  </Series></Shell>
);

/* ---------- Station ---------- */
export type StationSegProps = {si: number; seg: 'intro' | 'rewind' | 'wrong' | 'right'; found: number[]; zoom: boolean; choice: number; count: number};

const RIGHT_P = 3.4; // when the page starts flying back (after the real safe-practice footage)
export const stationSegDur = (si: number, seg: StationSegProps['seg']) => {
  const T = stationTimes(ST[si]);
  return seg === 'intro' ? 3.6 : seg === 'rewind' ? T.D - T.R : seg === 'wrong' ? 4.4 : RIGHT_P + 4.4;
};

const STEP_NAMES = ['العدسة', 'إعادة الشريط', 'القرار'];
const TopBar: React.FC<{si: number; ph: number; count: number; style?: React.CSSProperties}> = ({si, ph, count, style}) => (
  <div className="topbar" style={style}>
    <div className="ttl">المحطة {ST[si].ord}: <span className="amber">{ST[si].name}</span></div>
    <div className="steps">{STEP_NAMES.map((x, k) => <div key={k} className={'step' + (k === ph ? ' on' : '')}>{x}</div>)}</div>
    <div className="counter">الصفحات {ar(count)} / ٥</div>
  </div>
);

export const StationSeg: React.FC<StationSegProps> = ({si, seg, found, zoom, choice, count}) => {
  const t = useT();
  const s = ST[si];
  const T = stationTimes(s);
  const {R, D} = T;
  const live = hasFootage(`st${s.n}`), liveRew = hasFootage(`st${s.n}_rewind`);

  // virtual station time -> drives the illustrated actors exactly like the linear video
  let vt = 3.6;
  if (seg === 'intro') vt = t;
  if (seg === 'rewind') vt = R + t;
  const st1Spill = seg === 'wrong' && si === 0 && choice === 0;
  if (st1Spill) vt = T.W + t;            // station 1 has a full animated consequence
  const inR = seg === 'rewind';
  const actors = buildActors(si, vt, T);

  const ph = seg === 'intro' ? 0 : seg === 'rewind' ? 1 : 2;
  const sec = t < 1 ? Math.max(0, 12 - t * 12) : Math.min(9, (t - 1) * 2.6 + 3.5);
  const tc = `00:00:${String(Math.floor(sec)).padStart(2, '0')}:${String(Math.floor((sec % 1) * 30)).padStart(2, '0')}`;
  const vtag = t < 1 ? <>◀◀ <span className="ar">إعادة الشريط</span></> : t < 3.3 ? <>▶ <span className="ar">تشغيل</span></> : <>❚❚ <span className="ar">لحظة حرجة</span></>;

  const cues: Array<[number, string]> =
    seg === 'intro' ? [[0.1, 'whoosh'], [0.5, 'boom'], [3.0, 'swish']]
    : seg === 'rewind' ? [[0, 'rewind'], [1.0, 'tick'], [3.3, 'pause']]
    : seg === 'wrong' ? [[0, 'wrong'], ...(st1Spill ? [[1.0, 'splash'] as [number, string]] : [])]
    : [[0, 'success'], [RIGHT_P, 'page'], [RIGHT_P + 0.6, 'type'], [RIGHT_P + 3.1, 'swish'], [RIGHT_P + 3.5, 'chime']];

  return (
    <Shell>
      <AbsoluteFill className="stage">
        <Cues cues={cues} />
        {/* the scene */}
        <AbsoluteFill style={{filter: inR ? 'sepia(.55) saturate(.85) contrast(1.08)' : 'none', transform: inR && t < 1 ? `translateX(${Math.sin(t * 90) * 6}px)` : 'none'}}>
          {!(inR ? liveRew : live) && <><Svg html={stationBg(s.n)} />{actors}</>}
          {!inR && live && <Footage k={`st${s.n}`} from={0} />}
          {inR && liveRew && <Footage k={`st${s.n}_rewind`} from={0} />}
        </AbsoluteFill>

        {inR && <>
          <div className="vhs"><div className="vhsband" style={{top: ((t * 700) % 1200) - 100}} />
            <div className="vhstag" style={{color: t >= 3.3 ? '#f4ab3c' : '#fff'}}>{vtag}</div><div className="tc">{tc}</div></div>
          <div className="caption" style={K(t, [[3.3, {o: 0, y: 30}], [3.7, {o: 1, y: 0}]])}><div className="captxt">{s.rew}</div></div>
        </>}

        {/* clues the student has found (clicked) */}
        {seg === 'intro' && s.clues.map((c, i) => found.includes(i) && <React.Fragment key={i}>
          <div className="pin" style={{left: c[1], top: c[2], zIndex: 12}}><div className="ring" /></div>
          <div className="pin" style={{left: c[1], top: c[2] + (c[3] ?? (c[2] > 700 ? -115 : 115)), zIndex: 13}}>
            <div className="chip"><span style={{color: 'var(--amber)', fontWeight: 900}}>{ar(i + 1)}</span>&nbsp; {c[0]}</div></div>
        </React.Fragment>)}
        {seg === 'intro' && s.lens && zoom && <div className="pin" style={{left: 1000, top: 520, zIndex: 17}}>
          <div style={{width: 600, height: 600, borderRadius: '50%', background: '#fff', border: '16px solid var(--amber)', boxShadow: '0 0 0 12px rgba(0,0,0,.25),0 30px 80px rgba(0,0,0,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', textAlign: 'center'}}>
            <svg width={220} height={220} viewBox="-80 -80 160 160" dangerouslySetInnerHTML={{__html: hazard(0, 0, 1.05)}} />
            <div style={{fontSize: 44, fontWeight: 900, marginTop: 10}}>مادة أكّالة</div>
            <div style={{fontSize: 30, fontWeight: 700, color: '#c0392b'}}>تحذير: تجنّبي اللمس المباشر</div>
            <div style={{fontSize: 24, color: '#567'}}>(ملصق افتراضي)</div></div></div>}

        {/* wrong-choice consequence */}
        {seg === 'wrong' && <>
          <AbsoluteFill style={{zIndex: 18, boxShadow: `inset 0 0 ${V(t, [[0, 0], [0.3, 260], [1.2, 120]])}px rgba(226,88,76,.75)`}} />
          <div className="center" style={{top: 150, zIndex: 22, ...K(t, [[0.3, {o: 0, y: -30}], [0.7, {o: 1, y: 0}]])}}>
            <div style={{display: 'inline-block', maxWidth: 1500, background: 'rgba(10,37,48,.92)', padding: '22px 50px', borderRadius: 24, border: '3px solid var(--amber)'}}>
              <div style={{fontSize: 54, fontWeight: 900}} className="amber">لنرَ ما سيحدث…</div>
              <div style={{fontSize: 36, fontWeight: 700, marginTop: 6}}>{(CONSEQUENCES[si] as any)[choice]}</div></div></div>
          <div className="center" style={{top: 800, zIndex: 22, ...K(t, fadeUp(2.2, 0.5, 30))}}>
            <div style={{display: 'inline-block', background: '#fff', color: 'var(--ink)', padding: '18px 44px', borderRadius: 20, fontSize: 36, fontWeight: 700, borderInlineStart: '12px solid var(--amber)'}}>{CONSEQUENCES[si].hint}</div></div>
        </>}

        {/* right choice: feedback, then the page returns to the notebook */}
        {seg === 'right' && <>
          {hasFootage(`st${s.n}_right`) ? <Footage k={`st${s.n}_right`} from={0} dur={RIGHT_P + 0.6} />
            : <div className="dim" style={K(t, [[0, {o: 0.6}], [1.2, {o: 0.8}]])} />}
          <div className="fb" style={K(t, [[0, {o: 0, s: 0.7}], [0.4, {o: 1, s: 1}, back], [RIGHT_P - 0.3, {o: 1}], [RIGHT_P, {o: 0}]])}><div className="fbin">قرار موفّق!</div><div className="fbsub" style={{textShadow: '0 2px 10px rgba(0,0,0,.9)'}}>{s.why}</div></div>
          <PageRestore si={si} t={t} P={RIGHT_P} />
        </>}

        <TopBar si={si} ph={ph} count={count + (seg === 'right' && t > RIGHT_P + 3.5 ? 1 : 0)} style={seg === 'intro' ? K(t, [[3.0, {o: 0, y: -60}], [3.5, {o: 1, y: 0}]]) : undefined} />

        {/* title card */}
        {seg === 'intro' && <AbsoluteFill style={{zIndex: 60, background: 'radial-gradient(ellipse at 50% 45%,#134854,#0a2530 60%,#06171e)', ...K(t, [[2.6, {o: 1}], [3.2, {o: 0}]])}}>
          <div className="center" style={{top: 120, fontSize: 420, fontWeight: 900, lineHeight: 1, color: 'rgba(31,165,149,.28)', ...K(t, [[0, {s: 0.7, o: 0}], [1, {s: 1, o: 1}, easeOut], [3.2, {s: 1.08}]])}}>{ar(s.n)}</div>
          <div className="center h3 mint" style={{top: 560, ...K(t, fadeUp(0.4))}}>المحطة {s.ord}</div>
          <div className="center h1" style={{top: 620, fontSize: 120, ...K(t, [[0.6, {o: 0, s: 1.2, b: 10}], [1.2, {o: 1, s: 1, b: 0}, easeOut]])}}>{s.name}</div>
          <div className="center h3 amber" style={{top: 800, ...K(t, [[1.2, {cl: 0}], [2.1, {cl: 100}, lin]])}}>اكتشاف {s.law}</div>
        </AbsoluteFill>}
      </AbsoluteFill>
    </Shell>
  );
};

/* ---------- Final reveal (two parts around the reflection question) + credits ---------- */
export const REVEAL_A = 7.6, REVEAL_B_FROM = 7.8, REVEAL_B = 13.4 - 7.8;
export const RevealASeg: React.FC = () => <Shell><Reveal interactive /></Shell>;
export const RevealBSeg: React.FC = () => <Shell><Reveal interactive from={REVEAL_B_FROM} /></Shell>;
export const OutroSeg: React.FC = () => <Shell><Outro /></Shell>;
