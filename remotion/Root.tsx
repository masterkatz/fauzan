import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import './lib/fonts';
import {DURATION_S, FPS, H, W} from './lib/script';
import {Presenter, PresenterBaked} from './lib/common';
import {TEMPLATES} from './templates';

const BakeBG: React.FC = () => (
  <AbsoluteFill>
    <Presenter t={0} layer="bg" />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    {TEMPLATES.map((tp) => (
      <Composition key={tp.id} id={tp.id} component={tp.component} durationInFrames={DURATION_S * FPS} fps={FPS} width={W} height={H} />
    ))}
    {/* Bake placeholder (sekali je): tools/bake_placeholder.sh */}
    <Composition id="Bake-BG" component={BakeBG} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="Bake-Talking" component={PresenterBaked} durationInFrames={DURATION_S * FPS} fps={FPS} width={W} height={H} />
  </>
);
