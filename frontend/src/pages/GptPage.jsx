import { useState } from 'react';
import { GptContainer } from '../style/gpt';
import GptHeader from '../components/gpt/GptHeader';
import GptMain from '../components/gpt/GptMain';
import GptFooter from '../components/gpt/GptFooter';

const GptPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'Hello!' },
    { sender: 'gpt', text: 'Hi! How can I help you today?' },
    { sender: 'user', text: 'I would like to know about the weather.' },
    {
      sender: 'gpt',
      text: 'Sure, the weather today is sunny with a chance of rain in the afternoon.',
    },
  ]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <GptContainer>
      <GptHeader />
      <GptMain messages={messages} />
      <GptFooter addMessage={addMessage} />
    </GptContainer>
  );
};

export default GptPage;
