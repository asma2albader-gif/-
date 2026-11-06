import React from 'react';
import {Composition, AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
const Test: React.FC = () => {const f=useCurrentFrame();return <AbsoluteFill style={{background:'#0a2530',color:'#fff',fontSize:90,justifyContent:'center',alignItems:'center',opacity:interpolate(f,[0,20],[0,1])}}>Remotion OK</AbsoluteFill>};
export const Root: React.FC = () => <Composition id="Test" component={Test} durationInFrames={30} fps={30} width={1920} height={1080}/>;
