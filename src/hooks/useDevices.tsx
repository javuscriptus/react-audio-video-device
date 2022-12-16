import { Ref, RefObject, useEffect, useRef, useState } from 'react';

import { useSettingsStore } from '@/store/store';

// Renamed the variable after your comment.
var peerConnection = new RTCPeerConnection({
  iceServers: [],
});

const useDevices = () => {
  let localStream = null;

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
    // Получаем видеодорожку из потока (stream)
    const videoTracks = stream.getVideoTracks();
    console.log('🚀 ➡️ file: useDevices.tsx:98 ➡️ gotStream ➡️ videoTracks', videoTracks);

    /**
     * Create a new audio context and build a stream source,
     * stream destination and a gain node. Pass the stream into
     * the mediaStreamSource so we can use it in the Web Audio API.
     * ==================
     * Создаем новый аудиоконтекст и создаем source поток,
     * конечное место потока и GAIN узел. Передаем поток в
     * source MediaStreamSource, чтобы мы могли использовать в Web Audio API.
     */
    const context = new AudioContext();
    console.log('🚀 ➡️ file: useDevices.tsx:110 ➡️ gotStream ➡️ context', context);
    const mediaStreamSource = context.createMediaStreamSource(stream);
    console.log(
      '🚀 ➡️ file: useDevices.tsx:112 ➡️ gotStream ➡️ mediaStreamSource',
      mediaStreamSource,
    );
    const mediaStreamDestination = context.createMediaStreamDestination();
    console.log(
      '🚀 ➡️ file: useDevices.tsx:114 ➡️ gotStream ➡️ mediaStreamDestination',
      mediaStreamDestination,
    );
    const gainNode = context.createGain();
    console.log('🚀 ➡️ file: useDevices.tsx:116 ➡️ gotStream ➡️ gainNode', gainNode);

    /**
     * Connect the stream to the gainNode so that all audio
     * passes through the gain and can be controlled by it.
     * Then pass the stream from the gain to the mediaStreamDestination
     * which can pass it back to the RTC client.
     * ===================
     * Подключите поток к GAIN узлу, чтобы все аудио
     * проходит через GAIN и он смог управлять звуком.
     * Затем передаем поток из GAIN в mediaStreamDestination
     * который в свою очередь осуществит возвращение клиенту RTC.
     */
    mediaStreamSource.connect(gainNode);
    gainNode.connect(mediaStreamDestination);

    /**
     * Change the gain levels on the input selector.
     * ===================
     * Изменяем уровни звука обращаясь к этой функции.
     */
    const changeValue = (event) => {
      gainNode.gain.value = event.target.value;
    };

    /**
     * The mediaStreamDestination.stream outputs a MediaStream object
     * containing a single AudioMediaStreamTrack. Add the video track
     * to the new stream to rejoin the video with the controlled audio.
     * ==================
     * mediaStreamDestination.stream выводит объект MediaStream
     * содержащий одну дорожку аудиомедиапотока. Добавляем видеодорожку
     * к новому потоку, чтобы объединить контролируемый звук с видео.
     */
    const controlledStream = mediaStreamDestination.stream;

    for (const videoTrack of videoTracks) {
      controlledStream.addTrack(videoTrack);
    }

    /**
     * Use the stream that went through the gainNode. This
     * is the same stream but with altered input volume levels.
     * ==================
     * Используем поток, прошедший через GainNode.
     * Это, по сути, тот же поток, но с измененным уровнем громкости входного сигнала.
     */

    videoElemRef.current.srcObject = controlledStream;
    localStream = controlledStream;
    peerConnection.addStream(controlledStream);

    // window.stream = stream;

    // videoElemRef.current.srcObject = stream;

    console.log('.........', navigator.mediaDevices.enumerateDevices());

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

  const handleVolumeElement = () => {};

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
