import { useState, useEffect } from 'react';
import { RTCSession } from 'jssip';

interface DevicesStateTypes {
  audioInput: null | MediaDeviceInfo[];
  audioOutput: null | MediaDeviceInfo[];
  videoInput: null | MediaDeviceInfo[];
}

export const AudioInputSelector = (props: any) => {
  const [devices, setDevices] = useState<DevicesStateTypes[]>([
    {
      audioInput: null,
      audioOutput: null,
      videoInput: null,
    },
  ]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      const audioInputDevices = devices.filter(function (device) {
        return device.kind === 'audioinput';
      });

      const audioOutputDevices = devices.filter(function (device) {
        return device.kind === 'audiooutput';
      });

      const videoInputDevices = devices.filter(function (device) {
        return device.kind === 'videoinput';
      });

      setDevices([
        {
          audioInput: audioInputDevices,
          audioOutput: audioOutputDevices,
          videoInput: videoInputDevices,
        },
      ]);
    });
  }, []); // Run this effect only once when the component mounts

  function handleChange(event: any) {
    const deviceId = event.target.value;

    setSelectedDeviceId(deviceId);

    props.session.setMicrophone(deviceId); // Set the selected device as the audio input for the RTCSession
  }

  return (
    <div>
      <label htmlFor="audio-input-selector">Audio Input:</label>
      <select id="audio-input-selector" onChange={handleChange} value={selectedDeviceId}>
        {devices.map(function (device) {
          console.log(device);
          return <></>;
          // return (
          //   <option key={device.deviceId} value={device.deviceId}>
          //     {device.label}
          //   </option>
          // );

          {
            device.kind === 'audioinput' &&
              options['audioinput']?.map(({ kind, value, label }: any) => {
                return (
                  <option key={`${kind}_${value}_${label}`} value={value}>
                    {label}
                  </option>
                );
              });
          }
          {
            kind === 'audiooutput' &&
              options['audiooutput']?.map(({ kind, value, label }: any) => {
                return (
                  <option key={`${kind}_${value}_${label}`} value={value}>
                    {label}
                  </option>
                );
              });
          }
          {
            kind === 'videoinput' &&
              options['videoinput']?.map(({ kind, value, label }: any) => {
                return (
                  <option key={`${kind}_${value}_${label}`} value={value}>
                    {label}
                  </option>
                );
              });
          }
        })}
      </select>
    </div>
  );
};
