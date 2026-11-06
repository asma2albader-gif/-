import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setCrf(20);
// Use a locally installed Chrome/Chromium when remotion.media is unreachable:
//   REMOTION_CHROME=/path/to/chrome npm run render
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
