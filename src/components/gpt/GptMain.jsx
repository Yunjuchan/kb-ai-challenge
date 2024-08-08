import React, { useEffect, useRef } from 'react';
import { MainContainer, ChatBubble } from '../../style/gpt';
import chatbotImage from '../../assets/images/chatbot.png';

const GptMain = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <MainContainer>
      <div className="introbox">
        <div className="intro-message">
          <div>
            <span style={{ color: '#4682B4 ' }}>오기선</span>
            님, 안녕하세요
          </div>
          <div>
            <br /> 금융지식도우미 챗봇입니다.
          </div>
          <p style={{ fontSize: '15px', color: '#808080' }}>
            <br /> 어떤 지식을 알려드릴까요?
          </p>
        </div>
        <img src={chatbotImage} alt="chatbot logo" className="intro-image" />
      </div>
      {messages.map((message, index) => (
        <ChatBubble key={index} isUser={message.sender === 'user'}>
          {message.text}
        </ChatBubble>
      ))}
      <div ref={endOfMessagesRef} />
    </MainContainer>
  );
};

export default GptMain;
