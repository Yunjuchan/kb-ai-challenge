import styled, { keyframes } from 'styled-components';

export const DriveModeContainer = styled.div`
  width: 100%;
  height: 84vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fdf7e7;
`;

// const pulse = keyframes`
//   0% { transform: scale(1); opacity: 1; }
//   50% { transform: scale(1.2); opacity: 0.7; }
//   100% { transform: scale(1); opacity: 1; }
// `;

export const Circle = styled.div`
  width: 300px;
  height: 300px;
  background-color: #ffcc00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  font-weight: bold;
  color: #000;
  transition: transform 0.3s ease;
`;

export const SpeechIndicator = styled.div`
  width: 80%;
  height: 20px;
  background: repeating-linear-gradient(
    -45deg,
    yellow,
    yellow 10px,
    transparent 10px,
    transparent 20px
  );
  animation: bounce 1s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const StopButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 10px;
  cursor: pointer;
  font-size: 20px;
`;

export const TranscriptBox = styled.div`
  margin-top: 20px;
  padding: 10px;
  width: 80%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #000;
  text-align: center;
`;
