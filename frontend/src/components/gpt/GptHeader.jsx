import React from 'react';
import { HeaderContainer } from '../../style/gpt';

const GptHeader = ({ toggleDriveMode }) => {
  return (
    <HeaderContainer>
      <button onClick={toggleDriveMode}>운전 모드</button>
    </HeaderContainer>
  );
};

export default GptHeader;
