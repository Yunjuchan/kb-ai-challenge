import styled from 'styled-components';

export const GptContainer = styled.div`
  width: 390px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const HeaderContainer = styled.div`
  background: #60584c;
  width: 100%;
  height: 8vh;
  border-radius: 3px;
`;

export const MainContainer = styled.div`
  background: #fdf7e7;
  width: 390px;
  height: 84vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .introbox {
    width: 380px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    padding: 10px;
    background-color: #fdf7e7;
    font-size: 19px;

    .intro-message {
      width: 60%;
    }

    .intro-image {
      width: 35%;
      height: auto;
      /* border: 1px solid; */
    }
  }

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 12px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: #f3e9d2; /* 스크롤바 트랙 배경색 */
  }

  &::-webkit-scrollbar-thumb {
    background: #c8ad7f; /* 스크롤바 색상 */
    border-radius: 6px; /* 스크롤바 모서리 둥글게 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #b9975b; /* 스크롤바에 마우스를 올렸을 때 색상 */
  }
`;

export const FooterContainer = styled.div`
  background: #fff;
  width: 100%;
  height: 8vh;
  border: 1px solid;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export const ChatBubble = styled.div`
  /* background-color: ${({ isUser }) => (isUser ? '#FFFFFF' : '#FFCC00')}; */
  background-color: ${({ isUser }) => (isUser ? '#FFCC00' : '#FFFFFF')};
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  color: #000;
  padding: 10px;
  border-radius: 15px;
  margin: 5px 0;
  max-width: 70%;
  word-wrap: break-word; /* 단어가 길 경우 줄 바꿈 설정 */
  white-space: pre-wrap; /* 공백 처리 및 자동 줄 바꿈 */
  overflow-wrap: break-word; /* 단어가 길 경우 줄 바꿈 설정 */
`;

export const CategoryButtonContainer = styled.div`
  position: fixed;
  bottom: 10vh;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const CategoryButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
`;
