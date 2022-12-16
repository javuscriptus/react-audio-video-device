import React, { useState, useEffect } from 'react';
import create from 'zustand';
import JsSIP from 'jssip';

export const SoundVolumeSettings = () => {
  const useStore = create((set, get) => ({
    audioInputDevices: [],
    audioOutputDevices: [],
    videoInputDevices: [],
    selectedAudioInputId: null,
    selectedAudioOutputId: null,
    selectedVideoInputId: null,
    audioInputVolume: 1.0,
    audioOutputVolume: 1.0,
    videoInputVolume: 1.0,
    setAudioInputDevices: (devices: MediaDeviceInfo[]) =>
      set((state: any) => ({ audioInputDevices: devices })),
    setAudioOutputDevices: (devices: MediaDeviceInfo[]) =>
      set((state: any) => ({ audioOutputDevices: devices })),
    setVideoInputDevices: (devices: MediaDeviceInfo[]) =>
      set((state: any) => ({ videoInputDevices: devices })),
    setSelectedAudioInputId: (id: string | null) =>
      set((state: any) => ({ selectedAudioInputId: id })),
    setSelectedAudioOutputId: (id: string | null) =>
      set((state: any) => ({ selectedAudioOutputId: id })),
    setSelectedVideoInputId: (id: string | null) =>
      set((state: any) => ({ selectedVideoInputId: id })),
    setAudioInputVolume: (volume: number) =>
      set((state: any) => ({ audioInputVolume: volume })),
    setAudioOutputVolume: (volume: number) =>
      set((state: any) => ({ audioOutputVolume: volume })),
    setVideoInputVolume: (volume: number) =>
      set((state: any) => ({ videoInputVolume: volume })),
  }));

  const {
    audioInputDevices,
    audioOutputDevices,
    videoInputDevices,
    selectedAudioInputId,
    selectedAudioOutputId,
    selectedVideoInputId,
    audioInputVolume,
    audioOutputVolume,
    videoInputVolume,
    setAudioInputDevices,
    setAudioOutputDevices,
    setVideoInputDevices,
    setSelectedAudioInputId,
    setSelectedAudioOutputId,
    setSelectedVideoInputId,
    setAudioInputVolume,
    setAudioOutputVolume,
    setVideoInputVolume,
  }: {
    audioInputDevices: { label: string; deviceId: string }[];
    audioOutputDevices: MediaDeviceInfo[];
    videoInputDevices: MediaDeviceInfo[];
    selectedAudioInputId: string | null;
    selectedAudioOutputId: string | null;
    selectedVideoInputId: string | null;
    audioInputVolume: number;
    audioOutputVolume: number;
    videoInputVolume: number;
    setAudioInputDevices: (devices: MediaDeviceInfo[]) => void;
    setAudioOutputDevices: (devices: MediaDeviceInfo[]) => void;
    setVideoInputDevices: (devices: MediaDeviceInfo[]) => void;
    setSelectedAudioInputId: (id: string | null) => void;
    setSelectedAudioOutputId: (id: string | null) => void;
    setSelectedVideoInputId: (id: string | null) => void;
    setAudioInputVolume: (volume: number) => void;
    setAudioOutputVolume: (volume: number) => void;
    setVideoInputVolume: (volume: number) => void;
  } = useStore(
    (set: any) => ({
      audioInputDevices: [{}],
      audioOutputDevices: [],
      videoInputDevices: [],
      selectedAudioInputId: localStorage.getItem('audioInputId'),
      selectedAudioOutputId: localStorage.getItem('audioOutputId'),
      selectedVideoInputId: localStorage.getItem('videoInputId'),
      audioInputVolume:
        parseFloat(localStorage.getItem('audioInputVolume') as any) || 1.0,
      audioOutputVolume:
        parseFloat(localStorage.getItem('audioOutputVolume') as any) || 1.0,
      videoInputVolume:
        parseFloat(localStorage.getItem('videoInputVolume') as any) || 1.0,
      setAudioOutputDevices: (devices: MediaDeviceInfo[]) =>
        set((state: any) => ({ ...state, audioOutputDevices: devices })),

      setVideoInputDevices: (devices: MediaDeviceInfo[]) =>
        set((state: any) => ({ ...state, videoInputDevices: devices })),
      setSelectedAudioInputId: (id: string) =>
        set((state: any) => ({ ...state, selectedAudioInputId: id })),
      setSelectedAudioOutputId: (id: string) =>
        set((state: any) => ({ ...state, selectedAudioOutputId: id })),
      setSelectedVideoInputId: (id: string) =>
        set((state: any) => ({ ...state, selectedVideoInputId: id })),
      setAudioInputVolume: (volume: number) =>
        set((state: any) => ({ ...state, audioInputVolume: volume })),
      setAudioOutputVolume: (volume: number) =>
        set((state: any) => ({ ...state, audioOutputVolume: volume })),
      setVideoInputVolume: (volume: number) =>
        set((state: any) => ({ ...state, videoInputVolume: volume })),
    }),
    // [],
  );

  const getMediaDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(
      '🚀 ➡️ file: SoundVolumeSettings.tsx:113 ➡️ getMediaDevices ➡️ devices',
      devices,
    );
    const audioInput = devices.filter((device) => {
      console.log(device);
      console.log(device.kind === 'audioinput');

      if (device.kind === 'audioinput') {
        return device;
      }

      return false;
    });

    setAudioInputDevices(audioInput);
    const audioOutput = devices.filter((device) => device.kind === 'audiooutput');
    setAudioOutputDevices(audioOutput);
    const videoInput = devices.filter((device) => device.kind === 'videoinput');
    setVideoInputDevices(videoInput);
  };
  useEffect(() => {
    console.log('функция выполнилась в useEffect');
    getMediaDevices();
  }, []);
  console.log({
    audioInputDevices,
    audioOutputDevices,
    videoInputDevices,
    selectedAudioInputId,
    selectedAudioOutputId,
    selectedVideoInputId,
  });
  const changeAudioInput = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudioInputId(event.target.value);
  };

  const changeAudioOutput = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudioOutputId(event.target.value);
  };

  const changeVideoInput = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVideoInputId(event.target.value);
  };

  const changeAudioInputVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioInputVolume(event.target.value as any);
  };

  const changeAudioOutputVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioOutputVolume(event.target.value as any);
  };

  const changeVideoInputVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoInputVolume(event.target.value as any);
  };

  const saveSettings = () => {
    localStorage.setItem('audioInputId', selectedAudioInputId as any);
    localStorage.setItem('audioOutputId', selectedAudioOutputId as any);
    localStorage.setItem('videoInputId', selectedVideoInputId as any);
    localStorage.setItem('audioInputVolume', audioInputVolume as any);
    localStorage.setItem('audioOutputVolume', audioOutputVolume as any);
    localStorage.setItem('videoInputVolume', videoInputVolume as any);
  };

  const startCall = () => {
    const options = {
      media: {
        audio: {
          deviceId: selectedAudioInputId,
          outputId: selectedAudioOutputId,
          volume: audioInputVolume,
        },
        video: {
          deviceId: selectedVideoInputId,
          volume: videoInputVolume,
        },
      },
    };
    JsSIP.WebRTC.getUserMedia(options);
  };

  const soundCheck = () => {
    const options = {
      media: {
        audio: {
          deviceId: selectedAudioInputId,
          outputId: selectedAudioOutputId,
          volume: audioInputVolume,
        },
      },
    };
    JsSIP.WebRTC.getUserMedia(options);
  };

  return (
    <>
      <h3>Audio Input Devices:</h3>
      <select
        onChange={changeAudioInput}
        value={selectedAudioInputId || audioInputDevices[0].deviceId}
      >
        {audioInputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {console.log({ device, audioInputDevices })}

            {device.label}
          </option>
        ))}
      </select>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={audioInputVolume}
        onChange={changeAudioInputVolume}
      />

      <h3>Audio Output Devices:</h3>
      <select onChange={changeAudioOutput} value={selectedAudioOutputId || ''}>
        {audioOutputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={audioOutputVolume}
        onChange={changeAudioOutputVolume}
      />

      <h3>Video Input Devices:</h3>
      <select onChange={changeVideoInput} value={selectedVideoInputId || ''}>
        {videoInputDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={videoInputVolume}
        onChange={changeVideoInputVolume}
      />

      <button onClick={startCall}>Start Call</button>
      <button onClick={soundCheck}>Sound Check</button>
      <button onClick={saveSettings}>Save Settings</button>
    </>
  );
};
