import { Ref, RefObject, useEffect, useRef, useState } from 'react';

import { useSettingsStore } from '@/store/store';

const useDevices = () => {
  const settingsStore = useSettingsStore((state) => state);

  const { audioinput, audiooutput, videoinput, handleVolume } = settingsStore;
  console.log('🚀 ➡️ file: useDevices.tsx:9 ➡️ useDevices ➡️ audioinput', {
    audioinput,
    audiooutput,
    videoinput,
  });

  const localAudioRef = useRef<RefObject<HTMLAudioElement>>();
  const remoteAudioRef = useRef<RefObject<HTMLAudioElement>>();
  const videoElemRef = useRef<RefObject<HTMLAudioElement>>();

  const audioInputRef = useRef<HTMLSelectElement>();
  const audioOutputRef = useRef<HTMLSelectElement>();
  const videoInputRef = useRef<HTMLSelectElement>();

  const audioInputRangeRef = useRef<any>();
  const audioOutputRangeRef = useRef<any>();
  const videoInputRangeRef = useRef<any>();

  const audioInputCurrentSelect = audioInputRef.current as any;
  const audioOutputCurrentSelect = audioOutputRef.current as any;
  const videoInputCurrentSelect = videoInputRef.current as any;

  const [isRerender, setIsRerender] = useState(false);
  const [options, setOptions] = useState<any>([]);

  const selectors = [
    audioInputCurrentSelect,
    audioOutputCurrentSelect,
    videoInputCurrentSelect,
  ];
  console.log('🚀 ➡️ file: useDevices.tsx:32 ➡️ useDevices ➡️ selectors', [
    selectors,
    audioInputCurrentSelect?.volume,
  ]);
  const rangeElements = [audioInputRangeRef, audioOutputRangeRef, videoInputRangeRef];

  function getDevices(deviceInfos: any) {
    if (options.length) {
      return;
    }

    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];

      if (deviceInfo.kind === 'audioinput') {
        setOptions((prev: any) => [
          ...prev,
          {
            kind: 'audioinput',
            value: deviceInfo.deviceId,
            label: deviceInfo.label,
          },
        ]);
      } else if (deviceInfo.kind === 'audiooutput') {
        setOptions((prev: any) => [
          ...prev,
          {
            kind: 'audiooutput',
            value: deviceInfo.deviceId,
            label: deviceInfo.label,
          },
        ]);
      } else if (deviceInfo.kind === 'videoinput') {
        setOptions((prev: any) => [
          ...prev,
          {
            kind: 'videoinput',
            value: deviceInfo.deviceId,
            label: deviceInfo.label,
          },
        ]);
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }

    start();
  }

  function gotStream(stream: any) {
    window.stream = stream;

    console.log('🚀 ➡️ file: useDevices.tsx ➡️ line 79 ➡️ gotStream ➡️ stream', stream);
    videoElemRef.current.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
  }

  function start() {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    console.log(window.stream);
    let audioS;
    let videoS;

    setTimeout(() => {
      audioS = audioInputCurrentSelect?.value;
      videoS = videoInputCurrentSelect?.value;

      const constraints = {
        audio: { deviceId: audioS ? { exact: audioS } : undefined },
        video: { deviceId: videoS ? { exact: videoS } : undefined },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .then(getDevices)
        .catch((err) => console.log('Ошибка', err));
    }, 3000);
  }

  function attachSinkId(element: any, sinkId: any) {
    if (typeof element.sinkId !== 'undefined') {
      element
        .setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch((error: any) => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);

          audioOutputCurrentSelect.selectedIndex = 0;
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  function changeAudioDestination() {
    const audioDestination = audioOutputCurrentSelect.value;

    attachSinkId(videoInputCurrentSelect, audioDestination);
  }

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(getDevices)
      .catch((err) => console.log(err));
  }, [videoInputRef, audioOutputRef, videoInputRef]);

  return {
    options: options.reduce((r: any, a: any) => {
      console.log(r);
      r[a.kind] = r[a.kind] || [];
      r[a.kind].push(a);
      return r;
    }, []),
    videoInputRef,
    audioOutputRef,
    audioInputRef,
    audioInputRangeRef,
    audioOutputRangeRef,
    videoInputRangeRef,
    localAudioRef,
    remoteAudioRef,
    videoElemRef,
    start,
    changeAudioDestination,
  };
};

export default useDevices;
