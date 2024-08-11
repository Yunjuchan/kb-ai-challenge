import styled, { keyframes } from 'styled-components';

const breathing = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.8;
  }
`;

export const BreathingCircle = styled.div`
  width: 300px;
  height: 300px;
  background-color: rgba(255, 204, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${breathing} 3s infinite;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
`;
export const EnlargedCircle = styled.div`
  width: 360px;
  height: 360px;
  background-color: #ffcc00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
`;

//

export const DriveModeContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fdf7e7;
`;

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

const bounce = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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
  animation: ${bounce} 1s infinite;
`;

export const StopButton = styled.button`
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: 10px;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.4);
    background: linear-gradient(145deg, #ff3a3a, #c53030);
  }
`;
export const TranscriptBox = styled.div`
  margin-top: 30px;
  padding: 10px;
  width: 80%;
  font-family: 'Helvetica', 'Arial', sans-serif;
  border-radius: 5px;
  color: #000;
  text-align: center;
`;
