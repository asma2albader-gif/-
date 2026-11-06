// Render preview stills: node scripts/stills.mjs <outDir> <sec> <sec> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.CHROME || undefined;
const composition = await selectComposition({serveUrl, id: 'LabMystery', browserExecutable});
console.log('duration', composition.durationInFrames / composition.fps, 's');
for (const s of secs) {
  await renderStill({composition, serveUrl, output: `${outDir}/r_${s}.jpg`, imageFormat: 'jpeg', jpegQuality: 70, frame: Math.round(+s * 30), browserExecutable});
}
