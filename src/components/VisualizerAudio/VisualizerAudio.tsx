import React, { RefObject, useEffect, useRef } from 'react';
import JsSIP from 'jssip';

import styles from './VisualizerAudio.module.scss';

export interface VisualizerAudioProps {
  // audioRef: RefObject<HTMLAudioElement>;
  audioRef: any;
}

// Визуализатор звука
export function VisualizerAudio({ audioRef }: VisualizerAudioProps) {
  const canvasElement = useRef<any>();

  const currentCanvasElement = canvasElement && canvasElement.current;
  const currentAudioElement = audioRef && audioRef.current;

  useEffect(() => {
    // создаем экземпляр класса AudioContext
    const audioCtx = new AudioContext();

    // Создаем экземпляр класса AnalyserNode для анализа аудио-данных
    const inputAnalyser = audioCtx.createAnalyser();

    // Создаем экземпляр класса AnalyserNode для анализа аудио-данных
    const outputAnalyser = audioCtx.createAnalyser();

    // Храним контекст рисования на холсте, или null, если идентификатор контекста не определён.
    // Объект, который предоставляет методы и свойства для рисования и манипулирования изображениями и графикой на элементе canvas на странице.
    // Контекстный объект включает в себя информацию о цветах, ширине линий, шрифтах и других графических параметрах, которые могут быть нарисованы на холсте.
    const canvasCtxTemp = currentCanvasElement?.getContext('2d');

    // Если контекст есть, тогда присваиваем новой переменной его и типизируем.
    const canvasCtx: CanvasRenderingContext2D = canvasCtxTemp;

    // Включаем дэбаг JSSIP
    JsSIP.debug.enable('JsSIP:*');

    const socket = new JsSIP.WebSocketInterface('ws://localhost:8088/ws');

    const ua = new JsSIP.UA({
      uri: 'sip:alice@example.com',
      sockets: socket,
    });

    ua.on('connected', () => {
      console.log('Connected');
    });

    ua.on('newRTCSession', (e: any) => {
      const session = e.session;

      // Успешное налаживание связи между разговаривающими
      session.on('peerconnection', (data: any) => {
        console.log('Peerconnection');

        const stream = data.stream;

        // Если Ref успешно прикрепился и элемент существует
        if (currentAudioElement) {
          // присваиваем ему поток
          currentAudioElement.srcObject = stream;
          // Создаем экземпляр класса MediaStreamSourceNode с помощью метода createMediaStreamSource из объекта MediaStream, указанного в переменной stream.
          const source = audioCtx.createMediaStreamSource(stream);
          // Соединяем
          source.connect(outputAnalyser);

          outputAnalyser.connect(audioCtx.destination);

          drawOutput();
        }
      });
    });

    ua.start();

    // Получаем объект MediaStream с аудио-данными устройств
    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      /*
        createMediaStreamSource() - это метод AudioContext'а (new AudioContext()). 
        Он используется для создания нового объекта MediaStreamAudioSourceNode с учетом переданного медиапотока (в нашем случае из MediaDevices.getUserMedia экземпляра), 
        который затем можно воспроизводить, вертеть, крутить и управлять.
      */
      const inputSource = audioCtx.createMediaStreamSource(mediaStream);

      inputSource.connect(inputAnalyser);

      const inputDestination = audioCtx.createMediaStreamDestination();

      inputAnalyser.connect(inputDestination);

      drawInput();
    });

    // Две функции: drawOutput и drawInput
    // Используются для отрисовки аудио-данных на элементе Canvas.
    // Обе функции рисуют линию на элементе Canvas, которая представляет аудио-данные в виде отсчетов во временной области.
    // Обе функции устанавливают толщину линии с помощью метода lineWidth. Это позволяет настроить толщину линии, которая будет рисоваться на элементе Canvas.

    // Функция drawOutput использует узел outputAnalyser для получения аудио-данных и рисует их с помощью методов fillRect и stroke у контекста Canvas.
    function drawOutput() {
      // Метод requestAnimationFrame нужна для вызова самой себя рекурсивно, дабы обеспечить постоянное обновление отрисовки.
      requestAnimationFrame(drawOutput);

      const dataArray = new Uint8Array(outputAnalyser.frequencyBinCount);
      /* 
        Метод getByteTimeDomainData для получения массива аудио-данных, которые затем используются для отрисовки на элементе Canvas.
        Он преобразует аудио-данные в байты и заполняет указанный массив с помощью этих байтов. 
        Он также возвращает массив с аудио-данными, которые представлены в виде timestamp во временной области.
      */
      outputAnalyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';

      // Если элемент Canvas доступен
      if (currentCanvasElement) {
        // canvasCtx используется для отрисовки в Canvas
        canvasCtx.fillRect(0, 0, currentCanvasElement.width, currentCanvasElement.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();

        const sliceWidth =
          (currentCanvasElement.width * 1.0) / outputAnalyser.frequencyBinCount;

        let x = 0;

        /* 
          Перебираем все элементы массива аудио-данных (dataArray) и рисуем линию в Canvas, соединяя соседние точки. 
          Для этого используем метод lineTo. 
          Переменная sliceWidth определяет ширину среза данных, которая равна ширине элемента Canvas разделенной на количество элементов в массиве аудио-данных. 
          Это позволяет сопоставить каждый элемент массива с соответствующей шириной среза на элементе Canvas.
        */
        for (let i = 0; i < outputAnalyser.frequencyBinCount; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * currentCanvasElement.height) / 2;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        canvasCtx.lineTo(currentCanvasElement.width, currentCanvasElement.height / 2);
        // Вызываем метод stroke, который рисует линию на элементе Canvas.
        // Этот метод использует все настройки, установленные с помощью методов moveTo, lineTo, strokeStyle и lineWidth для отрисовки линии на элементе Canvas.
        canvasCtx.stroke();
      }
    }

    // Аналогично drawOutput, функция drawInput использует узел inputAnalyser для получения аудио-данных и рисует их также с помощью методов fillRect и stroke.
    function drawInput() {
      // Метод requestAnimationFrame нужна для вызова самой себя рекурсивно, дабы обеспечить постоянное обновление отрисовки.
      requestAnimationFrame(drawInput);
      const dataArray = new Uint8Array(inputAnalyser.frequencyBinCount);
      /* 
        Метод getByteTimeDomainData для получения массива аудио-данных, которые затем используются для отрисовки на элементе Canvas.
        Он преобразует аудио-данные в байты и заполняет указанный массив с помощью этих байтов. 
        Он также возвращает массив с аудио-данными, которые представлены в виде timestamp во временной области.
      */
      inputAnalyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';

      // Если элемент Canvas доступен
      if (currentCanvasElement) {
        // canvasCtx используется для отрисовки в Canvas
        canvasCtx.fillRect(0, 0, currentCanvasElement.width, currentCanvasElement.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
        canvasCtx.beginPath();

        const sliceWidth =
          (currentCanvasElement.width * 1.0) / inputAnalyser.frequencyBinCount;

        let x = 0;
        /* 
          Перебираем все элементы массива аудио-данных (dataArray) и рисуем линию в Canvas, соединяя соседние точки. 
          Для этого используем метод lineTo. 
          Переменная sliceWidth определяет ширину среза данных, которая равна ширине элемента Canvas разделенной на количество элементов в массиве аудио-данных. 
          Это позволяет сопоставить каждый элемент массива с соответствующей шириной среза на элементе Canvas.
        */
        for (let i = 0; i < inputAnalyser.frequencyBinCount; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * currentCanvasElement.height) / 2;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        // Вызываем метод stroke, который рисует линию на элементе Canvas.
        // Этот метод использует все настройки, установленные с помощью методов moveTo, lineTo, strokeStyle и lineWidth для отрисовки линии на элементе Canvas.
        canvasCtx.lineTo(currentCanvasElement.width, currentCanvasElement.height / 2);
        canvasCtx.stroke();
      }
    }
  }, []);

  if (!canvasElement && !currentAudioElement) {
    return <></>;
  }

  return (
    <div>
      <canvas ref={currentCanvasElement} width="300" height="100" />
      <audio ref={currentAudioElement} autoPlay />
    </div>
  );
}
