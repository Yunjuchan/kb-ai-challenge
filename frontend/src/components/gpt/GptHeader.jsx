import React from 'react';
import { HeaderContainer } from '../../style/gpt';
import { StyledButton } from '../../style/button';

const GptHeader = ({ toggleDriveMode }) => {
  return (
    <HeaderContainer>
      <StyledButton onClick={toggleDriveMode}>운전 모드</StyledButton>
    </HeaderContainer>
  );
};

export default GptHeader;
