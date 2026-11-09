// Interactive «لغز المختبر»: one real scene shows all five violations.
// The student spots a violation and taps it → the camera zooms in → its question → she answers
// → its page returns to the safety booklet → back to the same scene until all five are found
// → «دفتري» → the final reveal and reflection. Video segments play in Remotion's <Player>.
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player, PlayerRef} from '@remotion/player';
import {CSS, asset} from '../src/components';
import {FILL, FILL_OPTIONS, SUPERVISOR, TEAM} from '../src/data';
import {ar} from '../src/lib';
import {FPS, OPENING_DUR, OpeningSeg, OutroSeg, REVEAL_A, REVEAL_B, RevealASeg, RevealBSeg} from '../src/Segments';
import {DUR} from '../src/Scenes';
import {FoundMark, HuntBar, OPT_LEFT, VIOL, tabCenter, zoomTransform} from '../src/Hunt';

let MUTED = false;
const sfx = (name: string, vol = 0.7) => {if (MUTED) return; try {const a = new Audio(asset(`audio/sfx/${name}.wav`)); a.volume = vol; a.play().catch(() => {});} catch {}};

type Step = 'zoom' | 'question' | 'wrong' | 'right' | 'page' | 'fly';
type Screen =
  | {k: 'start'} | {k: 'opening'} | {k: 'begin'}
  | {k: 'hunt'; v: number | null; step?: Step; choice?: number}
  | {k: 'notebook'} | {k: 'revealA'} | {k: 'reflect'} | {k: 'revealB'} | {k: 'finish'} | {k: 'outro'} | {k: 'end'};

/** Video segment on screen (played, or held on its last frame). The hunt itself is plain HTML over a real frame. */
function segmentFor(sc: Screen) {
  const f = (s: number) => Math.round(s * FPS);
  const still = (x: any) => ({...x, autoPlay: false});
  switch (sc.k) {
    case 'opening': return {id: 'opening', component: OpeningSeg, dur: f(OPENING_DUR), autoPlay: true};
    case 'begin': return still({id: 'opening', component: OpeningSeg, dur: f(OPENING_DUR)});
    case 'revealA': return {id: 'revealA', component: RevealASeg, dur: f(REVEAL_A), autoPlay: true};
    case 'reflect': return still({id: 'revealA', component: RevealASeg, dur: f(REVEAL_A)});
    case 'revealB': return {id: 'revealB', component: RevealBSeg, dur: f(REVEAL_B), autoPlay: true};
    case 'finish': return still({id: 'revealB', component: RevealBSeg, dur: f(REVEAL_B)});
    case 'outro': return {id: 'outro', component: OutroSeg, dur: f(DUR.outro - 0.5), autoPlay: true};
    case 'end': return still({id: 'outro', component: OutroSeg, dur: f(DUR.outro - 0.5)});
    default: return null;
  }
}

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
  const [restored, setRestored] = useState<number[]>([]);
  const [missed, setMissed] = useState<number[]>([]);
  const [miss, setMiss] = useState<{x: number; y: number} | null>(null);
  const [fills, setFills] = useState<(string | null)[]>(FILL.map(() => null));
  const [shake, setShake] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [muted, setMuted] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const music = useRef<HTMLAudioElement | null>(null);
  const player = useRef<PlayerRef>(null);
  const box = useRef<HTMLDivElement>(null);
  const scale = useScale(box);
  const seg = segmentFor(sc);
  const timers = useRef<number[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    MUTED = muted;
    if (music.current) music.current.muted = muted;
    const p = player.current; if (p) (muted ? p.mute() : p.unmute());
  }, [muted, seg?.id]);
  const showHint = () => {
    const i = VIOL.findIndex((_, k) => !restored.includes(k));
    if (i < 0) return;
    sfx('ding', 0.5); setHintsUsed((h) => h + 1); setHint(VIOL[i].where);
    later(4500, () => setHint(null));
  };

  const onEnded = () => setSc((cur) => {
    switch (cur.k) {
      case 'opening': return {k: 'begin'};
      case 'revealA': return {k: 'reflect'};
      case 'revealB': return {k: 'finish'};
      case 'outro': return {k: 'end'};
      default: return cur;
    }
  });
  useEffect(() => {
    const p = player.current; if (!p) return;
    p.addEventListener('ended', onEnded);
    if (seg && !seg.autoPlay) p.seekTo(seg.dur - 1);
    return () => p.removeEventListener('ended', onEnded);
  }, [seg?.id, seg?.autoPlay]);

  const start = () => {
    sfx('click');
    if (!music.current) {music.current = new Audio(asset('audio/music.mp3')); music.current.loop = true; music.current.volume = 0.22;}
    music.current.currentTime = 0; music.current.play().catch(() => {});
    setRestored([]); setFills(FILL.map(() => null)); setAnswer(''); setHintsUsed(0); setFirstTry(0); setHint(null);
    setSc({k: 'opening'});
  };

  /* ---- the hunt ---- */
  const hunt = sc.k === 'hunt' ? sc : null;
  const v = hunt && hunt.v !== null ? VIOL[hunt.v] : null;
  const zoomed = !!(hunt && hunt.v !== null && hunt.step !== 'fly');
  const pick = (i: number) => {
    if (!hunt || hunt.v !== null || restored.includes(i)) return;
    sfx('pop'); sfx('zoom', 0.5); setMissed([]); setMiss(null);
    setSc({k: 'hunt', v: i, step: 'zoom'});
    later(850, () => {sfx('swish'); setSc({k: 'hunt', v: i, step: 'question'});});
  };
  const missClick = (e: React.MouseEvent) => {
    if (!hunt || hunt.v !== null) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMiss({x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale}); sfx('tick', 0.4);
    later(1300, () => setMiss(null));
  };
  const choose = (i: number) => {
    if (!hunt || hunt.v === null || !v) return;
    sfx('click');
    if (i !== v.correct) {sfx('wrong', 0.6); setMissed((m) => [...m, i]); setSc({...hunt, step: 'wrong', choice: i}); return;}
    const vi = hunt.v;
    if (missed.length === 0) setFirstTry((n) => n + 1);
    sfx('success'); setSc({k: 'hunt', v: vi, step: 'right'});
    later(1700, () => {sfx('page'); setSc({k: 'hunt', v: vi, step: 'page'});});
    later(5300, () => {sfx('swish'); setSc({k: 'hunt', v: vi, step: 'fly'});});
    later(6100, () => {sfx('chime'); setRestored((r) => [...r, vi]); setSc({k: 'hunt', v: null});});
  };
  const pickWord = (row: number, w: string) => {
    if (fills[row]) return;
    if (w === FILL[row][1]) {sfx('ding'); const f = [...fills]; f[row] = w; setFills(f);}
    else {sfx('wrong', 0.5); setShake(`${row}:${w}`); later(450, () => setShake(null));}
  };
  const allDone = restored.length === VIOL.length;

  return (
    <div className="wrap" dir="rtl" lang="ar">
      <style>{CSS + APP_CSS}</style>
      <div className="box" ref={box}>
        {seg && <div dir="ltr" className="playerbox"><Player key={seg.id + (seg.autoPlay ? '-play' : '-still')} ref={player} component={seg.component as any} inputProps={{}}
          durationInFrames={seg.dur} compositionWidth={1920} compositionHeight={1080} fps={FPS}
          autoPlay={seg.autoPlay} initialFrame={seg.autoPlay ? 0 : seg.dur - 1} controls={false} clickToPlay={false}
          numberOfSharedAudioTags={12} acknowledgeRemotionLicense style={{width: '100%', height: '100%'}} /></div>}

        <div className="ui stage" style={{transform: `scale(${scale})`}}>

          {sc.k === 'start' && <div className="full bgdark center-col">
            <div className="h1" style={{fontSize: 140}}>لغز المختبر</div>
            <div className="h2 amber" style={{fontSize: 80}}>الصفحات المفقودة</div>
            <div className="h3 mint" style={{margin: '20px 0 60px'}}>لاحظي المخالفة … وأعيدي الصفحة إلى كتيّب السلامة</div>
            <button className="btn big" onClick={start}>▶ ابدئي</button>
            <div className="howto">
              <div className="howto-t">كيف تلعبين؟</div>
              <ol>
                <li>شاهدي المختبر، ولاحظي ما يخالف تعليمات السلامة، ثم انقري عليه.</li>
                <li>أجيبي عن سؤال المخالفة؛ القرار الصحيح يعيد صفحة إلى كتيّب السلامة.</li>
                <li>اكتشفي المخالفات الخمس، ثم أكملي «دفتري» وسؤال التأمل.</li>
              </ol>
              <div className="howto-s">مدة التجربة ٥–١٠ دقائق تقريبًا · الصوت مفيد وغير ضروري · زر «تلميح» متاح إن احتجتِ</div>
            </div>
            <div className="credits">{TEAM.join(' · ')} — بإشراف {SUPERVISOR}</div>
          </div>}

          {sc.k === 'begin' && <div className="bottom"><button className="btn big pulse" onClick={() => {sfx('click'); setSc({k: 'hunt', v: null});}}>ابدئي التحقيق</button></div>}

          {/* ===== the violation hunt ===== */}
          {hunt && <div className="full scene" onClick={missClick}>
            <div className="zoomer" style={{transform: v && zoomed ? zoomTransform(v.focus, 1) : 'none'}}>
              <img src={asset('cards/scene_freeze.jpg')} width={1920} height={1080} alt="مشهد المختبر" draggable={false} />
              {VIOL.map((w, i) => restored.includes(i) && <FoundMark key={i} v={w} />)}
              {v && v.spots.map((s, k) => <div key={k} className="pin" style={{left: s.x, top: s.y, zIndex: 8}}><div className="ring" style={{width: s.r * 2, height: s.r * 2}} /></div>)}
              {hunt.v === null && VIOL.map((w, i) => !restored.includes(i) && w.spots.map((s, k) =>
                <button key={`${i}-${k}`} className="hspot" aria-label={`مخالفة ${ar(i + 1)}`} style={{left: s.x - s.r, top: s.y - s.r, width: s.r * 2, height: s.r * 2}}
                  onClick={(e) => {e.stopPropagation(); pick(i);}} />))}
            </div>
            {miss && <div className="pin" style={{left: miss.x, top: miss.y, zIndex: 30}}><div className="missnote">ليست مخالفة… ابحثي مرة أخرى</div></div>}
          </div>}
          {hunt && <HuntBar restored={restored} />}
          {hunt && hunt.v === null && !allDone && <div className="hint-bar">لاحظي المخالفات في المشهد وانقري عليها ({ar(restored.length)} / ٥)</div>}
          {hunt && hunt.v === null && !allDone && <button className="hintbtn" onClick={showHint}>💡 تلميح</button>}
          {hint && hunt && hunt.v === null && <div className="center" style={{top: 215, zIndex: 36}}><span className="hinttoast">{hint}</span></div>}
          {hunt && hunt.v === null && allDone && <div className="full" style={{background: 'rgba(6,23,30,.55)', zIndex: 35}}>
            <div className="center" style={{top: 380}}><div className="fbin" style={{fontSize: 56}}>اكتشفتِ المخالفات الخمس، واستعدتِ صفحات الكتيّب!</div></div>
            <div className="center" style={{top: 560}}><button className="btn big pulse" onClick={() => {sfx('click'); setSc({k: 'notebook'});}}>افتحي «دفتري»</button></div>
          </div>}

          {v && hunt && hunt.step !== 'fly' && <div className="center" style={{top: 130, zIndex: 21}}>
            <span className="chip" style={{fontSize: 36}}><span style={{color: 'var(--amber)', fontWeight: 900}}>مخالفة:</span>&nbsp; {v.label}</span></div>}

          {v && hunt && (hunt.step === 'question' || hunt.step === 'wrong' || hunt.step === 'right') && <div className="full" style={{background: 'linear-gradient(180deg,rgba(6,23,30,0) 30%,rgba(6,23,30,.92) 58%)', zIndex: 24}}>
            <div className="center h2" style={{top: 560, fontSize: 56}}>ماذا تفعلين؟</div>
            {v.opts.map((o, i) => {const good = hunt.step === 'right' && i === v.correct, bad = hunt.step === 'wrong' && hunt.choice === i;
              return <button key={i} className={'optbtn' + (missed.includes(i) && !bad ? ' missed' : '') + (good ? ' good' : '') + (bad ? ' bad' : '')}
                style={{left: OPT_LEFT[i], top: 660}} disabled={hunt.step !== 'question'} onClick={() => choose(i)}>
                <span className="let">{['أ', 'ب', 'ج'][i]}</span>{o}</button>;})}
          </div>}

          {v && hunt && hunt.step === 'wrong' && <div className="full" style={{zIndex: 30, background: 'rgba(226,88,76,.12)'}}>
            <div className="center" style={{top: 230}}>
              <div className="conscard">
                <div style={{fontSize: 50, fontWeight: 900, color: '#ffb3ab'}}>لنرَ ما سيحدث…</div>
                <div style={{fontSize: 36, fontWeight: 700, marginTop: 6}}>{v.cons[hunt.choice ?? -1]}</div>
                <div style={{fontSize: 32, fontWeight: 700, marginTop: 12, color: 'var(--amber)'}}>{v.hint}</div>
                <button className="btn" style={{marginTop: 26}} onClick={() => {sfx('click'); setSc({...hunt, step: 'question'});}}>أعيدي المحاولة</button>
              </div></div></div>}

          {v && hunt && hunt.step === 'right' && <div className="center" style={{top: 300, zIndex: 27}}>
            <div className="fbin">قرار موفّق!</div><div className="fbsub">{v.why}</div></div>}

          {v && hunt && (hunt.step === 'page' || hunt.step === 'fly') && <>
            <div className="full" style={{background: 'rgba(6,23,30,.85)', zIndex: 30, opacity: hunt.step === 'fly' ? 0 : 1, transition: 'opacity .6s'}} />
            <div className={'page apppage' + (hunt.step === 'fly' ? ' fly' : '')}
              style={{zIndex: 31, ...(hunt.step === 'fly' ? {transform: `translate(${tabCenter(v.n - 1).x - 960}px,${tabCenter(v.n - 1).y - 450}px) scale(.12)`, opacity: 0} : {})}}>
              <div className="num">كتيّب السلامة · الصفحة {ar(v.n)} ✓</div>
              <div className="lt">{v.title}</div>
              <div className="law">{v.text}</div>
            </div></>}

          {/* ===== دفتري ===== */}
          {sc.k === 'notebook' && <div className="full bgdark">
            <div className="center h2" style={{top: 40, fontSize: 62}}>دفتري</div>
            <div className="center h3 mint" style={{top: 130, fontSize: 34}}>أكملي تعليمات السلامة الخمس باختيار الكلمة المناسبة</div>
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
              <textarea id="reflection" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="اكتبي إجابتكِ هنا…" />
              <button className="btn" onClick={() => {sfx('click'); setSc({k: 'revealB'});}}>متابعة</button>
            </div></div>}

          {sc.k === 'finish' && <div className="result card">
            <div className="mint-d">نتيجتكِ</div>
            <div className="rrow"><span>المخالفات المكتشفة</span><b>{ar(restored.length)} / ٥</b></div>
            <div className="rrow"><span>قرارات صحيحة من المحاولة الأولى</span><b>{ar(firstTry)} / ٥</b></div>
            <div className="rrow"><span>التلميحات المستخدمة</span><b>{ar(hintsUsed)}</b></div>
            <div className="rmsg">{firstTry === 5 ? 'ممتاز! قراراتكِ كلها آمنة من المحاولة الأولى.' : firstTry >= 3 ? 'أحسنتِ! راجعي الصفحات التي احتاجت أكثر من محاولة.' : 'جيد! أعيدي التجربة لتصلي إلى القرار الآمن من المحاولة الأولى.'}</div>
          </div>}
          {sc.k === 'finish' && <div className="abs" style={{left: 110, width: 900, top: 860, textAlign: 'center'}}>
            <button className="btn big" onClick={() => {sfx('click'); setSc({k: 'outro'});}}>إنهاء</button></div>}

          {sc.k === 'end' && <div className="bottom" style={{top: 985}}><button className="btn" style={{fontSize: 30, padding: '10px 40px'}} onClick={start}>↺ العبي من جديد</button></div>}
          <button className="soundbtn" aria-pressed={muted} aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'} onClick={() => setMuted((m) => !m)}>{muted ? '🔇 الصوت متوقف' : '🔊 الصوت يعمل'}</button>
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
.playerbox{position:absolute;inset:0;direction:ltr}
.ui{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;pointer-events:none;color:#fff}
.ui button,.ui textarea,.ui .full{pointer-events:auto}
.full{position:absolute;inset:0}
.bgdark{background:radial-gradient(ellipse at 50% 40%,#123f4a 0%,#0a2530 55%,#06171e 100%)}
.center-col{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.credits{position:absolute;bottom:50px;font-size:28px;color:#bfe9df;opacity:.8}
button{font-family:inherit;cursor:pointer;border:0}
button:focus-visible{outline:4px solid #f4ab3c;outline-offset:4px}
.btn.big{font-size:48px;padding:22px 70px}
.btn:hover{filter:brightness(1.07)} .btn:active{transform:translateY(4px);box-shadow:0 6px 0 #b9761d}
.pulse{animation:pulse 1.4s ease-in-out infinite} @keyframes pulse{50%{transform:scale(1.05)}}
.bottom{position:absolute;left:0;right:0;top:880px;text-align:center}
.scene{overflow:hidden;cursor:${MAG_CURSOR}}
.zoomer{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;transition:transform .85s cubic-bezier(.65,0,.35,1)}
.zoomer img{display:block;width:1920px;height:1080px;user-select:none}
.hspot{position:absolute;border-radius:50%;background:transparent;cursor:${MAG_CURSOR};z-index:6}

.missnote{white-space:nowrap;background:rgba(10,37,48,.9);border:2px solid #bfe9df;color:#fff;padding:8px 22px;border-radius:999px;font-size:28px;font-weight:700;animation:fadeup 1.3s forwards}
@keyframes fadeup{0%{opacity:0;transform:translateY(10px)}15%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0}}
.howto{margin-top:46px;max-width:1100px;background:rgba(10,37,48,.85);border:2px solid rgba(191,233,223,.35);border-radius:24px;padding:22px 40px;text-align:right}
.howto-t{font-size:32px;font-weight:900;color:var(--amber);margin-bottom:6px}
.howto ol{margin:0;padding-inline-start:40px;font-size:28px;line-height:1.7}
.howto-s{font-size:22px;color:var(--mint);margin-top:8px}
.soundbtn{position:absolute;left:24px;bottom:20px;z-index:60;pointer-events:auto;padding:8px 22px;border-radius:999px;background:rgba(10,37,48,.85);color:#fff;border:2px solid rgba(191,233,223,.5);font-size:22px;font-weight:700}
.hintbtn{position:absolute;right:30px;bottom:30px;z-index:36;padding:12px 34px;border-radius:999px;background:#fff;color:var(--ink);font-size:30px;font-weight:900;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.hinttoast{display:inline-block;background:#fff;color:var(--ink);padding:16px 40px;border-radius:20px;font-size:34px;font-weight:700;border-inline-start:12px solid var(--amber);box-shadow:0 12px 40px rgba(0,0,0,.4)}
.ui .result{position:absolute;left:150px;top:150px;width:820px;padding:34px 50px;text-align:right}
.result .mint-d{color:var(--teal);font-size:36px;font-weight:900;margin-bottom:10px}
.result .rrow{display:flex;justify-content:space-between;font-size:32px;font-weight:700;padding:10px 0;border-bottom:2px solid #e3efeb}
.result .rrow b{color:var(--teal);font-size:36px}
.result .rmsg{margin-top:16px;font-size:28px;font-weight:700;color:#36515a}
.hint-bar{position:absolute;left:50%;top:116px;transform:translateX(-50%);white-space:nowrap;padding:10px 36px;border-radius:999px;background:rgba(10,37,48,.88);border:2px solid var(--amber);font-size:34px;font-weight:900;color:#fff;z-index:20}
.optbtn{position:absolute;width:520px;min-height:300px;padding:30px 34px;border-radius:30px;background:#fff;color:var(--ink);font-size:30px;font-weight:700;line-height:1.5;text-align:right;border:6px solid transparent;transition:.15s;animation:optin .45s backwards}
.optbtn:nth-child(3){animation-delay:.12s} .optbtn:nth-child(4){animation-delay:.24s}
@keyframes optin{from{opacity:0;transform:translateY(50px)}}
.optbtn:hover:not(:disabled){border-color:var(--amber);transform:translateY(-8px)}
.optbtn .let{width:66px;height:66px;border-radius:50%;background:var(--ink2);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:36px;margin-bottom:14px}
.optbtn.missed{opacity:.5} .optbtn.good{border-color:var(--green);box-shadow:0 0 0 10px rgba(53,179,122,.35)} .optbtn.bad{border-color:var(--red);box-shadow:0 0 0 10px rgba(226,88,76,.3)}
.optbtn:disabled{cursor:default}
.conscard{display:inline-block;max-width:1500px;background:rgba(10,37,48,.95);padding:24px 50px 30px;border-radius:24px;border:3px solid var(--red)}
.apppage{animation:pagein .6s cubic-bezier(.34,1.56,.64,1)} .apppage.fly{transition:transform .75s ease-in,opacity .75s ease-in}
@keyframes pagein{from{opacity:0;transform:translateY(-200px) rotate(-12deg) scale(.4)}}
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
@media (prefers-reduced-motion: reduce){.pulse,.optbtn,.apppage{animation:none}.zoomer,.apppage.fly{transition:none}}
`;

createRoot(document.getElementById('root')!).render(<App />);
