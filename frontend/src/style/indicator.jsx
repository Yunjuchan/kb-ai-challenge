import styled, { keyframes } from 'styled-components';

export const IndicatorContainer = styled.div`
  width: 89%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
`;

const stretch1 = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
`;

const stretch2 = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.7); }
`;

const stretch3 = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(2); }
`;

const stretch4 = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.6); }
`;

export const AnimatedIndicator1 = styled.div`
  width: 50px;
  height: 50px;
  background-color: #ffcc00;
  border-radius: 50%;
  margin: 0 19px;
  animation: ${stretch1} 3s infinite;
`;

export const AnimatedIndicator2 = styled(AnimatedIndicator1)`
  animation: ${stretch2} 3s infinite;
`;

export const AnimatedIndicator3 = styled(AnimatedIndicator1)`
  animation: ${stretch3} 3s infinite;
`;

export const AnimatedIndicator4 = styled(AnimatedIndicator1)`
  animation: ${stretch4} 3s infinite;
`;
