import React, { useEffect, useState } from 'react';

function useMediaDevices(): {
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  videoOutputDevices: MediaDeviceInfo[];
  selectedAudioInputId: string | null;
  selectedAudioOutputId: string | null;
  selectedVideoOutputId: string | null;
  audioInputVolume: number;
  audioOutputVolume: number;
  videoOutputVolume: number;
  changeAudioInput: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  changeAudioOutput: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  changeVideoOutput: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  changeAudioInputVolume: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeAudioOutputVolume: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeVideoOutputVolume: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoOutputDevices, setVideoOutputDevices] = useState<MediaDeviceInfo[]>([]);

  const [selectedAudioInputId, setSelectedAudioInputId] = useState<string | null>(null);
  const [selectedAudioOutputId, setSelectedAudioOutputId] = useState<string | null>(null);
  const [selectedVideoOutputId, setSelectedVideoOutputId] = useState<string | null>(null);

  const [audioInputVolume, setAudioInputVolume] = useState(1.0);
  const [audioOutputVolume, setAudioOutputVolume] = useState(1.0);
  const [videoOutputVolume, setVideoOutputVolume] = useState(1.0);

  useEffect(() => {
    async function getMediaDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioInputDevices(devices.filter((device) => device.kind === 'audioinput'));
      setAudioOutputDevices(devices.filter((device) => device.kind === 'audiooutput'));
      setVideoOutputDevices(devices.filter((device) => device.kind === 'videooutput'));
    }
    getMediaDevices();
  }, []);

  const audioInputDevice = audioInputDevices.find(
    (device) => device.deviceId === selectedAudioInputId,
  );
  const audioOutputDevice = audioOutputDevices.find(
    (device) => device.deviceId === selectedAudioOutputId,
  );

  useEffect(() => {
    async function getMediaDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioInputDevices(devices.filter((device) => device.kind === 'audioinput'));
      setAudioOutputDevices(devices.filter((device) => device.kind === 'audiooutput'));
      setVideoOutputDevices(devices.filter((device) => device.kind === 'videooutput'));
    }
    getMediaDevices();
  }, []);

  const videoOutputDevice = videoOutputDevices.find(
    (device) => device.deviceId === selectedVideoOutputId,
  );

  const changeAudioInput = (event) => {
    setSelectedAudioInputId(event.target.value);
  };

  const changeAudioOutput = (event) => {
    setSelectedAudioOutputId(event.target.value);
  };

  const changeVideoOutput = (event) => {
    setSelectedVideoOutputId(event.target.value);
  };

  const changeAudioInputVolume = (event) => {
    setAudioInputVolume(event.target.value);
  };

  const changeAudioOutputVolume = (event) => {
    setAudioOutputVolume(event.target.value);
  };

  const changeVideoOutputVolume = (event) => {
    setVideoOutputVolume(event.target.value);
  };

  return (
    <>
      <h3>Audio Input Devices:</h3>
      <select onChange={changeAudioInput} value={selectedAudioInputId}>
        {audioInputDevices.map((device) => (
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
        value={audioInputVolume}
        onChange={changeAudioInputVolume}
      />

      <h3>Audio Output Devices:</h3>
      <select onChange={changeAudioOutput} value={selectedAudioOutputId}>
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

      <h3>Video Output Devices:</h3>
      <select onChange={changeVideoOutput} value={selectedVideoOutputId}>
        {videoOutputDevices.map((device) => (
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
        value={videoOutputVolume}
        onChange={changeVideoOutputVolume}
      />
    </>
  );
}
