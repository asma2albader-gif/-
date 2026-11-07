// «لاحظي المخالفة»: one real scene that shows all five violations at once.
// The viewer spots a violation and taps it → its question → answer → its page returns to the safety booklet
// → back to the same scene until all five are found. Used by the MP4 (auto demo) and the interactive app.
import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cues, Cursor, Footage, Magnifier, Words, asset} from './components';
import {K, V, ar, back, clamp, ease, easeOut, sceneFade} from './lib';

export type Spot = {x: number; y: number; r: number};
export type Violation = {
  n: number; title: string; label: string; spots: Spot[]; focus: {x: number; y: number; s: number};
  opts: [string, string, string]; correct: number; why: string; text: string;
  cons: Record<number, string>; hint: string; img: string; what: string;
};

/** The five violations in the scene (coordinates on the 1920×1080 freeze frame at 5 s). */
export const VIOL: Violation[] = [
  {n: 1, title: 'الدخول والوقاية', label: 'تشرب قهوة داخل المختبر بلا معطف ولا نظارة واقية',
    spots: [{x: 1072, y: 300, r: 170}, {x: 1530, y: 420, r: 150}], focus: {x: 1180, y: 380, s: 1.7},
    opts: ['أتركها تكمل لأن عملها سريع', 'أطلب منها الخروج لترك الكوب، ثم ارتداء المعطف والنظارة والحذاء المغلق قبل العودة', 'أعطيها نظارة وأتركها تكمل شرب القهوة'], correct: 1,
    why: 'الوقاية تبدأ قبل الدخول.', text: 'تُرتدى معدات الوقاية قبل الدخول، ولا يدخل أحد المختبر بطعام أو شراب.',
    cons: {0: 'استمرت في الشرب بلا وقاية؛ وأي رشفة قد تحمل معها مادة من المختبر.', 2: 'النظارة وحدها لا تكفي، والقهوة ما زالت في يدها داخل المختبر.'},
    hint: 'تلميح: انظري إلى ما في يدها، وإلى المعاطف المعلقة عند الباب.', img: 'v1', what: 'شربت قهوة بلا وقاية'},
  {n: 2, title: 'الممرات', label: 'حقيبة متروكة على الأرض في الممر',
    spots: [{x: 1492, y: 920, r: 120}], focus: {x: 1470, y: 860, s: 2},
    opts: ['أنقل الحقيبة إلى المكان المخصص للحقائب وأُفرغ الممر', 'أتركها لأنها مؤقتة', 'أدفعها بقدمي إلى جانب الممر'], correct: 0,
    why: 'الممر الخالي طريق نجاة عند الطوارئ.', text: 'تبقى الممرات والمخارج ومعدات الطوارئ خالية دائمًا.',
    cons: {1: 'تعثّرت زميلة بالحقيبة، وبقي الممر مسدودًا.', 2: 'ما زالت الحقيبة في الطريق قرب الباب.'},
    hint: 'تلميح: ماذا لو احتجنا إلى الخروج بسرعة؟', img: 'v2', what: 'تركت حقيبتها في الممر'},
  {n: 3, title: 'الكهرباء والسوائل', label: 'وصلة كهربائية ممدودة على الأرض قرب السائل المنسكب',
    spots: [{x: 1295, y: 945, r: 95}, {x: 1345, y: 745, r: 85}], focus: {x: 1300, y: 840, s: 2},
    opts: ['أترك الوصلة مكانها وأمسح السائل فقط', 'أحرّك الوصلة بسرعة قبل أن أجفف يديّ', 'أتأكد أن يديّ جافتان، ثم أبعد الوصلة عن السائل وأخبر المشرفة'], correct: 2,
    why: 'الكهرباء والسوائل لا يجتمعان.', text: 'تُبعد الأجهزة والوصلات الكهربائية عن الماء والسوائل، ولا تُلمس باليد المبللة.',
    cons: {0: 'السائل قد يصل إلى الوصلة في أي لحظة.', 1: 'لمس الوصلة بيد مبللة قد يسبّب صعقة كهربائية!'},
    hint: 'تلميح: انظري إلى يديكِ أولًا، ثم إلى مكان الوصلة.', img: 'v3', what: 'مدّت الوصلة قرب السائل'},
  {n: 4, title: 'المادة المجهولة', label: 'سائل أخضر مجهول منسكب من دورق مقلوب',
    spots: [{x: 705, y: 930, r: 125}, {x: 300, y: 600, r: 115}], focus: {x: 520, y: 760, s: 1.7},
    opts: ['أمسحه بمنديل فورًا', 'لا أنظفه: أقرأ الملصق ورمز التحذير، وأُبعد الزميلات، وأبلغ المشرفة', 'أغطيه بورق وأمضي'], correct: 1,
    why: 'المعرفة تسبق التنظيف.', text: 'لا تُنظَّف مادة مجهولة قبل معرفة نوعها: اقرئي الملصق ورمز التحذير، وأبعدي الأخريات، وأبلغي المشرفة.',
    cons: {0: 'قد تكون المادة أكّالة؛ مسحها بمنديل يعرّض اليد للأذى.', 2: 'تغطيتها لا تزيل الخطر، وقد تدوس عليها زميلة.'},
    hint: 'تلميح: هل نعرف ما هذه المادة؟', img: 'v4', what: 'تركت المادة المنسكبة'},
  {n: 5, title: 'الزجاج المكسور', label: 'قطع زجاج مكسور متناثرة على الأرض',
    spots: [{x: 930, y: 1010, r: 115}, {x: 1150, y: 905, r: 70}], focus: {x: 960, y: 900, s: 1.9},
    opts: ['لا ألمسه: أؤمّن المكان بإبعاد الزميلات، وأبلغ المشرفة لتجمعه بالأداة المخصصة', 'أجمع القطع بيدي بسرعة', 'أركلها بقدمي بعيدًا'], correct: 0,
    why: 'الأداة المخصصة تحمي يديكِ.', text: 'لا يُلمس الزجاج المكسور باليد؛ يُؤمَّن المكان ويُبلَّغ عنه ليُجمع بالأداة المخصصة.',
    cons: {1: 'جرحت القطع الحادة اليد.', 2: 'تطايرت القطع نحو الممر وأصبحت خطرًا على الأخريات.'},
    hint: 'تلميح: ما الأداة المناسبة لجمع الزجاج؟ ومن يجب أن نبلغ؟', img: 'v5', what: 'تركت الزجاج المكسور'},
];

/** CSS transform that zooms the 1920×1080 scene onto `f` (z: 0 = full view, 1 = fully zoomed). */
export function zoomTransform(f: {x: number; y: number; s: number}, z: number) {
  const s = 1 + (f.s - 1) * z;
  const tx = clamp(960 - f.x * s, 1920 - 1920 * s, 0), ty = clamp(540 - f.y * s, 1080 - 1080 * s, 0);
  return `translate(${tx}px,${ty}px) scale(${s})`;
}
export const OPT_LEFT = [1290, 700, 110]; // option cards, RTL: أ on the right
export const tabCenter = (i: number) => ({x: 1250 - i * 130 + 60, y: 48});

/** Top bar: booklet pages (restored ✓) and the violation counter. */
export const HuntBar: React.FC<{restored: number[]; style?: React.CSSProperties}> = ({restored, style}) => (
  <div className="topbar" style={{...style, zIndex: 40}}>
    <div className="ttl" style={{fontSize: 32}}>كتيّب تعليمات السلامة</div>
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {VIOL.map((v, i) => {const ok = restored.includes(i); return (
        <div key={i} style={{position: 'absolute', left: 1250 - i * 130, top: 18, width: 120, height: 60, borderRadius: 12,
          border: ok ? '3px solid var(--teal2)' : '3px dashed rgba(191,233,223,.5)', background: ok ? 'var(--teal)' : 'transparent',
          color: ok ? '#fff' : 'rgba(191,233,223,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 900, fontSize: 22}}>
          {ok ? '✓' : ''} صفحة {ar(v.n)}</div>);})}
    </div>
    <div className="counter">المخالفات المكتشفة {ar(restored.length)} / ٥</div>
  </div>
);

/** Green ring + small label on a violation that has been found. */
export const FoundMark: React.FC<{v: Violation; o?: number}> = ({v, o = 1}) => (
  <>{v.spots.map((s, k) => <div key={k} className="pin" style={{left: s.x, top: s.y, zIndex: 8, opacity: o}}>
    <div style={{width: s.r * 2, height: s.r * 2, borderRadius: '50%', border: '6px solid var(--green)', boxShadow: '0 0 0 6px rgba(53,179,122,.3)'}} /></div>)}
    <div className="pin" style={{left: v.spots[0].x, top: v.spots[0].y - v.spots[0].r - 30, zIndex: 9, opacity: o}}>
      <div style={{whiteSpace: 'nowrap', background: 'var(--green)', color: '#fff', fontWeight: 900, fontSize: 26, padding: '4px 18px', borderRadius: 999}}>✓ صفحة {ar(v.n)}</div></div></>
);

/** The restored booklet page (big), then it flies into its tab in the top bar. `P` = start time. */
export const BookletPage: React.FC<{v: Violation; t: number; P: number}> = ({v, t, P}) => {
  const tc = tabCenter(v.n - 1);
  return <>
    <div className="abs" style={{inset: 0, background: 'rgba(6,23,30,.85)', zIndex: 30, ...K(t, [[P - 0.2, {o: 0}], [P + 0.3, {o: 1}], [P + 3.3, {o: 1}], [P + 3.8, {o: 0}]])}} />
    <div className="page" style={{zIndex: 31, ...K(t, [[P, {o: 0, s: 0.4, r: -12, x: 0, y: -200}], [P + 0.6, {o: 1, s: 1, r: 0, x: 0, y: 0}, back], [P + 2.9, {s: 1, x: 0, y: 0}],
      [P + 3.5, {s: 0.15, x: tc.x - 960, y: tc.y - 450}, ease], [P + 3.55, {o: 1}], [P + 3.65, {o: 0}]])}}>
      <div className="num">كتيّب السلامة · الصفحة {ar(v.n)} ✓</div>
      <div className="lt">{v.title}</div>
      <div className="law"><Words text={v.text} t={t} t0={P + 0.6} t1={P + 2.4} /></div>
    </div>
  </>;
};

/* ------------------------- MP4: an automatic walkthrough ------------------------- */
const STEP = 11.6, WRONG_EXTRA = 5.2;
const starts = VIOL.map((_, i) => 1.5 + i * STEP + (i > 0 ? WRONG_EXTRA : 0));
export const HUNT_DUR = starts[4] + STEP + 2.5;

export const HuntDemo: React.FC = () => {
  const {fps} = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const cur = Math.max(0, starts.filter((s) => t >= s).length - 1);
  const v = VIOL[cur], B = starts[cur], wrongDemo = cur === 0;
  const X = wrongDemo ? WRONG_EXTRA : 0;             // extra time used by the wrong-answer demo
  const zoom = V(t, [[B + 1.8, 0], [B + 2.6, 1], [B + 10.3 + X, 1], [B + 11.1 + X, 0]]);
  const restored = VIOL.map((_, i) => i).filter((i) => i < cur || (i === cur && t > B + 9.9 + X));
  const found = VIOL.map((_, i) => i).filter((i) => i < cur || (i === cur && t > B + 1.2));
  const prev = cur > 0 ? VIOL[cur - 1].spots[0] : {x: 1700, y: 1150};
  const cue: Array<[number, string]> = [[0.1, 'whoosh']];
  starts.forEach((s, i) => {const x = i === 0 ? WRONG_EXTRA : 0;
    cue.push([s + 1.2, 'pop'], [s + 1.8, 'zoom'], [s + 2.6, 'swish']);
    if (i === 0) cue.push([s + 4.6, 'click'], [s + 4.7, 'wrong']);
    cue.push([s + 4.8 + x, 'click'], [s + 5.0 + x, 'success'], [s + 6.4 + x, 'page'], [s + 7.0 + x, 'type'], [s + 9.5 + x, 'swish'], [s + 9.9 + x, 'chime']);});
  // question/answer timing (relative to B)
  const qIn = B + 2.6, choose = B + 4.8 + X, pageT = B + 6.4 + X;
  const optState = (i: number) => {
    if (wrongDemo && i === 0 && t > B + 4.6 && t < choose) return 'bad';
    if (i === v.correct && t > choose) return 'good';
    return '';
  };
  const cpath: Array<[number, number, number]> = wrongDemo
    ? [[B + 3.4, 960, 1150], [B + 4.4, OPT_LEFT[0] + 260, 880], [B + 8.8, OPT_LEFT[0] + 260, 880], [B + 9.7, OPT_LEFT[v.correct] + 260, 880]]
    : [[B + 3.4, 960, 1150], [B + 4.6, OPT_LEFT[v.correct] + 260, 880]];
  return (
    <AbsoluteFill className="stage" style={sceneFade(t, HUNT_DUR)}>
      <Cues cues={cue} />
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: zoomTransform(v.focus, zoom)}}>
          <Img src={asset('cards/scene_freeze.jpg')} style={{width: 1920, height: 1080}} />
          {VIOL.map((w, i) => restored.includes(i) && <FoundMark key={i} v={w} o={i === cur ? V(t, [[B + 10.3 + X, 0], [B + 10.8 + X, 1]]) : 1} />)}
          {/* the violation being examined */}
          {v.spots.map((s, k) => <div key={k} className="pin" style={{left: s.x, top: s.y, zIndex: 8}}>
            <div className="ring" style={{width: s.r * 2, height: s.r * 2, ...K(t, [[B + 1.2, {o: 0, s: 0.4}], [B + 1.6, {o: 1, s: 1}, back], [B + 10.3 + X, {o: 1}], [B + 10.6 + X, {o: 0}]])}} /></div>)}
        </div>
      </AbsoluteFill>
      {/* instruction */}
      <div className="center" style={{top: 120, zIndex: 20, ...K(t, [[B, {o: 1}], [B + 1.6, {o: 1}], [B + 1.9, {o: 0}], [B + 10.9 + X, {o: 0}], [B + 11.4 + X, {o: 1}]])}}>
        <span style={{display: 'inline-block', padding: '10px 36px', borderRadius: 999, background: 'rgba(10,37,48,.88)', border: '2px solid var(--amber)', fontSize: 34, fontWeight: 900}}>
          لاحظي المخالفات في المشهد وانقري عليها ({ar(found.length)} / ٥)</span></div>
      {/* the violation label */}
      <div className="center" style={{top: 130, zIndex: 21, ...K(t, [[B + 1.3, {o: 0, y: -20}], [B + 1.8, {o: 1, y: 0}], [B + 6.2 + X, {o: 1}], [B + 6.5 + X, {o: 0}]])}}>
        <span className="chip" style={{fontSize: 36}}><span style={{color: 'var(--amber)', fontWeight: 900}}>مخالفة:</span>&nbsp; {v.label}</span></div>
      {/* question */}
      <AbsoluteFill style={{zIndex: 24, background: 'linear-gradient(180deg,rgba(6,23,30,0) 30%,rgba(6,23,30,.92) 58%)', ...K(t, [[qIn, {o: 0}], [qIn + 0.4, {o: 1}], [pageT - 0.2, {o: 1}], [pageT, {o: 0}]])}} />
      <div className="center h2" style={{top: 560, zIndex: 26, fontSize: 56, ...K(t, [[qIn, {o: 0, y: 30}], [qIn + 0.4, {o: 1, y: 0}], [pageT - 0.2, {o: 1}], [pageT, {o: 0}]])}}>ماذا تفعلين؟</div>
      {v.opts.map((o, i) => {const st = optState(i); return (
        <div key={i} className="opt" style={{top: 660, height: 300, left: OPT_LEFT[i], fontSize: 29, ...K(t, [[qIn + 0.2 + i * 0.15, {o: 0, y: 60}], [qIn + 0.7 + i * 0.15, {o: 1, y: 0}, back], [pageT - 0.2, {o: 1}], [pageT, {o: 0}]]),
          borderColor: st === 'good' ? 'var(--green)' : st === 'bad' ? 'var(--red)' : 'transparent', boxShadow: st === 'good' ? '0 0 0 10px rgba(53,179,122,.35)' : st === 'bad' ? '0 0 0 10px rgba(226,88,76,.3)' : 'none'}}>
          <div className="let">{['أ', 'ب', 'ج'][i]}</div>{o}
          <div className="mark" style={{background: st === 'good' ? 'var(--green)' : st === 'bad' ? 'var(--red)' : 'transparent'}}>{st === 'good' ? '✓' : st === 'bad' ? '✗' : ''}</div></div>);})}
      {wrongDemo && <div className="center" style={{top: 250, zIndex: 27, ...K(t, [[B + 4.8, {o: 0, y: -20}], [B + 5.2, {o: 1, y: 0}], [B + 9.0, {o: 1}], [B + 9.3, {o: 0}]])}}>
        <div style={{display: 'inline-block', maxWidth: 1500, background: 'rgba(10,37,48,.94)', padding: '20px 46px', borderRadius: 24, border: '3px solid var(--red)'}}>
          <div style={{fontSize: 46, fontWeight: 900, color: '#ffb3ab'}}>لنرَ ما سيحدث…</div>
          <div style={{fontSize: 34, fontWeight: 700, marginTop: 6}}>{v.cons[0]}</div>
          <div style={{fontSize: 30, fontWeight: 700, marginTop: 10, color: 'var(--amber)'}}>{v.hint}</div></div></div>}
      <div className="center" style={{top: 300, zIndex: 27, ...K(t, [[choose + 0.1, {o: 0, s: 0.7}], [choose + 0.5, {o: 1, s: 1}, back], [pageT - 0.3, {o: 1}], [pageT, {o: 0}]])}}>
        <div className="fbin">قرار موفّق!</div><div className="fbsub">{v.why}</div></div>
      <BookletPage v={v} t={t} P={pageT} />
      <Cursor t={t} path={cpath} clicks={wrongDemo ? [B + 4.6, choose] : [choose]} hidden={t < B + 3.3 || t > choose + 1} />
      {/* finding the violation: the magnifier travels to it and "taps" */}
      <Magnifier style={{transform: `translate(${V(t, [[B, prev.x], [B + 1.1, v.spots[0].x]])}px,${V(t, [[B, prev.y], [B + 1.1, v.spots[0].y]])}px)`, opacity: V(t, [[B, 1], [B + 1.4, 1], [B + 1.7, 0]]) * (cur === 0 ? V(t, [[0.8, 0], [1.2, 1]]) : 1), zIndex: 22}} />
      <HuntBar restored={restored} />
    </AbsoluteFill>
  );
};
