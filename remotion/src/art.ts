// Illustrated fallback art (SVG strings). Used for any scene whose real-footage slot is empty.
export type PersonOpts = {skin?: string; scarf?: string; hair?: string; coat?: boolean; top?: string; pants?: string; open?: boolean;
  goggles?: boolean; glasses?: boolean; armR?: number; armL?: number; hand?: string; sad?: boolean};

export function person(o: PersonOpts = {}) {
  const skin = o.skin || '#f2c7a5', scarf = o.scarf || '#7d5ba6', coat = o.coat !== false, top = o.top || '#4f7bd0', pants = o.pants || '#3b4a63';
  const sleeve = coat ? '#ffffff' : top, body = coat ? '#ffffff' : top, stroke = coat ? '#d5dde0' : 'none';
  const shoes = o.open
    ? `<ellipse cx="-24" cy="-6" rx="22" ry="8" fill="${skin}"/><ellipse cx="22" cy="-6" rx="22" ry="8" fill="${skin}"/><path d="M-40,-8h34M4,-8h34" stroke="#c0574a" stroke-width="5"/><path d="M-44,0h44M0,0h44" stroke="#7a3b2f" stroke-width="5"/>`
    : `<rect x="-46" y="-18" width="44" height="20" rx="10" fill="#2a2f3a"/><rect x="2" y="-18" width="44" height="20" rx="10" fill="#2a2f3a"/>`;
  const goggles = o.goggles ? `<rect x="-38" y="-404" width="76" height="24" rx="11" fill="rgba(140,220,255,.55)" stroke="#2f6f96" stroke-width="4"/>` : '';
  const glasses = o.glasses ? `<circle cx="-15" cy="-392" r="12" fill="none" stroke="#333" stroke-width="3.5"/><circle cx="15" cy="-392" r="12" fill="none" stroke="#333" stroke-width="3.5"/><path d="M-3,-392h6" stroke="#333" stroke-width="3"/>` : '';
  const coatDetail = coat ? `<path d="M0,-326 L-26,-270 M0,-326 L26,-270" stroke="#cfd8dc" stroke-width="5" fill="none"/><path d="M0,-300V-160" stroke="#cfd8dc" stroke-width="3"/><rect x="34" y="-230" width="34" height="26" rx="5" fill="none" stroke="#cfd8dc" stroke-width="3"/>` : '';
  return `<ellipse cx="0" cy="2" rx="80" ry="13" fill="rgba(0,0,0,.18)"/>
  <rect x="-36" y="-172" width="30" height="164" rx="12" fill="${pants}"/><rect x="6" y="-172" width="30" height="164" rx="12" fill="${pants}"/>${shoes}
  <g transform="rotate(${o.armL || 0} -88 -318)"><rect x="-108" y="-322" width="30" height="156" rx="15" fill="${sleeve}" stroke="${stroke}" stroke-width="3"/><circle cx="-93" cy="-162" r="17" fill="${skin}"/></g>
  <path d="M-72,-334 Q-86,-332 -90,-300 L-100,-140 L100,-140 L90,-300 Q86,-332 72,-334 Z" fill="${body}" stroke="${stroke}" stroke-width="3"/>${coatDetail}
  <g transform="rotate(${o.armR || 0} 88 -318)"><rect x="78" y="-322" width="30" height="156" rx="15" fill="${sleeve}" stroke="${stroke}" stroke-width="3"/><circle cx="93" cy="-162" r="17" fill="${skin}"/>${o.hand || ''}</g>
  ${o.hair
    ? `<path d="M22,-418 Q78,-410 70,-350 Q66,-318 50,-312 Q60,-350 34,-392Z" fill="${o.hair}"/><circle cx="34" cy="-404" r="9" fill="#c2577f"/>
       <rect x="-10" y="-344" width="20" height="18" fill="${skin}"/><ellipse cx="0" cy="-390" rx="44" ry="50" fill="${o.hair}"/>`
    : `<path d="M-64,-392 A64,64 0 0 1 64,-392 L74,-326 Q0,-296 -74,-326 Z" fill="${scarf}"/>`}
  <ellipse cx="0" cy="-386" rx="40" ry="46" fill="${skin}"/>
  ${o.hair
    ? `<path d="M-44,-388 Q-46,-438 0,-440 Q46,-438 44,-388 Q34,-420 0,-424 Q-30,-422 -44,-388Z" fill="${o.hair}"/>`
    : `<path d="M-42,-400 Q0,-446 42,-400 Q30,-430 0,-434 Q-30,-430 -42,-400Z" fill="${scarf}"/>`}
  <circle cx="-15" cy="-390" r="4.5" fill="#2b2b2b"/><circle cx="15" cy="-390" r="4.5" fill="#2b2b2b"/>
  <circle cx="-25" cy="-372" r="7" fill="rgba(230,120,120,.25)"/><circle cx="25" cy="-372" r="7" fill="rgba(230,120,120,.25)"/>
  <path d="${o.sad ? 'M-11,-362 Q0,-370 11,-362' : 'M-12,-367 Q0,-357 12,-367'}" stroke="#7a3b2f" stroke-width="3.5" fill="none" stroke-linecap="round"/>${goggles}${glasses}`;
}
// Salma matches the real-footage actress (Mixkit 21452–21461): dark hair tied back, purple scrubs.
export const SALMA: PersonOpts = {hair: '#1f1a1d', skin: '#f0c9a8', top: '#3d33c4', pants: '#3d33c4', coat: false};
export const MATE: PersonOpts = {hair: '#7a4a2b', skin: '#e8b996', pants: '#4a3f5c'};
export const SUP: PersonOpts = {scarf: '#127369', skin: '#e9bd98', glasses: true, pants: '#33414f'};

export const flask = (x: number, y: number, c: string, k = 1) => `<g transform="translate(${x},${y}) scale(${k})"><path d="M-10,-70h20v26l26,44q6,12-8,12h-56q-14,0-8-12l26-44z" fill="rgba(255,255,255,.65)" stroke="#7aa" stroke-width="3"/><path d="M-30,-6 l14,-24h32l14,24q4,6-6,6h-48q-10,0-6-6z" fill="${c}"/></g>`;
export const tube = (x: number, y: number, c: string) => `<g transform="translate(${x},${y})"><rect x="-9" y="-60" width="18" height="60" rx="9" fill="rgba(255,255,255,.7)" stroke="#7aa" stroke-width="3"/><rect x="-6" y="-26" width="12" height="23" rx="6" fill="${c}"/></g>`;

export function backdrop(u: string, o: {window?: boolean; shelf?: boolean} = {}) {
  return `<defs>
  <linearGradient id="wall${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f3ef"/><stop offset="1" stop-color="#d2e6df"/></linearGradient>
  <linearGradient id="floor${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8cbc7"/><stop offset="1" stop-color="#93aaa6"/></linearGradient>
  <linearGradient id="counter${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4b55"/><stop offset="1" stop-color="#2b3740"/></linearGradient>
  <linearGradient id="cab${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7fbfa"/><stop offset="1" stop-color="#dce8e5"/></linearGradient></defs>
  <rect width="1920" height="760" fill="url(#wall${u})"/>
  <g stroke="rgba(18,115,105,.07)" stroke-width="2">${Array.from({length: 24}, (_, i) => `<path d="M${i * 84},0V740"/>`).join('')}${Array.from({length: 9}, (_, i) => `<path d="M0,${i * 84}H1920"/>`).join('')}</g>
  <rect y="736" width="1920" height="344" fill="url(#floor${u})"/>
  <g stroke="rgba(255,255,255,.25)" stroke-width="2">${Array.from({length: 13}, (_, i) => `<path d="M${960 + (i - 6) * 170},740 L${960 + (i - 6) * 420},1080"/>`).join('')}<path d="M0,820H1920M0,930H1920"/></g>
  <rect y="726" width="1920" height="16" fill="#8aa7a1"/>
  ${o.window !== false ? `<g><rect x="110" y="110" width="330" height="250" rx="10" fill="#b9e2f2" stroke="#fff" stroke-width="14"/><path d="M275,110V360M110,235H440" stroke="#fff" stroke-width="10"/><path d="M140,330 L220,250 L260,290 L330,210 L420,300" stroke="rgba(255,255,255,.6)" stroke-width="6" fill="none"/></g>` : ''}
  ${o.shelf !== false ? `<g><rect x="1390" y="250" width="440" height="16" rx="4" fill="#9fb6b1"/>${flask(1450, 250, '#5fc3a8')}${flask(1540, 250, '#f4ab3c', 0.8)}${tube(1620, 250, '#e2584c')}${tube(1650, 250, '#7d5ba6')}${flask(1740, 250, '#6aa6e8', 0.9)}</g>` : ''}`;
}
export const counter = (u: string, x: number, y: number, w: number) => `<g><rect x="${x}" y="${y}" width="${w}" height="26" rx="6" fill="url(#counter${u})"/><rect x="${x + 14}" y="${y + 26}" width="${w - 28}" height="${740 - y - 26}" fill="url(#cab${u})" stroke="#c6d6d2" stroke-width="3"/>
  ${Array.from({length: Math.floor((w - 28) / 180)}, (_, i) => `<rect x="${x + 24 + i * 180}" y="${y + 46}" width="160" height="${740 - y - 70}" rx="8" fill="none" stroke="#c6d6d2" stroke-width="3"/><rect x="${x + 90 + i * 180}" y="${y + 66}" width="28" height="8" rx="4" fill="#9fb6b1"/>`).join('')}</g>`;
export const sink = (x: number, y: number) => `<g><rect x="${x}" y="${y - 6}" width="230" height="22" rx="8" fill="#a9bcc3"/><rect x="${x + 20}" y="${y}" width="190" height="14" rx="6" fill="#6f848c"/><path d="M${x + 115},${y - 6} v-70 q0,-26 -26,-26 h-30" stroke="#9aaeb5" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="${x + 150}" y="${y - 30}" width="16" height="26" rx="5" fill="#9aaeb5"/></g>`;
export const hazard = (x: number, y: number, k = 1) => `<g transform="translate(${x},${y}) scale(${k})"><rect x="-50" y="-50" width="100" height="100" transform="rotate(45)" fill="#fff" stroke="#d6312a" stroke-width="10"/><path d="M-26,-14 l10,-12 l10,12 M8,-14 l10,-12 l10,12" stroke="#222" stroke-width="5" fill="none"/><path d="M-22,-4 q-4,10 2,14 M18,-4 q-4,10 2,14" stroke="#222" stroke-width="4" fill="none"/><rect x="-34" y="20" width="68" height="8" fill="#222"/></g>`;
export const notebookIcon = (x: number, y: number, k = 1) => `<g transform="translate(${x},${y}) scale(${k})"><path d="M0,-90 Q-80,-120 -170,-96 V96 Q-80,72 0,100 Q80,72 170,96 V-96 Q80,-120 0,-90Z" fill="#fbf6ea" stroke="#127369" stroke-width="8"/><path d="M0,-90V100" stroke="#127369" stroke-width="6"/>${[0, 1, 2, 3].map((i) => `<path d="M-140,${-50 + i * 36} Q-75,${-66 + i * 36} -24,${-50 + i * 36} M24,${-50 + i * 36} Q75,${-66 + i * 36} 140,${-50 + i * 36}" stroke="rgba(18,115,105,.35)" stroke-width="6" fill="none"/>`).join('')}</g>`;
export const ICON: Record<string, string> = {
  lens: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="42" cy="42" r="28" fill="rgba(191,233,223,.35)" stroke="currentColor" stroke-width="9"/><path d="M63,63 L88,88" stroke="currentColor" stroke-width="13" stroke-linecap="round"/></svg>`,
  rew: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M48,22 L10,50 L48,78Z M90,22 L52,50 L90,78Z" fill="currentColor"/></svg>`,
  dec: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="9"/><path d="M30,52 L45,66 L72,36" stroke="currentColor" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
export const MAG = `<svg viewBox="0 0 200 200" width="200" height="200" style="overflow:visible"><circle cx="90" cy="90" r="64" fill="rgba(191,233,223,.18)" stroke="#f4ab3c" stroke-width="14"/><circle cx="90" cy="90" r="64" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M137,137 L186,186" stroke="#0a2530" stroke-width="26" stroke-linecap="round"/><path d="M137,137 L186,186" stroke="#f4ab3c" stroke-width="16" stroke-linecap="round"/></svg>`;
export const CURSOR = `<svg viewBox="0 0 60 60" width="60" height="60"><path d="M8,4 L8,48 L20,37 L28,56 L36,52 L28,34 L44,34 Z" fill="#fff" stroke="#0a2530" stroke-width="3.5" stroke-linejoin="round"/></svg>`;

/** Static (non-animated) part of each station's illustrated set. */
export function stationBg(n: number) {
  const u = 'st' + n;
  switch (n) {
    case 1: return `${backdrop(u, {window: false})}
    <g><rect x="740" y="210" width="380" height="530" fill="#0f5b53"/><rect x="770" y="240" width="320" height="500" fill="#1b8a7c"/><rect x="820" y="290" width="220" height="170" rx="10" fill="#bfe3ef" stroke="#0f5b53" stroke-width="8"/><circle cx="1060" cy="500" r="14" fill="#f4ab3c"/>
     <rect x="790" y="140" width="280" height="60" rx="12" fill="#0a2530"/><text x="930" y="182" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="34" fill="#fff">مختبر العلوم</text>${hazard(860, 620, 0.45)}</g>
    <g><rect x="430" y="300" width="260" height="14" rx="6" fill="#8aa7a1"/><path d="M480,314 v20 M640,314 v20" stroke="#8aa7a1" stroke-width="8"/>
     <path d="M440,330 Q480,322 520,330 L540,560 L420,560 Z" fill="#fff" stroke="#cfd8dc" stroke-width="4"/>
     <rect x="580" y="350" width="90" height="34" rx="16" fill="rgba(140,220,255,.6)" stroke="#2f6f96" stroke-width="5"/><path d="M580,367 h-14 M670,367 h14" stroke="#2f6f96" stroke-width="5"/>
     <text x="560" y="610" text-anchor="middle" font-family="Cairo" font-size="26" font-weight="700" fill="#127369">معدات الوقاية</text></g>`;
    case 2: return `${backdrop(u, {window: false})}
    <g><rect x="840" y="150" width="240" height="100" rx="12" fill="#1aa260"/><text x="960" y="196" text-anchor="middle" font-family="Cairo" font-weight="900" font-size="34" fill="#fff">مخرج طوارئ</text><path d="M900,232 h120" stroke="#fff" stroke-width="6"/><path d="M1010,222 l14,10 l-14,10" fill="#fff"/></g>
    <rect x="860" y="270" width="200" height="460" fill="#cfe3dd" stroke="#9fb6b1" stroke-width="6"/>
    ${counter(u, 120, 560, 620)}${counter(u, 1300, 560, 520)}${flask(300, 560, '#5fc3a8', 0.8)}${tube(420, 560, '#f4ab3c')}${flask(1500, 560, '#6aa6e8', 0.8)}
    <g><rect x="1195" y="540" width="56" height="150" rx="22" fill="#d6312a"/><rect x="1205" y="520" width="36" height="26" fill="#333"/><path d="M1241,540 q40,10 30,60" stroke="#333" stroke-width="8" fill="none"/>
      <rect x="1130" y="610" width="140" height="120" fill="#c89b62" stroke="#a87b44" stroke-width="5"/><rect x="1150" y="560" width="110" height="60" fill="#d8ac72" stroke="#a87b44" stroke-width="5"/></g>`;
    case 3: return `${backdrop(u, {})}${counter(u, 200, 560, 1500)}${sink(480, 560)}
    <rect x="1530" y="390" width="70" height="90" rx="10" fill="#fff" stroke="#9fb6b1" stroke-width="4"/><circle cx="1552" cy="425" r="6" fill="#555"/><circle cx="1578" cy="425" r="6" fill="#555"/>
    <g><rect x="1220" y="440" width="170" height="114" rx="12" fill="#5e6e78"/><rect x="1240" y="460" width="130" height="18" rx="9" fill="#e2584c"/><circle cx="1360" cy="520" r="12" fill="#f4ab3c"/><path d="M1300,554 C1300,580 1180,560 850,552" stroke="#2a2f3a" stroke-width="7" fill="none"/></g>`;
    case 4: return `${backdrop(u, {window: false})}${counter(u, 1050, 560, 800)}${sink(1550, 560)}
    <g><rect x="1370" y="420" width="64" height="140" rx="14" fill="#7cc0a8" opacity=".9"/><rect x="1386" y="396" width="32" height="30" fill="#2a2f3a"/><rect x="1380" y="470" width="44" height="40" rx="4" fill="#fff"/>${hazard(1402, 490, 0.13)}</g>`;
    case 5: return `${backdrop(u, {})}
    <g><rect x="380" y="560" width="1000" height="28" rx="6" fill="url(#counter${u})"/><rect x="420" y="588" width="30" height="152" fill="#56656e"/><rect x="1310" y="588" width="30" height="152" fill="#56656e"/>
      ${tube(560, 560, '#6aa6e8')}${tube(600, 560, '#f4ab3c')}${flask(760, 560, '#5fc3a8', 0.8)}<rect x="900" y="520" width="140" height="40" rx="6" fill="#9fb6b1"/>${[0, 1, 2, 3].map((i) => `<circle cx="${920 + i * 33}" cy="530" r="10" fill="#fff" stroke="#7aa" stroke-width="3"/>`).join('')}</g>
    <g><path d="M0,880 H1920 M0,1010 H1920" stroke="#f4ab3c" stroke-width="12" stroke-dasharray="40 30"/><text x="300" y="960" font-family="Cairo" font-weight="900" font-size="40" fill="rgba(255,255,255,.75)">ممر</text></g>`;
  }
  return '';
}
export const cupSvg = (rot: number) => `<g transform="rotate(${rot} 112 -160)"><rect x="112" y="-212" width="40" height="52" rx="6" fill="#e2584c"/><rect x="108" y="-218" width="48" height="10" rx="4" fill="#fff"/><path d="M120,-232 q6,-12 0,-24 M138,-232 q6,-12 0,-24" stroke="#bbb" stroke-width="4" fill="none"/></g>`;
export const tissue = '<rect x="120" y="-200" width="54" height="40" rx="8" fill="#fff" stroke="#ccc" stroke-width="3"/>';
export const BAG = `<rect x="-70" y="-90" width="140" height="96" rx="20" fill="#7d5ba6"/><path d="M-36,-90 q36,-46 72,0" stroke="#5b3f80" stroke-width="10" fill="none"/><rect x="-40" y="-56" width="80" height="34" rx="8" fill="#9a7cc2"/>`;
export const PUDDLE = `<path d="M-170,0 q20,-40 110,-36 q60,-30 120,-6 q80,0 90,30 q-10,40 -120,34 q-80,20 -140,0 q-70,4 -60,-22z" fill="rgba(140,200,90,.75)" stroke="rgba(100,160,60,.8)" stroke-width="4"/>`;
export const SHARDS = [[930, 790, 20], [985, 812, -30], [1040, 785, 60], [1090, 815, 10], [1010, 800, -70], [960, 820, 45], [1130, 795, -15]]
  .map(([x, y, r]) => `<path d="M${x},${y} l18,-10 l6,22 z" fill="rgba(220,245,255,.9)" stroke="#6aa" stroke-width="3" transform="rotate(${r} ${x} ${y})"/>`).join('');
export const DROPS = [[960, 552], [1000, 548], [1050, 553], [905, 556], [1080, 546]].map(([x, y]) => `<path d="M${x},${y - 16} q10,14 0,18 q-10,-4 0,-18z" fill="#4fa9e8"/>`).join('') + '<ellipse cx="1000" cy="556" rx="70" ry="6" fill="rgba(79,169,232,.45)"/>';
export const STRIP = '<rect x="740" y="534" width="110" height="26" rx="8" fill="#f7f7f7" stroke="#2a2f3a" stroke-width="4"/><circle cx="770" cy="547" r="5" fill="#2a2f3a"/><circle cx="800" cy="547" r="5" fill="#2a2f3a"/>';
