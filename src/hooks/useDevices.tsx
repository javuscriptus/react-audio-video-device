import { useEffect, useRef, useState } from 'react';

const useDevices = () => {
  const audioSourceRef = useRef<HTMLSelectElement>();
  const audioOutputRef = useRef<HTMLSelectElement>();
  const videoSourceRef = useRef<HTMLSelectElement>();
  const videoElemRef = useRef<any>();

  const audioSource = audioSourceRef.current as any;
  const videoElement = videoElemRef.current as any;

  const audioOutput = audioOutputRef.current as any;
  const videoSource = videoSourceRef.current as any;

  const [isRerender, setIsRerender] = useState(false);
  const [options, setOptions] = useState<any>([]);
  console.log('🚀 ➡️ file: useDevices.tsx ➡️ line 17 ➡️ useDevices ➡️ options', options);

  const selectors = [audioSource, audioOutput, videoSource];
  console.log(
    '🚀 ➡️ file: useDevices.tsx ➡️ line 19 ➡️ useDevices ➡️ selectors',
    selectors,
  );

  function getDevices(deviceInfos: any) {
    console.log(options);
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
    console.log('🚀 ➡️ file: useDevices.tsx ➡️ line 70 ➡️ gotStream ➡️ stream', stream);
    window.stream = stream; // make stream available to console
    console.log('🚀 ➡️ file: useDevices.tsx ➡️ line 79 ➡️ gotStream ➡️ stream', stream);
    videoElemRef.current.srcObject = stream;
    // Refresh button list in case labels have become available
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
      audioS = audioSource?.value;
      videoS = videoSource?.value;

      const constraints = {
        audio: { deviceId: audioS ? { exact: audioS } : undefined },
        video: { deviceId: videoS ? { exact: videoS } : undefined },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .then(getDevices)
        .catch((err) => console.log('Ошибка', err));
    }, 1000);
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
          // Jump back to first output device in the list as it's the default.
          audioOutput.selectedIndex = 0;
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  function changeAudioDestination() {
    const audioDestination = audioOutput.value;
    attachSinkId(videoElement, audioDestination);
  }

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(getDevices)
      .catch((err) => console.log(err));
  }, [audioSourceRef.current, audioOutputRef.current, videoSourceRef.current]);

  return {
    options: options.reduce((r: any, a: any) => {
      r[a.kind] = r[a.kind] || [];
      r[a.kind].push(a);
      return r;
    }, []),
    audioSourceRef,
    audioOutputRef,
    videoSourceRef,
    start,
    changeAudioDestination,
  };
};

export default useDevices;
