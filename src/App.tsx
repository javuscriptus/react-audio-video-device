import { useEffect, useRef, useState } from 'react';

import styles from './App.module.scss';
import { Select } from './components';
import useDevices from './hooks/useDevices';
import { useSettingsStore } from './store/store';

type RangeValueTypes = {
  audioinput: number;
  audiooutput: number;
  videoinput: number;
};

const App = () => {
  const { audioinput, audiooutput, videoinput, handleVolume }: any = useSettingsStore(
    (state) => state,
  );

  const rangeValue = {
    audioinput,
    audiooutput,
    videoinput,
  };

  const {
    options,
    videoInputRef,
    audioInputRef,
    audioOutputRef,
    audioInputRangeRef,
    audioOutputRangeRef,
    videoInputRangeRef,
    start,
    localAudioRef,
    remoteAudioRef,
    videoElemRef,
    changeAudioDestination,
  } = useDevices();

  const selects = [
    {
      kind: 'audioinput',
      ref: audioInputRef,
      refRange: audioInputRangeRef,
      label: 'Выберите устройство аудиовхода:',
      volume: audioinput,
      // handleRange: handleVolume(rangeValue, 50),
    },
    {
      kind: 'audiooutput',
      ref: audioOutputRef,
      refRange: audioOutputRangeRef,
      label: 'Выберите устройство аудиовыхода:',
      volume: audiooutput,
      // handleRange: handleVolume(rangeValue, 50),
    },
    {
      kind: 'videoinput',
      ref: videoInputRef,
      refRange: videoInputRangeRef,
      label: 'Выберите источник видео:',
      volume: videoinput,
      // handleRange: handleVolume(rangeValue, 50),
    },
  ];

  const handleRangeInput = (e: any, kind: any) => {
    handleVolume(kind, e.target.value);
  };

  return (
    <div className={styles.settings}>
      <form action="">
        {selects.map(({ kind, ref, label, refRange, volume }) => {
          if (kind === 'audioinput' && localAudioRef.current) {
            localAudioRef.current.volume = volume / 100;
          }
          if (kind === 'audiooutput' && remoteAudioRef.current) {
            remoteAudioRef.current.volume = volume / 100;
          }

          return (
            <div key={`${label}_${kind}_${volume}`} className={styles.block}>
              <Select ref={ref} name={kind} label={label} onChange={start}>
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
              <div className={styles['input-value']}>
                {kind === 'audioinput' && (
                  <>
                    <span>Громкость: {audioinput}%</span>
                    <audio ref={localAudioRef} autoPlay muted={true} />
                  </>
                )}
                {kind === 'audiooutput' && (
                  <>
                    <span>Громкость микрофона: {audiooutput}%</span>
                    <audio ref={remoteAudioRef} autoPlay muted={true} />
                  </>
                )}
                {kind === 'videoinput' && (
                  <video id="video" ref={videoElemRef} playsInline autoPlay>
                    <track kind="captions" />
                  </video>
                )}
                {kind !== 'videoinput' && (
                  <input
                    type="range"
                    name={`${kind}_${label}`}
                    ref={refRange}
                    value={Number(rangeValue[kind])}
                    min={1}
                    max={100}
                    onChange={(e) => handleRangeInput(e, kind)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default App;
