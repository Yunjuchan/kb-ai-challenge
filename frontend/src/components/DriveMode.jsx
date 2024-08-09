import React, { useEffect, useRef, useState } from 'react';
import {
  DriveModeContainer,
  Circle,
  StopButton,
  TranscriptBox,
} from '../style/drive'; // 스타일드 컴포넌트 임포트
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'; // STT (Speech-To-Text) 라이브러리 임포트
import { useTextToSpeech } from '../hooks/useTextToSpeech'; // TTS (Text-To-Speech) 훅 임포트
import WaveSurfer from 'wavesurfer.js'; // 파형 표시를 위한 라이브러리 임포트

const DriveMode = ({ addMessage, toggleDriveMode }) => {
  const [isListening, setIsListening] = useState(true); // STT 활성화 여부 상태 관리
  const { transcript, resetTranscript, listening } = useSpeechRecognition(); // STT 관련 훅에서 필요한 속성 가져오기
  const { synthesizeSpeech } = useTextToSpeech(); // TTS 관련 훅
  const [idleTimeout, setIdleTimeout] = useState(null); // 유휴 시간 타이머 상태 관리
  const waveformRef = useRef(null); // WaveSurfer를 위한 DOM 참조
  const [waveSurfer, setWaveSurfer] = useState(null); // WaveSurfer 인스턴스 상태 관리

  // STT 시작 및 중지 관리
  useEffect(() => {
    if (isListening && !listening) {
      // STT를 시작
      SpeechRecognition.startListening({ continuous: true });
    }

    return () => {
      // 컴포넌트가 언마운트될 때 STT 중지
      SpeechRecognition.stopListening();
    };
  }, [isListening, listening]);

  // transcript가 존재할 때, 일정 시간 후 handleTranscript 함수 호출
  useEffect(() => {
    console.log('listening실시간', listening);
    if (transcript && !listening) {
      // setIsListening(false);
      console.log('isListening22', isListening);
      const timer = setTimeout(() => {
        handleTranscript();
      }, 2000); // 2초 후에 handleTranscript 호출

      return () => clearTimeout(timer); // 타이머를 정리
    }
  }, [transcript, listening]);

  // WaveSurfer 인스턴스 생성 및 초기화
  useEffect(() => {
    if (waveformRef.current && !waveSurfer) {
      const ws = WaveSurfer.create({
        container: waveformRef.current, // 파형이 표시될 DOM 요소
        waveColor: '#ddd', // 파형의 색상
        progressColor: '#ffcc00', // 재생된 부분의 색상
        cursorColor: '#ffcc00', // 재생 커서의 색상
        barWidth: 9, // 파형의 바 두께
        barHeight: 2, // 파형의 바 높이 비율 (기본 값은 1)
        barGap: 3, // 바 사이의 간격 (0이면 붙어 있음)
        height: 200, // 파형의 높이
        responsive: true, // 반응형으로 설정
        interact: true, // 파형을 클릭하여 재생 위치를 변경할 수 있는지 여부
        hideScrollbar: true, // 스크롤바 숨기기
        normalize: true, // 오디오 파형의 모든 부분을 최대 볼륨으로 정규화
      });
      setWaveSurfer(ws); // WaveSurfer 인스턴스를 상태로 저장
    }
  }, [waveformRef, waveSurfer]);

  // 사용자 입력(transcript)을 처리하고 GPT 응답을 생성하는 함수
  const handleTranscript = async () => {
    await addMessage({ sender: 'user', text: transcript }); // 사용자 메시지를 추가

    const gptResponse =
      '입주자대표회의는 해당 준칙을 참고해 자기 단지에 맞는 ‘공동주택 관리규약’을 정하게 된다.';
    setTimeout(async () => {
      await addMessage({ sender: 'gpt', text: gptResponse }); // GPT 응답을 추가
      synthesizeSpeechWithWaveSurfer(gptResponse); // TTS와 WaveSurfer를 사용하여 응답 재생
      resetTranscript(); // STT 텍스트 초기화
      setIsListening(true); // 다시 STT를 활성화
    }, 2);
  };

  // TTS와 WaveSurfer를 사용하여 음성 재생
  const synthesizeSpeechWithWaveSurfer = async (text) => {
    const audioUrl = await synthesizeSpeech(text); // TTS를 사용하여 음성 URL 생성
    if (waveSurfer) {
      waveSurfer.load(audioUrl); // WaveSurfer에 음성 로드
      waveSurfer.on('ready', () => {
        waveSurfer.play(); // 재생 준비가 되면 재생 시작
      });
      waveSurfer.on('finish', () => {
        waveSurfer.stop(); // 재생이 끝나면 멈춤
      });
    }
  };

  // STT 중지 및 모드 전환 처리
  const handleStopClick = () => {
    SpeechRecognition.stopListening(); // STT 중지
    setIsListening(false); // STT 비활성화
    toggleDriveMode(); // 드라이브 모드 전환
  };
  console.log('transcript', transcript);
  console.log('listening', listening);
  console.log('isListening', isListening);

  // console.log('isGptSpeaking', isGptSpeaking);

  return (
    <DriveModeContainer>
      <div style={{ width: '330px' }}>
        <div ref={waveformRef} id="waveform"></div> {/* WaveSurfer 파형 표시 */}
      </div>
      <StopButton onClick={handleStopClick}>X</StopButton> {/* STT 중지 버튼 */}
      <TranscriptBox>{transcript}</TranscriptBox>{' '}
      {/* STT로 받아온 텍스트 표시 */}
    </DriveModeContainer>
  );
};

export default DriveMode;
