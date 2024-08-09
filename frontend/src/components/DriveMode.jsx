import React, { useEffect, useState } from 'react';
import {
  DriveModeContainer,
  Circle,
  SpeechIndicator,
  StopButton,
  TranscriptBox,
} from '../style/drive';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import axios from 'axios';
import Indicator from './Indicator';

const DriveMode = ({ addMessage, toggleDriveMode }) => {
  const [isListening, setIsListening] = useState(true);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const { isPlaying, synthesizeSpeech } = useTextToSpeech();
  const [idleTimeout, setIdleTimeout] = useState(null);

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
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [transcript, listening]);

  const handleTranscript = async () => {
    await addMessage({ sender: 'user', text: transcript });

    const gptResponse = '지피티답변입니다';
    setTimeout(async () => {
      await addMessage({ sender: 'gpt', text: gptResponse });
      synthesizeSpeech(gptResponse);
      resetTranscript();
      setIsListening(true);
    }, 2);
  };

  // GPT 응답을 가져오는 함수 (현재 주석 처리됨)
  /*
  const fetchGptResponse = async (userMessage) => {
    try {
      const response = await axios.post('/api/gpt-response', {
        message: userMessage,
      });
      const gptResponse = response.data.text;
      addMessage({ sender: 'gpt', text: gptResponse });
      synthesizeSpeech(gptResponse);
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: true });
    } catch (error) {
      console.error('Error fetching GPT response:', error);
    }
  };
  */

  // STT 중지 및 모드 전환 처리
  const handleStopClick = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    toggleDriveMode();
  };

  return (
    <DriveModeContainer>
      <Indicator />
      {/* <Circle $isListening={isListening}>
        {isListening ? 'Listening...' : 'Tap to Speak'}{' '}
      </Circle>*/}
      {/* {isListening && <SpeechIndicator />}{' '} */}
      {/* STT가 활성화된 경우 인디케이터 표시 */}
      <StopButton onClick={handleStopClick}>X</StopButton> {/* STT 중지 버튼 */}
      <TranscriptBox>{transcript}</TranscriptBox> {/* 실시간 STT 텍스트 표시 */}
    </DriveModeContainer>
  );
};

export default DriveMode;
