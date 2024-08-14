import { useState, useEffect } from 'react';
import axios from 'axios';

import { GptContainer } from '../style/gpt';
import GptHeader from '../components/gpt/GptHeader';
import GptMain from '../components/gpt/GptMain';
import GptFooter from '../components/gpt/GptFooter';
import DriveMode from '../components/DriveMode';

const GptPage = () => {
  const [messages, setMessages] = useState([
  
  ]);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [isDriveMode, setIsDriveMode] = useState(false);
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const toggleDriveMode = () => {
    setIsDriveMode(!isDriveMode);
  };
  
  useEffect(() => {
    if (!sessionStarted) {
      axios
        .post('http://localhost:8080/api/chat/new-session')
        .then((response) => {
          setMessages((prev) => [
            ...prev,
            { sender: 'gpt', text: response.data.text },
          ]);
          setSessionStarted(true); // 세션 시작 플래그를 설정
        })
        .catch((error) => {
          console.error('Error starting session:', error);
        });
    }
  }, [sessionStarted]);
  return (
    <GptContainer>
      <GptHeader toggleDriveMode={toggleDriveMode} />
      {isDriveMode ? (
        <DriveMode addMessage={addMessage} toggleDriveMode={toggleDriveMode} />
      ) : (
        <GptMain messages={messages} />
      )}
      {!isDriveMode && <GptFooter addMessage={addMessage} />}
    </GptContainer>
  );
};

export default GptPage;
