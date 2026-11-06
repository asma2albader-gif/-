import React from 'react';
import {Composition} from 'remotion';
import {FPS, LabMystery, TOTAL_FRAMES} from './Video';

export const Root: React.FC = () => (
  <Composition id="LabMystery" component={LabMystery} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
);
