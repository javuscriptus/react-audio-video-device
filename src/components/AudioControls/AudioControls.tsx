import { forwardRef, useEffect, useState, useRef } from 'react';
// import { RTCSession } from 'jssip';
import { changeVolume, selectDevice } from '@/utils/utils';
import styles from './AudioControls.module.scss';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import cn from 'classnames';
import { VisualizerAudio } from '..';

/**
 * Этот компонент отображает ползунок громкости и выпадающее меню для выбора устройства.
 * Компонент использует привязку useState для сохранения текущего состояния и id выбранного устройства.
 *
 * Функция handleVolumeChange вызывается, когда пользователь перемещает ползунок громкости,
 * + она обновляет состояние компонента.
 * Изменение громкости устройств ввода и вывода звука происходит с помощью функции changeVolume.
 *
 * Функция handleDeviceChange вызывается, когда пользователь выбирает другое устройство из выпадающего меню,
 * + она обновляет состояние компонента и выбранные устройства ввода и вывода звука с помощью функции selectDevice.
 *
 * props:
 * * session - сессия для произведение настроек с самой сессии.
 * * devices - [{deviceId: string, label: string}]
 * * kind - 'audioinput' | 'audiooutput' | 'videoinput' | null
 * * selectedDevice
 */

export type KindType = 'audioinput' | 'audiooutput' | 'videoinput' | '';

interface AudioControlPropsTypes {
  session: any;
  options: any;
  kind: KindType;
  volume: number;
  selectedDevice: { value: string; label: string };
  onSelect: (value: string, typeDevice: KindType) => void;
  onChange: Function;
  labelBlock: string;
}

export const AudioControls = ({
  session,
  options,
  kind,
  volume = 1.0,
  selectedDevice = { value: '', label: '' },
  onSelect = () => null,
  labelBlock,
  onChange,
}: AudioControlPropsTypes) => {
  const audioRef = useRef();
  const [isChecking, setIsChecking] = useState(false);
  // Храним громкость девайса
  const [vol, setVol] = useState(volume);
  // Храним опции для селекта
  const [selectOptions, setSelectOptions] = useState(options);
  // Храним выбранный девайс
  const [selectedOption, setSelectionOption] = useState(selectedDevice || options[0]);

  // Изменение громкости
  const handleVolumeChange = (event: any) => {
    const newVolume = event.target.value;

    setVol(newVolume);

    // TODO: Добавить добавления в localStorage

    // Изменение звука во время звонка
    // changeVolume(kind, session, newVolume);
  };

  // Изменение девайса в селекте
  const handleDeviceChange = (device: any) => {
    setSelectionOption(device);
    onSelect(device, kind);
  };

  useEffect(() => {
    onChange({ volume: vol, selectedOption: selectedOption });
  }, [vol, onChange, selectedOption]);

  return (
    <div className={styles['audio-controls']}>
      <div className={styles.actions}>
        <div className={cn(styles.block, styles['select-block'])}>
          <h2>{labelBlock}</h2>

          <CreatableSelect
            isClearable
            name={kind}
            id={kind}
            onChange={handleDeviceChange}
            defaultValue={selectedOption}
            value={selectedOption}
            options={selectOptions}
            aria-labelledby={kind}
            className={styles.select}
          />
        </div>
        <div className={cn(styles.block, styles.result)}>
          {isChecking ? (
            <VisualizerAudio audioRef={audioRef} />
          ) : (
            <button onClick={() => setIsChecking((prev: any) => !prev)}>Проверить</button>
          )}
        </div>
        <div className={cn(styles.block, styles['range-block'])}>
          {/* <MicrophoneAudio audioRef={audioRef} /> */}

          <input
            type="range"
            name={kind}
            className={styles['volume-slider']}
            min="0"
            max="1"
            step="0.01"
            value={vol}
            onChange={handleVolumeChange}
          />
          <label htmlFor="volume-slider">{Math.round(vol * 100)}</label>
        </div>
      </div>
    </div>
  );
};
