// Render index.html to an MP4 (1920x1080, 30fps) with the synthesised soundtrack.
// Usage: node render.cjs [workers=3] [fps=30]
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const WORKERS = +(process.argv[2] || 3), FPS = +(process.argv[3] || 30);
const URL = 'file://' + path.join(__dirname, 'index.html') + '?render=1';

async function openPage(browser) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto(URL); await p.evaluate(() => document.fonts.ready); return p;
}
async function renderSegment(browser, idx, f0, f1) {
  const p = await openPage(browser);
  const file = path.join(OUT, `seg${idx}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) {
    await p.evaluate(t => renderAt(t), f / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`worker ${idx}: ${f - f0}/${f1 - f0}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await p.close(); return file;
}
(async () => {
  const browser = await chromium.launch();
  const p = await openPage(browser);
  const { total, cues } = await p.evaluate(() => ({ total: TOTAL, cues: CUES })); await p.close();
  fs.writeFileSync(path.join(OUT, 'cues.json'), JSON.stringify({ total, cues }, null, 1));
  execFileSync('python3', [path.join(__dirname, 'audio.py'), path.join(OUT, 'cues.json'), path.join(OUT, 'soundtrack.wav')], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(OUT, 'soundtrack.wav'), '-c:a', 'aac', '-b:a', '192k', path.join(OUT, 'soundtrack.m4a')]);
  const N = Math.round(total * FPS), per = Math.ceil(N / WORKERS);
  const segs = await Promise.all(Array.from({ length: WORKERS }, (_, i) => renderSegment(browser, i, i * per, Math.min(N, (i + 1) * per))));
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'segs.txt'), segs.map(s => `file '${s}'`).join('\n'));
  const final = path.join(OUT, 'lab-mystery-missing-pages.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'segs.txt'), '-i', path.join(OUT, 'soundtrack.m4a'),
    '-c:v', 'copy', '-c:a', 'copy', '-map', '0:v', '-map', '1:a', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' });
  segs.forEach(s => fs.unlinkSync(s)); fs.unlinkSync(path.join(OUT, 'segs.txt')); fs.unlinkSync(path.join(OUT, 'soundtrack.wav'));
  console.log('DONE', final, (fs.statSync(final).size / 1e6).toFixed(1) + ' MB');
})();
