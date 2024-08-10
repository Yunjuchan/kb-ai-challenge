import React, { useEffect, useRef, useState } from 'react';
import {
  DriveModeContainer,
  StopButton,
  TranscriptBox,
  BreathingCircle,
  EnlargedCircle,
} from '../style/drive';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import WaveSurfer from 'wavesurfer.js';

const DriveMode = ({ addMessage, toggleDriveMode }) => {
  const [isListening, setIsListening] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const { synthesizeSpeech } = useTextToSpeech();
  const waveformRef = useRef(null);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
    if (isListening && !listening) {
      SpeechRecognition.startListening({ continuous: true });
    }

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [isListening, listening]);

  useEffect(() => {
    if (transcript && !listening) {
      const timer = setTimeout(() => {
        handleTranscript();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (waveformRef.current && !waveSurfer) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#ffcc00',
        cursorColor: '#ffcc00',
        barWidth: 9,
        barHeight: 2,
        barGap: 3,
        height: 200,
        responsive: true,
        interact: true,
        hideScrollbar: true,
        normalize: true,
      });
      setWaveSurfer(ws);
    }
  }, [waveformRef, waveSurfer]);

  const handleTranscript = async () => {
    await setIsProcessing(true);

    await addMessage({ sender: 'user', text: transcript });
    const gptResponse =
      '입주자대표회의는 해당 준칙을 참고해 자기 단지에 맞는 ‘공동주택 관리규약’을 정하게 된다.';
    resetTranscript();

    await addMessage({ sender: 'gpt', text: gptResponse });
    synthesizeSpeechWithWaveSurfer(gptResponse);
  };

  const synthesizeSpeechWithWaveSurfer = async (text) => {
    console.log('isProcessing2', isProcessing);

    const audioUrl = await synthesizeSpeech(text);
    if (waveSurfer) {
      waveSurfer.load(audioUrl);
      waveSurfer.on('ready', () => {
        waveSurfer.play();
      });
      waveSurfer.on('finish', () => {
        waveSurfer.stop();
        setIsProcessing(false);
        setIsListening(true);
      });
    }
  };

  const handleStopClick = () => {
    setIsListening(false);
    setIsProcessing(false);
    SpeechRecognition.stopListening();
    toggleDriveMode();
  };

  return (
    <DriveModeContainer>
      {!transcript && isListening && !isProcessing && (
        <BreathingCircle>말하기 시작해주세요</BreathingCircle>
      )}
      {transcript && isListening && !isProcessing && (
        <EnlargedCircle>내용 듣고있습니다.</EnlargedCircle>
      )}
      <div style={{ width: '330px' }}>
        <div
          ref={waveformRef}
          id="waveform"
          style={{
            opacity: isProcessing ? 1 : 0,
            transition: 'opacity 0.1s ease',
          }}
        ></div>
      </div>
      <StopButton onClick={handleStopClick}>X</StopButton>
      <TranscriptBox>{transcript}</TranscriptBox>
    </DriveModeContainer>
  );
};

export default DriveMode;
