import { useState } from 'react';
import {
  FooterContainer,
  CategoryButtonContainer,
  CategoryButton,
  InputField,
} from '../../style/gpt';
import axios from 'axios';

const GptFooter = ({ addMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { sender: 'user', text: inputValue };
      addMessage(userMessage);
      setInputValue('');
  
      try {
        const response = await axios.post('http://localhost:8080/api/chat', {
          prompt: inputValue,
        });
  
        const gptMessage = { sender: 'gpt', text: response.data.text };
        addMessage(gptMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleCategoryClick = (category) => {
    addMessage({ sender: 'user', text: category });
    // 필요하다면 카테고리 클릭 시 API 호출하여 응답 받기
  };

  return (
    <FooterContainer>
      <InputField
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="메세지를 입력해주세요"
      />

      <button
        onClick={handleSendMessage}
        style={{ backgroundColor: '#ffcc00' }}
      >
        Send
      </button>
      {/* <CategoryButtonContainer>
        <CategoryButton onClick={() => handleCategoryClick('Cat 1')}>
          Cat 1
        </CategoryButton>
        <CategoryButton onClick={() => handleCategoryClick('Cat 2')}>
          Cat 2
        </CategoryButton>
        <CategoryButton onClick={() => handleCategoryClick('Cat 3')}>
          Cat 3
        </CategoryButton>
      </CategoryButtonContainer> */}
    </FooterContainer>
  );
};

export default GptFooter;
