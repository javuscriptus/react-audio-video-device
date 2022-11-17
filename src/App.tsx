import React from 'react';
import { useEffect } from 'react';

import { Select } from './components';
import useDevices from './hooks/useDevices';

const App = () => {
  const {
    options,
    audioSourceRef,
    audioOutputRef,
    videoSourceRef,
    start,
    changeAudioDestination,
  } = useDevices();

  const selects = [
    {
      kind: 'audioinput',
      ref: audioSourceRef,
      label: 'Выберите устройство аудиовхода:',
    },
    {
      kind: 'audiooutput',
      ref: audioOutputRef,
      label: 'Выберите устройство аудиовыхода:',
    },
    {
      kind: 'videoinput',
      ref: videoSourceRef,
      label: 'Выберите источник видео:',
    },
  ];

  return (
    <div>
      {selects.map(({ kind, ref, label }) => (
        <Select
          key={`${label}_${kind}`}
          ref={ref}
          name={kind}
          label={label}
          onChange={start}
        >
          <>
            {kind === 'audioinput' &&
              options['audioinput']?.map(({ kind, value, label }: any) => {
                return (
                  <option key={`${kind}_${value}_${label}`} value={value}>
                    {label}
                  </option>
                );
              })}
            {kind === 'audiooutput' &&
              options['audiooutput']?.map(({ kind, value, label }: any) => {
                return (
                  <option key={`${kind}_${value}_${label}`} value={value}>
                    {label}
                  </option>
                );
              })}
            {kind === 'videoinput' &&
              options['videoinput']?.map(({ kind, value, label }: any) => {
                return (
                  <option key={`${kind}_${value}_${label}`} value={value}>
                    {label}
                  </option>
                );
              })}
          </>
        </Select>
      ))}

      <video id="video" playsInline autoPlay>
        <track kind="captions" />
      </video>
    </div>
  );
};

export default App;
