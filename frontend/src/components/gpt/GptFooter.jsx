import { useState } from 'react';
import {
  FooterContainer,
  CategoryButtonContainer,
  CategoryButton,
  InputField,
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
      <InputField
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="메세지를 입력해주세요" // 여기에 placeholder 속성 그대로 유지
      />

      <button
        onClick={handleSendMessage}
        style={{ backgroundColor: '#ffcc00' }}
      >
        Send
      </button>
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
