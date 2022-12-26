import React, { useEffect, useRef } from 'react';
import JsSIP from 'jssip';

import styles from './MicrophoneAudio.module.scss';

export interface MicrophoneAudioProps {
  prop?: string;
}

export function MicrophoneAudio({ prop = 'default value' }: MicrophoneAudioProps) {
  const canvasElement = useRef(null);
  const audioElement = useRef(null);

  useEffect(() => {
    const audioCtx = new AudioContext();
    console.log('🚀 ➡️ file: MicrophoneAudio.tsx:16 ➡️ useEffect ➡️ audioCtx', audioCtx);
    const inputAnalyser = audioCtx.createAnalyser();
    console.log(
      '🚀 ➡️ file: MicrophoneAudio.tsx:18 ➡️ useEffect ➡️ inputAnalyser',
      inputAnalyser,
    );
    const outputAnalyser = audioCtx.createAnalyser();
    console.log(
      '🚀 ➡️ file: MicrophoneAudio.tsx:20 ➡️ useEffect ➡️ outputAnalyser',
      outputAnalyser,
    );
    const canvasCtx = canvasElement.current.getContext('2d');
    console.log(
      '🚀 ➡️ file: MicrophoneAudio.tsx:22 ➡️ useEffect ➡️ canvasCtx',
      canvasCtx,
    );

    JsSIP.debug.enable('JsSIP:*');

    const socket = new JsSIP.WebSocketInterface('ws://localhost:8088/ws');
    console.log('🚀 ➡️ file: MicrophoneAudio.tsx:27 ➡️ useEffect ➡️ socket', socket);

    const ua = new JsSIP.UA({
      uri: 'sip:alice@example.com',
      sockets: socket,
    });
    console.log('🚀 ➡️ file: MicrophoneAudio.tsx:33 ➡️ useEffect ➡️ ua', ua);

    ua.on('connected', () => {
      console.log('Connected');
    });

    ua.on('newRTCSession', (e) => {
      const session = e.session;
      console.log('🚀 ➡️ file: MicrophoneAudio.tsx:41 ➡️ ua.on ➡️ session', session);

      session.on('peerconnection', (data) => {
        console.log('Peerconnection');

        const stream = data.stream;

        audioElement.current.srcObject = stream;

        const source = audioCtx.createMediaStreamSource(stream);

        source.connect(outputAnalyser);

        outputAnalyser.connect(audioCtx.destination);

        drawOutput();
      });
    });

    ua.start();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      const inputSource = audioCtx.createMediaStreamSource(mediaStream);

      inputSource.connect(inputAnalyser);

      const inputDestination = audioCtx.createMediaStreamDestination();
      inputAnalyser.connect(inputDestination);
      drawInput();
    });

    function drawOutput() {
      requestAnimationFrame(drawOutput);
      const dataArray = new Uint8Array(outputAnalyser.frequencyBinCount);
      outputAnalyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvasElement.current.width, canvasElement.current.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();
      const sliceWidth =
        (canvasElement.current.width * 1.0) / outputAnalyser.frequencyBinCount;
      let x = 0;
      for (let i = 0; i < outputAnalyser.frequencyBinCount; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvasElement.current.height) / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvasElement.current.width, canvasElement.current.height / 2);
      canvasCtx.stroke();
    }

    function drawInput() {
      requestAnimationFrame(drawInput);
      const dataArray = new Uint8Array(inputAnalyser.frequencyBinCount);
      inputAnalyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvasElement.current.width, canvasElement.current.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
      canvasCtx.beginPath();
      const sliceWidth =
        (canvasElement.current.width * 1.0) / inputAnalyser.frequencyBinCount;
      let x = 0;
      for (let i = 0; i < inputAnalyser.frequencyBinCount; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvasElement.current.height) / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvasElement.current.width, canvasElement.current.height / 2);
      canvasCtx.stroke();
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasElement} width="400" height="100" />
      <audio ref={audioElement} autoPlay />
    </div>
  );
}
