import { useState } from 'react';
import {
  FooterContainer,
  CategoryButtonContainer,
  CategoryButton,
} from '../../style/gpt';

const GptFooter = ({ addMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage({ sender: 'user', text: inputValue });
      setInputValue('');
      // API 호출하여 GPT 응답 받기 (예시)
      // addMessage({ sender: 'gpt', text: 'GPT 응답 메시지' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleCategoryClick = (category) => {
    addMessage({ sender: 'user', text: category });
    // 여기에서 필요하다면 API 호출하여 GPT 응답 받기 (예시)
    // addMessage({ sender: 'gpt', text: 'GPT 응답 메시지' });
  };

  return (
    <FooterContainer>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message"
        style={{ flex: 1, marginRight: '10px' }}
      />
      <button onClick={handleSendMessage}>Send</button>
      <CategoryButtonContainer>
        <CategoryButton onClick={() => handleCategoryClick('Cat 1')}>
          Cat 1
        </CategoryButton>
        <CategoryButton onClick={() => handleCategoryClick('Cat 2')}>
          Cat 2
        </CategoryButton>
        <CategoryButton onClick={() => handleCategoryClick('Cat 3')}>
          Cat 3
        </CategoryButton>
      </CategoryButtonContainer>
    </FooterContainer>
  );
};

export default GptFooter;
