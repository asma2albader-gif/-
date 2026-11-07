import React from 'react';
import {AbsoluteFill, Audio, Series, interpolate, staticFile, useVideoConfig} from 'remotion';
import {BG, CSS} from './components';
import {DUR, Intro, Mission, Notebook, Outro, Reveal} from './Scenes';
import {HUNT_DUR, HuntDemo} from './Hunt';

type Item = {key: string; dur: number; el: React.ReactNode};
export const TIMELINE: Item[] = [
  {key: 'intro', dur: DUR.intro, el: <Intro />},
  {key: 'mission', dur: DUR.mission, el: <Mission />},
  {key: 'hunt', dur: HUNT_DUR, el: <HuntDemo />},
  {key: 'notebook', dur: DUR.notebook, el: <Notebook />},
  {key: 'reveal', dur: DUR.reveal, el: <Reveal />},
  {key: 'outro', dur: DUR.outro, el: <Outro />},
];
export const FPS = 30;
export const frames = (s: number) => Math.round(s * FPS);
export const TOTAL_FRAMES = TIMELINE.reduce((a, x) => a + frames(x.dur), 0);

export const LabMystery: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={BG} dir="rtl" lang="ar">
      <style>{CSS}</style>
      <Audio src={staticFile('audio/music.mp3')} volume={(f) => interpolate(f, [0, 60, durationInFrames - 120, durationInFrames], [0, 0.55, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Series>
        {TIMELINE.map((x) => <Series.Sequence key={x.key} durationInFrames={frames(x.dur)} name={x.key}>{x.el}</Series.Sequence>)}
      </Series>
    </AbsoluteFill>
  );
};
