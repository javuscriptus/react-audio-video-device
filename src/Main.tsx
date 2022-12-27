import { useEffect, useState } from 'react';
import { AudioControls } from './components';
import { KindType } from './components/AudioControls';
import styles from './App.module.scss';
import { Controller, useForm } from 'react-hook-form';

// extends MediaDeviceInfo
interface DeviceTypes {
  kind: KindType;
  devices: MediaDeviceInfo[];
  value: string;
  groupId?: any;
  label?: any;
  labelBlock?: any;
  toJSON?: any;
}

interface DevicesStateTypes {
  audioinput: DeviceTypes;
  audiooutput: DeviceTypes;
  videoinput: DeviceTypes;
}

const Main = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [devices, setDevices] = useState<DevicesStateTypes>({
    audioinput: { labelBlock: 'Аудиовход', value: '', devices: [], kind: '' },
    audiooutput: { labelBlock: 'Аудиовыход', value: '', devices: [], kind: '' },
    videoinput: { labelBlock: 'Видеовход', value: '', devices: [], kind: '' },
  });
  const onCancel = (e: any) => {
    console.log(e);
    return;
  };

  const onSubmitForm = (data: any) => console.log(data);

  const onSelect = (selectedDevice: string, typeDevice: KindType) => {
    setDevices((prev: any) => {
      return { ...prev, [typeDevice]: { ...prev[typeDevice], selectedDevice } };
    });
  };

  const generateSelectOptions = (kind: KindType = 'audioinput') => {
    return (
      kind !== '' &&
      devices[kind].devices?.map((device) => {
        return {
          value: device.deviceId,
          label: device.label,
        };
      })
    );
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      const audioInputDevicesArray = devices.filter(function (device) {
        return device.kind === 'audioinput';
      });

      const audioOutputDevicesArray = devices.filter(function (device) {
        return device.kind === 'audiooutput';
      });

      const videoInputDevicesArray = devices.filter(function (device) {
        return device.kind === 'videoinput';
      });

      setDevices((prev) => ({
        ...prev,
        audioinput: {
          ...prev.audioinput,
          value: audioInputDevicesArray[0]?.deviceId,
          label: audioInputDevicesArray[0]?.label,
          devices: audioInputDevicesArray,
          kind: 'audioinput',
        },
        audiooutput: {
          ...prev.audiooutput,
          value: audioOutputDevicesArray[0]?.deviceId,
          label: audioOutputDevicesArray[0]?.label,
          devices: audioOutputDevicesArray,
          kind: 'audiooutput',
        },
        videoinput: {
          ...prev.videoinput,
          value: videoInputDevicesArray[0]?.deviceId,
          label: videoInputDevicesArray[0]?.label,
          devices: videoInputDevicesArray,
          kind: 'videoinput',
        },
      }));
    });
  }, []);
  console.log('yo');

  if (!devices.audioinput.value && !devices.audioinput.value) {
    return <></>;
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        control={control}
        name="audioinput"
        render={({ field: { onChange, value } }) => {
          return (
            <AudioControls
              key={`${devices?.audioinput?.value}_${devices?.audioinput?.kind}`}
              labelBlock={devices?.audioinput?.labelBlock}
              volume={value}
              session={true}
              options={generateSelectOptions('audioinput')}
              kind={devices?.audioinput?.kind}
              onSelect={onSelect}
              onChange={onChange}
              selectedDevice={{
                value: devices['audioinput']?.value,
                label: devices['audioinput']?.label,
              }}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="audiooutput"
        render={({ field: { onChange, value } }) => {
          return (
            <AudioControls
              key={`${devices?.audiooutput?.value}_${devices?.audiooutput?.kind}`}
              labelBlock={devices?.audiooutput?.labelBlock}
              volume={value}
              session={true}
              options={generateSelectOptions('audiooutput')}
              kind={devices?.audiooutput?.kind}
              onChange={onChange}
              onSelect={onSelect}
              selectedDevice={{
                value: devices['audiooutput']?.value,
                label: devices['audiooutput']?.label,
              }}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="videoinput"
        render={({ field: { onChange, value } }) => {
          return (
            <AudioControls
              key={`${devices?.videoinput?.value}_${devices?.videoinput?.kind}`}
              labelBlock={devices?.videoinput?.labelBlock}
              volume={value}
              session={true}
              options={generateSelectOptions('videoinput')}
              kind={devices?.videoinput?.kind}
              onChange={onChange}
              onSelect={onSelect}
              selectedDevice={{
                value: devices['videoinput']?.value,
                label: devices['videoinput']?.label,
              }}
            />
          );
        }}
      />
      <div className={styles.actions}>
        <button onClick={onCancel}>Отменить</button>
        <button
          // onClick={onSubmit}
          type="submit"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default Main;
