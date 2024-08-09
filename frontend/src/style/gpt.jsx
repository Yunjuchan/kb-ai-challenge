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
    }
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f3e9d2;
  }

  &::-webkit-scrollbar-thumb {
    background: #c8ad7f;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #b9975b;
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

export const ChatBubble = styled.div.attrs(({ $isUser }) => ({
  'data-is-user': $isUser,
}))`
  background-color: ${({ $isUser }) => ($isUser ? '#FFCC00' : '#FFFFFF')};
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  color: #000;
  padding: 10px;
  border-radius: 15px;
  margin: 5px 0;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
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
