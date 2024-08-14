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
import axios from 'axios';

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
    setIsProcessing(true);

    // 사용자 음성 입력을 메시지로 추가
    addMessage({ sender: 'user', text: transcript });

    try {
      // GPT API 호출
      const response = await axios.post('http://localhost:8080/api/chat', {
        prompt: transcript,
      });

      const gptResponse = response.data.text;

      // GPT의 응답을 메시지로 추가
      addMessage({ sender: 'gpt', text: gptResponse });
      
      // GPT의 응답을 음성으로 재생
      synthesizeSpeechWithWaveSurfer(gptResponse);

    } catch (error) {
      console.error('Error processing transcript:', error);
    }

    // 음성 입력 리셋
    resetTranscript();
  };

  const synthesizeSpeechWithWaveSurfer = async (text) => {
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
