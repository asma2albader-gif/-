// Interactive version of «لغز المختبر»: Remotion <Player> plays short video segments,
// and the app stops at every decision so the student chooses for herself.
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player, PlayerRef} from '@remotion/player';
import {CSS, asset} from '../src/components';
import {CONSEQUENCES, FILL, FILL_OPTIONS, ST, SUPERVISOR, TEAM} from '../src/data';
import {ar} from '../src/lib';
import {FPS, OPENING_DUR, OpeningSeg, OutroSeg, REVEAL_A, REVEAL_B, RevealASeg, RevealBSeg, StationSeg, stationSegDur} from '../src/Segments';
import {DUR} from '../src/Scenes';

/* ---------------- sounds for clicks (the segments carry their own) ---------------- */
const sfx = (name: string, vol = 0.7) => {try {const a = new Audio(asset(`audio/sfx/${name}.wav`)); a.volume = vol; a.play().catch(() => {});} catch {}};

/* ---------------- state machine ---------------- */
type Screen =
  | {k: 'start'} | {k: 'opening'} | {k: 'begin'} | {k: 'hub'}
  | {k: 'st'; si: number; step: 'intro' | 'clues' | 'rewind' | 'choice' | 'wrong' | 'wrongDone' | 'right'; choice?: number}
  | {k: 'notebook'} | {k: 'revealA'} | {k: 'reflect'} | {k: 'revealB'} | {k: 'finish'} | {k: 'outro'} | {k: 'end'};

/** Which video segment is on screen, and whether it plays or sits paused on its last frame. */
function segmentFor(sc: Screen, done: number[], found: number[], zoom: boolean) {
  const frames = (s: number) => Math.round(s * FPS);
  const still = (x: any) => ({...x, autoPlay: false});
  switch (sc.k) {
    case 'start': return null;
    case 'opening': return {id: 'opening', component: OpeningSeg, dur: frames(OPENING_DUR), props: {}, autoPlay: true};
    case 'begin': return still({id: 'opening', component: OpeningSeg, dur: frames(OPENING_DUR), props: {}});
    case 'hub': case 'notebook': return null;
    case 'st': {
      const seg = sc.step === 'clues' ? 'intro' : sc.step === 'choice' ? 'rewind' : sc.step === 'wrongDone' ? 'wrong' : sc.step;
      const props = {si: sc.si, seg, found, zoom, choice: sc.choice ?? 0, count: done.length};
      const auto = sc.step === 'intro' || sc.step === 'rewind' || sc.step === 'wrong' || sc.step === 'right';
      return {id: `st${sc.si}-${seg}-${sc.choice ?? ''}`, component: StationSeg, dur: frames(stationSegDur(sc.si, seg as any)), props, autoPlay: auto};
    }
    case 'revealA': return {id: 'revealA', component: RevealASeg, dur: frames(REVEAL_A), props: {}, autoPlay: true};
    case 'reflect': return still({id: 'revealA', component: RevealASeg, dur: frames(REVEAL_A), props: {}});
    case 'revealB': return {id: 'revealB', component: RevealBSeg, dur: frames(REVEAL_B), props: {}, autoPlay: true};
    case 'finish': return still({id: 'revealB', component: RevealBSeg, dur: frames(REVEAL_B), props: {}});
    case 'outro': return {id: 'outro', component: OutroSeg, dur: frames(DUR.outro - 0.5), props: {}, autoPlay: true};
    case 'end': return still({id: 'outro', component: OutroSeg, dur: frames(DUR.outro - 0.5), props: {}});
  }
}

/* ---------------- 1920x1080 stage scaled to the window ---------------- */
const useScale = (ref: React.RefObject<HTMLDivElement>) => {
  const [s, setS] = useState(0.5);
  useLayoutEffect(() => {
    const f = () => ref.current && setS(ref.current.clientWidth / 1920);
    f(); const ro = new ResizeObserver(f); if (ref.current) ro.observe(ref.current); return () => ro.disconnect();
  }, [ref]);
  return s;
};

const App: React.FC = () => {
  const [sc, setSc] = useState<Screen>({k: 'start'});
  const [done, setDone] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [zoom, setZoom] = useState(false);
  const [missed, setMissed] = useState<number | null>(null);
  const [fills, setFills] = useState<(string | null)[]>(FILL.map(() => null));
  const [shake, setShake] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const music = useRef<HTMLAudioElement | null>(null);
  const player = useRef<PlayerRef>(null);
  const box = useRef<HTMLDivElement>(null);
  const scale = useScale(box);
  const seg = segmentFor(sc, done, found, zoom);

  // what happens when a playing segment reaches its end
  const onEnded = () => {
    setSc((cur) => {
      switch (cur.k) {
        case 'opening': return {k: 'begin'};
        case 'st':
          if (cur.step === 'intro') return {...cur, step: 'clues'};
          if (cur.step === 'rewind') return {...cur, step: 'choice'};
          if (cur.step === 'wrong') return {...cur, step: 'wrongDone'};
          if (cur.step === 'right') return {k: 'hub'};
          return cur;
        case 'revealA': return {k: 'reflect'};
        case 'revealB': return {k: 'finish'};
        case 'outro': return {k: 'end'};
        default: return cur;
      }
    });
  };
  useEffect(() => {
    const p = player.current; if (!p) return;
    p.addEventListener('ended', onEnded);
    if (seg && !seg.autoPlay) p.seekTo(seg.dur - 1);
    return () => p.removeEventListener('ended', onEnded);
  }, [seg?.id, seg?.autoPlay]);
  useEffect(() => {if (sc.k === 'st' && sc.step === 'right') setDone((d) => (d.includes(sc.si) ? d : [...d, sc.si]));}, [sc]);

  const start = () => {
    sfx('click');
    if (!music.current) {music.current = new Audio(asset('audio/music.mp3')); music.current.loop = true; music.current.volume = 0.25;}
    music.current.currentTime = 0; music.current.play().catch(() => {});
    setDone([]); setFills(FILL.map(() => null)); setAnswer('');
    setSc({k: 'opening'});
  };
  const openStation = (si: number) => {sfx('click'); setFound([]); setZoom(false); setMissed(null); setSc({k: 'st', si, step: 'intro'});};
  const clickClue = (i: number) => {
    if (sc.k !== 'st') return;
    if (!found.includes(i)) {sfx('pop'); setFound([...found, i]);}
    if (ST[sc.si].lens && i === 2) {sfx('zoom'); setZoom(true);}
  };
  const choose = (i: number) => {
    if (sc.k !== 'st') return;
    sfx('click');
    if (i === 1) setSc({...sc, step: 'right'});
    else {setMissed(i); setSc({...sc, step: 'wrong', choice: i});}
  };
  const pickWord = (row: number, w: string) => {
    if (fills[row]) return;
    if (w === FILL[row][1]) {sfx('ding'); const f = [...fills]; f[row] = w; setFills(f);}
    else {sfx('wrong', 0.5); setShake(`${row}:${w}`); setTimeout(() => setShake(null), 450);}
  };

  const st = sc.k === 'st' ? ST[sc.si] : null;
  const allDone = done.length === ST.length;

  return (
    <div className="wrap" dir="rtl" lang="ar">
      <style>{CSS + APP_CSS}</style>
      <div className="box" ref={box}>
        {/* the Player's own layout must stay LTR (an RTL parent shifts its scaled canvas); scenes set dir="rtl" themselves */}
        {seg && <div dir="ltr" className="playerbox"><Player key={seg.id + (seg.autoPlay ? '-play' : '-still')} ref={player} component={seg.component as any} inputProps={seg.props}
          durationInFrames={seg.dur} compositionWidth={1920} compositionHeight={1080} fps={FPS}
          autoPlay={seg.autoPlay} initialFrame={seg.autoPlay ? 0 : seg.dur - 1} controls={false} clickToPlay={false}
          numberOfSharedAudioTags={12} acknowledgeRemotionLicense style={{width: '100%', height: '100%'}} /></div>}

        {/* every interactive control lives in this 1920x1080 layer, scaled with the video */}
        <div className="ui stage" style={{transform: `scale(${scale})`}}>

          {sc.k === 'start' && <div className="full bgdark center-col">
            <div className="h1" style={{fontSize: 140}}>لغز المختبر</div>
            <div className="h2 amber" style={{fontSize: 80}}>الصفحات المفقودة</div>
            <div className="h3 mint" style={{margin: '20px 0 60px'}}>اكتشفي القانون … أعيدي الصفحة</div>
            <button className="btn big" onClick={start}>▶ ابدئي</button>
            <div className="credits">{TEAM.join(' · ')} — بإشراف {SUPERVISOR}</div>
          </div>}

          {sc.k === 'begin' && <div className="bottom"><button className="btn big pulse" onClick={() => {sfx('click'); setSc({k: 'hub'});}}>ابدئي التحقيق</button></div>}

          {sc.k === 'hub' && <div className="full bgdark">
            <div className="center h2" style={{top: 60, fontSize: 62}}>دفتر قوانين السلامة</div>
            <div className="nb">
              <div className="spine" />
              {ST.map((s, i) => {const col = i < 3 ? 0 : 1, row = i < 3 ? i : i - 3, ok = done.includes(i);
                return <button key={i} className={'slotbtn' + (ok ? ' ok' : '')} disabled={ok} onClick={() => openStation(i)}
                  style={{left: col === 0 ? 760 : 80, top: 50 + row * 190}}>
                  <span className="num">{ok ? '✓' : ar(s.n)}</span>
                  <span><b>{s.name}</b><small>{ok ? s.law : 'صفحة مفقودة… انقري للتحقيق'}</small></span>
                </button>;})}
              <div className="count">الصفحات المستعادة {ar(done.length)} / ٥</div>
            </div>
            <div className="center" style={{top: 900}}>
              {allDone ? <button className="btn big pulse" onClick={() => {sfx('click'); setSc({k: 'notebook'});}}>افتحي «دفتري»</button>
                : <span className="pill" style={{fontSize: 36}}>{done.length ? 'اختاري الصفحة التالية' : 'ابدئي بأي صفحة'}</span>}
            </div>
          </div>}

          {sc.k === 'st' && sc.step === 'clues' && st && <>
            <div className="hint-bar">انقري على ما يبدو غير سليم في المشهد ({ar(found.length)} / ٣)</div>
            {st.clues.map((c, i) => <button key={i} className="hot" aria-label={c[0]} style={{left: c[1] - 190, top: c[2] - 165}} onClick={() => clickClue(i)} />)}
            {zoom && <button className="closezoom" onClick={() => {sfx('click'); setZoom(false);}}>✕ إغلاق العدسة</button>}
            {found.length === st.clues.length && !zoom && <div className="bottom"><button className="btn big pulse" onClick={() => {sfx('click'); setSc({...sc, step: 'rewind'});}}>◀◀ أعيدي الشريط: ماذا حدث؟</button></div>}
          </>}

          {sc.k === 'st' && sc.step === 'choice' && st && <div className="full" style={{background: 'rgba(6,23,30,.8)'}}>
            <div className="center h2" style={{top: 170, fontSize: 64}}>ماذا تفعلين؟</div>
            {st.opts.map((o, i) => <button key={i} className={'optbtn' + (missed === i ? ' missed' : '')} style={{left: [1270, 700, 130][i]}} onClick={() => choose(i)}>
              <span className="let">{['أ', 'ب', 'ج'][i]}</span>{o}</button>)}
          </div>}

          {sc.k === 'st' && sc.step === 'wrongDone' && <div className="bottom" style={{top: 940}}>
            <button className="btn big" onClick={() => {sfx('click'); setSc({...(sc as any), step: 'choice'});}}>أعيدي المحاولة</button></div>}

          {sc.k === 'notebook' && <div className="full bgdark">
            <div className="center h2" style={{top: 40, fontSize: 62}}>دفتري</div>
            <div className="center h3 mint" style={{top: 130, fontSize: 34}}>أكملي القوانين الخمسة باختيار الكلمة المناسبة</div>
            <div className="paper">
              {FILL.map((f, i) => <div key={i} className="row">
                <span className="n">{ar(i + 1)}</span>
                <span className="sent">{f[0]} <span className={'blank' + (fills[i] ? ' filled' : '')}>{fills[i] ?? '……'}</span> {f[2]}</span>
                <span className="opts">{fills[i] ? <span className="tick">✓</span> : FILL_OPTIONS[i].map((w) =>
                  <button key={w} className={'word' + (shake === `${i}:${w}` ? ' shake' : '')} onClick={() => pickWord(i, w)}>{w}</button>)}</span>
              </div>)}
            </div>
            {fills.every(Boolean) && <div className="center" style={{top: 960}}><button className="btn pulse" onClick={() => {sfx('click'); setSc({k: 'revealA'});}}>الكشف الختامي</button></div>}
          </div>}

          {sc.k === 'reflect' && <div className="full" style={{background: 'rgba(6,23,30,.85)'}}>
            <div className="reflect card">
              <div className="mint-d">سؤال للتأمل</div>
              <div className="q">ماذا كنتِ ستفعلين في مكان سلمى؟</div>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="اكتبي إجابتكِ هنا…" />
              <button className="btn" onClick={() => {sfx('click'); setSc({k: 'revealB'});}}>متابعة</button>
            </div></div>}

          {sc.k === 'finish' && <div className="abs" style={{left: 110, width: 900, top: 860, textAlign: 'center'}}>
            <button className="btn big" onClick={() => {sfx('click'); setSc({k: 'outro'});}}>إنهاء</button></div>}

          {sc.k === 'end' && <div className="bottom" style={{top: 985}}><button className="btn" style={{fontSize: 30, padding: '10px 40px'}} onClick={start}>↺ العبي من جديد</button></div>}
        </div>
      </div>
    </div>
  );
};

const MAG_CURSOR = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="20" cy="20" r="13" fill="rgba(191,233,223,.35)" stroke="#f4ab3c" stroke-width="5"/><path d="M30 30 L44 44" stroke="#0a2530" stroke-width="8" stroke-linecap="round"/><path d="M30 30 L44 44" stroke="#f4ab3c" stroke-width="5" stroke-linecap="round"/></svg>')}") 20 20, pointer`;

const APP_CSS = `
html,body,#root{margin:0;height:100%;background:#06171e;overflow:hidden}
.wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-family:Cairo,Tajawal,sans-serif}
.box{position:relative;width:min(100vw,calc(100vh*16/9));aspect-ratio:16/9;background:radial-gradient(ellipse at 50% 40%,#123f4a,#0a2530 55%,#06171e);overflow:hidden}
.ui{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;pointer-events:none;color:#fff}
.ui button,.ui textarea,.ui .full{pointer-events:auto}
.full{position:absolute;inset:0}
.playerbox{position:absolute;inset:0;direction:ltr}
.bgdark{background:radial-gradient(ellipse at 50% 40%,#123f4a 0%,#0a2530 55%,#06171e 100%)}
.center-col{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.credits{position:absolute;bottom:50px;font-size:28px;color:#bfe9df;opacity:.8}
button{font-family:inherit;cursor:pointer;border:0}
.btn.big{font-size:48px;padding:22px 70px}
.btn:hover{filter:brightness(1.07)} .btn:active{transform:translateY(4px);box-shadow:0 6px 0 #b9761d}
.pulse{animation:pulse 1.4s ease-in-out infinite} @keyframes pulse{50%{transform:scale(1.05)}}
.bottom{position:absolute;left:0;right:0;top:880px;text-align:center}
.nb{position:absolute;left:260px;top:180px;width:1400px;height:640px;border-radius:30px;background:var(--paper);box-shadow:0 30px 80px rgba(0,0,0,.5);color:var(--ink)}
.nb .spine{position:absolute;left:698px;top:0;bottom:0;width:4px;background:rgba(18,115,105,.35)}
.slotbtn{position:absolute;width:560px;height:160px;border:4px dashed #b7cfc9;border-radius:20px;display:flex;align-items:center;gap:26px;padding:0 30px;background:transparent;color:var(--ink);text-align:right;transition:.2s}
.slotbtn:hover:not(:disabled){border-color:#f4ab3c;background:rgba(244,171,60,.12);transform:scale(1.03)}
.slotbtn .num{width:90px;height:90px;flex:none;border-radius:50%;background:#e3f1ed;color:var(--teal);font-size:48px;font-weight:900;display:flex;align-items:center;justify-content:center}
.slotbtn b{display:block;font-size:38px;font-weight:900} .slotbtn small{display:block;font-size:24px;font-weight:700;color:var(--red)}
.slotbtn.ok{border:4px solid var(--teal2);background:var(--teal);color:#fff;cursor:default} .slotbtn.ok .num{background:#fff;color:var(--teal)} .slotbtn.ok small{color:var(--mint)}
.nb .count{position:absolute;left:80px;top:440px;width:560px;height:160px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:var(--teal)}
.hint-bar{position:absolute;left:50%;top:116px;transform:translateX(-50%);white-space:nowrap;padding:10px 36px;border-radius:999px;background:rgba(10,37,48,.88);border:2px solid var(--amber);font-size:34px;font-weight:900;color:#fff}
.hot{position:absolute;width:380px;height:330px;border-radius:22px;background:transparent;cursor:${MAG_CURSOR}}
.hot:hover{box-shadow:0 0 0 4px rgba(244,171,60,.6) inset}
.closezoom{position:absolute;left:840px;top:840px;padding:12px 34px;border-radius:999px;background:#fff;color:var(--ink);font-size:30px;font-weight:900}
.optbtn{position:absolute;top:330px;width:520px;min-height:360px;padding:30px 34px;border-radius:30px;background:#fff;color:var(--ink);font-size:32px;font-weight:700;line-height:1.5;text-align:right;border:6px solid transparent;transition:.15s}
.optbtn:hover{border-color:var(--amber);transform:translateY(-8px)}
.optbtn .let{width:66px;height:66px;border-radius:50%;background:var(--ink2);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:36px;margin-bottom:14px}
.optbtn.missed{opacity:.55}
.paper{position:absolute;left:160px;top:210px;width:1600px;height:720px;background:var(--paper);color:var(--ink);border-radius:18px;padding:30px 60px;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.paper .row{display:flex;align-items:center;gap:20px;height:132px;border-bottom:2px solid rgba(18,115,105,.15)}
.paper .n{width:54px;height:54px;flex:none;border-radius:50%;background:var(--teal);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900}
.paper .sent{font-size:40px;font-weight:700;flex:1}
.blank{display:inline-block;min-width:170px;text-align:center;border-bottom:5px dashed #9fb6b1;color:#9fb6b1}
.blank.filled{border-bottom:5px solid var(--teal2);color:var(--teal);font-weight:900}
.paper .opts{display:flex;gap:12px;flex:none}
.word{padding:10px 24px;border-radius:999px;background:#e3f1ed;color:var(--teal);font-size:28px;font-weight:900;border:3px solid transparent}
.word:hover{border-color:var(--teal2)} .word.shake{background:var(--red);color:#fff;animation:shake .45s}
@keyframes shake{20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
.tick{width:60px;height:60px;border-radius:50%;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900}
.reflect{position:absolute;left:360px;top:180px;width:1200px;padding:50px 70px;text-align:center}
.reflect .mint-d{color:var(--teal);font-size:34px;font-weight:900} .reflect .q{font-size:64px;font-weight:900;margin:10px 0 30px}
.reflect textarea{width:100%;height:220px;border-radius:20px;border:3px solid #b7cfc9;padding:20px 26px;font-family:inherit;font-size:34px;resize:none;margin-bottom:30px;direction:rtl}
`;

createRoot(document.getElementById('root')!).render(<App />);
