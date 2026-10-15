import {Config} from '@remotion/cli/config';

// Chromium yang dah ada dalam container (network block download Chrome Remotion).
const BROWSER = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

Config.setEntryPoint('remotion/index.ts');
Config.setBrowserExecutable(BROWSER);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);
