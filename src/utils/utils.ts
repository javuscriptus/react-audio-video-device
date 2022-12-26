/**
 * Чтобы изменить громкость устройства ввода или вывода, будем использовать библиотеку JSSIP, берем и используем метод setVolume объекта RTCSession
 * TODO: Типизировать!
 */

export const changeVolume = (
  type: 'audioinput' | 'audiooutput' | 'videoinput' | null,
  session: any,
  volume: any,
) => {
  if (!session) {
    return;
  }
  session.setVolume(type, volume);
};

/**
 * Чтобы выбрать конкретное аудио устройство ввода или вывода, используем методы setMicrophone и setSpeaker объекта RTCSession.
 * TODO: Типизировать!
 */

export const selectDevice = (
  type: 'microphone' | 'speaker' | null,
  session: any,
  deviceId: any,
) => {
  console.log(session);
  type === 'microphone' && session.setMicrophone(deviceId);
  type === 'speaker' && session.setSpeaker(deviceId);
};

/**
 * Чтобы выбрать конкретное устройство видеовхода, будем использовать метод getUserMedia объекта RTCSession.
 */

export const selectVideoDevice = (session: any, deviceId: any) => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        deviceId: { exact: deviceId },
      },
    })
    .then(function (stream) {
      session.connection.addStream(stream); // Add the stream to the RTCSession
    });
};

export const getAudioInputDevices = () => {
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
    console.log(audioInputDevices); // Log the list of audio input devices
  });
};
