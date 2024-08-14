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
  border: 3px solid #dddae1;
`;

export const InputField = styled.input`
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  border: 3px solid #fff;
  color: #000;

  &::placeholder {
    color: #adadad;
    opacity: 1;
    font-size: 17px;
    font-style: italic;
  }
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
  max-width: 77%;
  padding: 14PX 17PX;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  box-shadow:
    0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);

    font-family: 'Malgun Gothic', 'Nanum Gothic', sans-serif; /* 글꼴 설정 */
  letter-spacing: 0.5px; /* 글자 간격 설정 */
  line-height: 1.5; /* 줄 간격 설정 */
  font-weight: 550;
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
