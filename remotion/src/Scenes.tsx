import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FILL, MISSION, ST, SUBTITLE, SUPERVISOR, TAGLINE, TEAM, TITLE, WHAT} from './data';
import {SALMA, SUP, counter, backdrop, flask, notebookIcon, person, tube} from './art';
import {Cues, Cursor, Footage, Layer, Svg, Words, hasFootage} from './components';
import {K, V, ar, back, easeOut, fadeUp, lin, pop, sceneFade} from './lib';

const useT = () => {const {fps} = useVideoConfig(); return useCurrentFrame() / fps;};

export const DUR = {intro: 8.5, mission: 12, hub: 7.5, notebook: 13, reveal: 16, outro: 8};

/* ---------- 1. Intro ---------- */
export const Intro: React.FC = () => {
  const t = useT();
  const dest = [[-640, -130, -30], [-480, 150, 22], [420, -160, 18], [650, 90, -26], [-790, 380, 12]];
  return (
    <AbsoluteFill className="stage" style={sceneFade(t, DUR.intro)}>
      <Cues cues={[[0.1, 'whoosh'], [1.1, 'swish'], [2.0, 'boom'], [2.8, 'pop'], [3.9, 'shimmer']]} />
      <Svg html={`<circle cx="960" cy="420" r="420" fill="rgba(31,165,149,.12)"/>`} />
      <Layer html={notebookIcon(0, 0, 0.9)} tx={960} ty={250} style={K(t, [[0, {o: 0, s: 0.5, r: -8}], [0.9, {o: 1, s: 1, r: 0}, back]])} />
      {dest.map((d, i) => {const t0 = 1.1 + i * 0.18, fl = Math.sin(t * 1.3 + i) * 10;
        return <Layer key={i} tx={960} ty={250} html={`<rect x="-55" y="-70" width="110" height="140" rx="8" fill="#fbf6ea" stroke="#127369" stroke-width="4"/><path d="M-35,-35h70M-35,-10h70M-35,15h50" stroke="rgba(18,115,105,.4)" stroke-width="6"/><text x="0" y="56" text-anchor="middle" font-size="30" font-weight="900" fill="#e2584c" font-family="Cairo">؟</text>`}
          style={K(t, [[t0, {o: 0, x: 0, y: 0, r: 0, s: 0.4}], [t0 + 0.2, {o: 1}], [t0 + 1.3, {o: 0.9, x: d[0], y: d[1] + fl, r: d[2], s: 0.9}, easeOut], [8.5, {o: 0.9, x: d[0] * 1.06, y: d[1] + fl, r: d[2] + 6, s: 0.9}]])} />;})}
      <div className="center h1" style={{top: 500, ...K(t, [[2.0, {o: 0, s: 1.15, b: 14}], [2.9, {o: 1, s: 1, b: 0}, easeOut]])}}>{TITLE}</div>
      <div className="center h2 amber" style={{top: 680, ...K(t, [[2.8, {o: 0, y: 50}], [3.5, {o: 1, y: 0}, easeOut]])}}>{SUBTITLE}</div>
      <div className="center h3 mint" style={{top: 820, ...K(t, [[3.9, {o: 1, cl: 0}], [5.2, {o: 1, cl: 100}, lin]])}}>{TAGLINE}</div>
    </AbsoluteFill>
  );
};

/* ---------- 4. Mission ---------- */
export const Mission: React.FC<{interactive?: boolean}> = ({interactive}) => {
  const t = useT();
  const live = hasFootage('mission');
  return (
    <AbsoluteFill className="stage" style={interactive ? K(t, [[0, {o: 0}], [0.45, {o: 1}]]) : sceneFade(t, DUR.mission)}>
      <Cues cues={interactive ? [[1.3, 'pop'], [1.8, 'type'], [6.5, 'swish'], [6.7, 'swish']] : [[1.3, 'pop'], [1.8, 'type'], [6.5, 'swish'], [6.7, 'swish'], [8.6, 'pop'], [10.6, 'click'], [11.4, 'whoosh']]} />
      {live ? <Footage k="mission" /> : <>
        <Svg html={backdrop('ms', {shelf: true}) + counter('ms', 1000, 560, 800)} />
        <Layer html={person({...SUP, armR: -28, hand: '<rect x="96" y="-210" width="70" height="90" rx="8" fill="#f4ab3c" transform="rotate(10 120 -170)"/>'})} tx={420} ty={760} cls="p" style={K(t, [[0, {x: -500}], [1.4, {x: 0}, easeOut]])} />
        <Layer html={notebookIcon(0, 0, 0.55)} tx={1400} ty={540} style={K(t, [[6.0, {r: 0}], [6.2, {r: -6}], [6.4, {r: 6}], [6.6, {r: 0}]])} />
        {[0, 1, 2, 3, 4].map((i) => {const t0 = 6.5 + i * 0.2, dx = [-520, -260, 120, 380, 560][i], dy = [-420, -560, -600, -480, -300][i];
          return <Layer key={i} tx={1400} ty={540} html={`<rect x="-38" y="-48" width="76" height="96" rx="6" fill="#fbf6ea" stroke="#127369" stroke-width="4"/><path d="M-24,-20h48M-24,0h48M-24,20h30" stroke="rgba(18,115,105,.4)" stroke-width="5"/>`}
            style={K(t, [[t0, {o: 0, x: 0, y: 0, r: 0}], [t0 + 0.1, {o: 1}], [t0 + 1.6, {o: 0, x: dx, y: dy, r: (i % 2 ? 1 : -1) * 220}, easeOut]])} />;})}
      </>}
      <div className="abs card" style={{left: live ? 120 : 640, top: live ? 500 : 150, width: live ? 1680 : 1080, padding: '44px 56px', borderRadius: 36, ...K(t, [[1.3, {o: 0, s: 0.85}], [1.8, {o: 1, s: 1}, back]])}}>
        <div style={{fontWeight: 900, fontSize: 30, color: 'var(--teal)'}}>المشرفة</div>
        <div style={{fontSize: 44, fontWeight: 700, lineHeight: 1.6}}><Words text={MISSION} t={t} t0={1.8} t1={5.4} /></div>
      </div>
      {!interactive && <>
        <div className="center" style={{top: 900, ...K(t, pop(8.6))}}><span className="btn" style={{display: 'inline-block', transform: `scale(${t > 8.6 ? 1 + 0.04 * Math.sin((t - 8.6) * 6) : 1})`}}>ابدئي التحقيق</span></div>
        <Cursor t={t} path={[[9.2, 1300, 1080], [10.4, 960, 930]]} clicks={[10.6]} />
      </>}
    </AbsoluteFill>
  );
};

/* ---------- 5. Hub ---------- */
export const Hub: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill className="stage" style={sceneFade(t, DUR.hub)}>
      <Cues cues={[[1.1, 'pop'], [1.3, 'pop'], [1.5, 'pop'], [1.7, 'pop'], [1.9, 'pop'], [3.0, 'pop'], [6.4, 'click'], [7.0, 'whoosh']]} />
      <div className="center h2" style={{top: 70, fontSize: 62, ...K(t, fadeUp(0.2))}}>دفتر قوانين السلامة</div>
      <div className="abs" style={{left: 260, top: 200, width: 1400, height: 640, borderRadius: 30, background: 'var(--paper)', boxShadow: '0 30px 80px rgba(0,0,0,.5)', color: 'var(--ink)', ...K(t, [[0.2, {o: 0, y: 60, s: 0.92}], [1.0, {o: 1, y: 0, s: 1}, easeOut]])}}>
        <div className="abs" style={{left: 698, top: 0, bottom: 0, width: 4, background: 'rgba(18,115,105,.35)'}} />
        {ST.map((s, i) => {const col = i < 3 ? 0 : 1, row = i < 3 ? i : i - 3, x = col === 0 ? 760 : 80, y = 50 + row * 190, hot = i === 0 && t > 5.6;
          return <div key={i} className="abs" style={{left: x, top: y, width: 560, height: 160, border: `4px dashed ${hot ? '#f4ab3c' : '#b7cfc9'}`, background: hot ? 'rgba(244,171,60,.12)' : 'transparent', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px', ...K(t, pop(1.1 + i * 0.2, 0.45))}}>
            <div style={{width: 90, height: 90, borderRadius: '50%', background: '#e3f1ed', color: 'var(--teal)', fontSize: 48, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ar(s.n)}</div>
            <div><div style={{fontSize: 38, fontWeight: 900}}>{s.name}</div><div style={{fontSize: 26, fontWeight: 700, color: 'var(--red)'}}>صفحة مفقودة…</div></div></div>;})}
        <div className="abs" style={{left: 80, top: 440, width: 560, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, color: 'var(--teal)', ...K(t, fadeUp(2.3))}}>الصفحات المستعادة ٠ / ٥</div>
      </div>
      <div className="center" style={{top: 900, ...K(t, pop(3.0))}}><span className="pill" style={{fontSize: 38}}>ابدئي بأي صفحة</span></div>
      <Cursor t={t} path={[[4.2, 500, 1000], [5.6, 1420, 330]]} clicks={[6.4]} />
    </AbsoluteFill>
  );
};

/* ---------- 12. My notebook ---------- */
export const Notebook: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill className="stage" style={sceneFade(t, DUR.notebook)}>
      <Cues cues={[[1.4, 'swish'], ...[0, 1, 2, 3, 4].flatMap((i) => [[2.2 + i * 1.9, 'pop'], [2.7 + i * 1.9, 'ding']] as Array<[number, string]>)]} />
      <div className="center h2" style={{top: 50, fontSize: 62, ...K(t, fadeUp(0.2))}}>دفتري</div>
      <div className="center h3 mint" style={{top: 140, fontSize: 34, ...K(t, fadeUp(0.5))}}>أكملي القوانين الخمسة بكلماتكِ</div>
      <div className="page" style={{left: 260, top: 220, width: 1400, height: 790, padding: '60px 110px', ...K(t, [[0.4, {o: 0, y: 60}], [1.1, {o: 1, y: 0}, easeOut]])}}>
        {FILL.map((f, i) => {const t0 = 1.4 + i * 1.9, ok = t > t0 + 1.2;
          return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, height: 130, fontSize: 46, fontWeight: 700, ...K(t, fadeUp(t0, 0.5, 20))}}>
            <span style={{width: 56, height: 56, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, flex: 'none'}}>{ar(i + 1)}</span>
            <span>{f[0]}</span>
            <span style={{position: 'relative', display: 'inline-block', minWidth: f[1].length * 28 + 60, borderBottom: `5px ${ok ? 'solid #1fa595' : 'dashed #9fb6b1'}`, textAlign: 'center', height: 72}}>
              <span style={{display: 'inline-block', color: 'var(--teal)', fontWeight: 900, ...K(t, [[t0 + 0.8, {o: 0, y: -90, s: 1.3}], [t0 + 1.2, {o: 1, y: 0, s: 1}, back]])}}>{f[1]}</span></span>
            <span>{f[2]}</span>
            <span style={{marginInlineStart: 'auto', width: 60, height: 60, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 36, ...K(t, pop(t0 + 1.3, 0.35))}}>✓</span>
          </div>;})}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 13. Final reveal ---------- */
/** `from` offsets local time (to play only part of the scene); `interactive` hides the reflection text and the finish button (the app shows them as real controls). */
export const Reveal: React.FC<{from?: number; interactive?: boolean}> = ({from = 0, interactive}) => {
  const t = useT() + from;
  const live = hasFootage('ending');
  return (
    <AbsoluteFill className="stage" style={interactive ? {} : sceneFade(t, DUR.reveal)}>
      <Cues cues={([[0.2, 'whoosh'], [1.2, 'pop'], [1.5, 'pop'], [1.8, 'pop'], [2.1, 'pop'], [2.4, 'pop'], [3.4, 'tick'], [4.8, 'boom'], [7.8, 'whoosh'], [9.0, 'shimmer'], [12.2, 'success'], [13.6, 'pop']] as Array<[number, string]>).map(([a, ty]) => [a - from, ty] as [number, string]).filter(([a]) => a >= 0)} />
      <AbsoluteFill style={K(t, [[7.6, {o: 1}], [8.2, {o: 0}]])}>
        <div className="center h2" style={{top: 70, fontSize: 64, ...K(t, fadeUp(0.2))}}>الكشف الختامي</div>
        <div className="center h3 mint" style={{top: 170, ...K(t, fadeUp(0.7))}}>من وراء المخالفات الخمس؟</div>
        {WHAT.map((w, i) => <div key={i} className="abs" style={{left: 1530 - i * 340, top: 300, width: 300, ...K(t, [[1.2 + i * 0.3, {o: 0, y: 60}], [1.7 + i * 0.3, {o: 1, y: 0}, back]])}}>
          <div className="card" style={{padding: 16, textAlign: 'center', overflow: 'hidden'}}>
            <svg width={268} height={200} viewBox="0 0 268 200" style={{background: '#e3efeb', borderRadius: 16, filter: 'sepia(.5)'}} dangerouslySetInnerHTML={{__html: `<g transform="translate(134,200) scale(.4)">${person({...SALMA, coat: i !== 0, open: i === 0})}</g>`}} />
            <div style={{fontSize: 28, fontWeight: 900, marginTop: 10}}>{w}</div>
            <div style={{marginTop: 8, display: 'inline-block', padding: '4px 18px', borderRadius: 999, background: 'var(--red)', color: '#fff', fontWeight: 900, fontSize: 24, ...K(t, pop(3.4 + i * 0.15, 0.35))}}>مستعجلة</div></div></div>)}
        <div className="center" style={{top: 665, ...K(t, [[4.8, {o: 0, s: 2.4}], [5.2, {o: 1, s: 1}, easeOut]])}}><div style={{display: 'inline-block', padding: '20px 70px', border: '8px solid var(--amber)', borderRadius: 30, transform: 'rotate(-3deg)'}}><span style={{fontSize: 100, fontWeight: 900}} className="amber">الاستعجال</span></div></div>
        <div className="center h3" style={{top: 925, ...K(t, fadeUp(5.8))}}>السبب هو الاستعجال… لا الأشخاص</div>
      </AbsoluteFill>
      <AbsoluteFill style={K(t, [[7.8, {o: 0, s: 1.06}], [8.6, {o: 1, s: 1}, easeOut]])}>
        {live ? <Footage k="ending" from={7.8 - from} style={{transform: 'scaleX(-1)'}} /> : <>
          <Svg html={backdrop('rv', {}) + counter('rv', 80, 560, 900) + flask(300, 560, '#5fc3a8', 0.8) + tube(420, 560, '#f4ab3c') + tube(460, 560, '#6aa6e8')} />
          <Layer html={person(SUP)} tx={1330} ty={780} cls="p" />
          <Layer html={person({...SALMA, goggles: true})} tx={1620} ty={790} cls="p" style={K(t, [[8.6, {x: 500}], [10, {x: 0}, easeOut]])} />
        </>}
        <div className="abs" style={{inset: 0, background: 'linear-gradient(270deg,rgba(6,23,30,0) 30%,rgba(6,23,30,.9) 52%)'}} />
        <div className="abs" style={{left: 110, width: 900, top: 200, textAlign: 'center', ...K(t, fadeUp(9.0, 0.8)), ...(interactive ? {display: 'none'} : {})}}>
          <div className="h3 mint" style={{fontSize: 36}}>سؤال للتأمل</div>
          <div className="h2" style={{fontSize: 76, marginTop: 10}}>ماذا كنتِ ستفعلين<br />في مكان سلمى؟</div></div>
        <div className="abs" style={{left: 110, width: 900, top: 600, textAlign: 'center', ...K(t, pop(12.2, 0.6))}}>
          <div style={{display: 'inline-block', padding: '18px 40px', borderRadius: 24, background: 'var(--green)', fontWeight: 900, fontSize: 38, whiteSpace: 'nowrap'}}>✓ المختبر جاهز لاستقبال الدفعة الجديدة</div>
          <div className="mint" style={{fontSize: 36, fontWeight: 700, marginTop: 18}}>الصفحات المستعادة ٥ / ٥</div></div>
        {!interactive && <div className="abs" style={{left: 110, width: 900, top: 860, textAlign: 'center', ...K(t, pop(13.6, 0.5))}}><span className="btn">إنهاء</span></div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 14. Outro ---------- */
export const Outro: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill className="stage" style={sceneFade(t, DUR.outro)}>
      <Cues cues={[[0, 'shimmer'], [2.8, 'chime']]} />
      <Layer html={notebookIcon(0, 0, 0.85)} tx={960} ty={250} style={K(t, [[0, {o: 0, s: 0.6}], [0.8, {o: 1, s: 1}, back], [8, {s: 1.05}]])} />
      <div className="center h1" style={{top: 420, fontSize: 120, ...K(t, fadeUp(0.5))}}>{TITLE}</div>
      <div className="center h2 amber" style={{top: 575, fontSize: 64, ...K(t, fadeUp(0.9))}}>{SUBTITLE}</div>
      <div className="center h3" style={{top: 720, fontSize: 36, color: '#d7ebe6', ...K(t, fadeUp(1.6))}}>{TEAM.join(' · ')}</div>
      <div className="center h3 mint" style={{top: 790, fontSize: 32, ...K(t, fadeUp(2.0))}}>بإشراف {SUPERVISOR}</div>
      <div className="center" style={{top: 900, ...K(t, pop(2.8))}}><span className="pill">سلامتكِ تبدأ بقرار</span></div>
    </AbsoluteFill>
  );
};
