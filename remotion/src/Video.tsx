import React from 'react';
import {AbsoluteFill, Audio, Series, interpolate, staticFile, useVideoConfig} from 'remotion';
import {BG, CSS} from './components';
import {DUR, Flow, Hub, Intro, Method, Mission, Notebook, Outro, Reveal, Team} from './Scenes';
import {Station, stationDuration} from './Station';

type Item = {key: string; dur: number; el: React.ReactNode};
export const TIMELINE: Item[] = [
  {key: 'intro', dur: DUR.intro, el: <Intro />},
  {key: 'team', dur: DUR.team, el: <Team />},
  {key: 'flow', dur: DUR.flow, el: <Flow />},
  {key: 'mission', dur: DUR.mission, el: <Mission />},
  {key: 'hub', dur: DUR.hub, el: <Hub />},
  {key: 'method', dur: DUR.method, el: <Method />},
  ...[0, 1, 2, 3, 4].map((i) => ({key: 'st' + (i + 1), dur: stationDuration(i), el: <Station si={i} />})),
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
      <Audio src={staticFile('audio/music.m4a')} volume={(f) => interpolate(f, [0, 60, durationInFrames - 120, durationInFrames], [0, 0.55, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Series>
        {TIMELINE.map((x) => <Series.Sequence key={x.key} durationInFrames={frames(x.dur)} name={x.key}>{x.el}</Series.Sequence>)}
      </Series>
    </AbsoluteFill>
  );
};
