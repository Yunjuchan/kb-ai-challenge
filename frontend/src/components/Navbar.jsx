import React from 'react';
import { StyledNavbar } from '../style/nav';

const Navbar = ({ setMode }) => {
  return (
    <>
      <StyledNavbar>
        <button onClick={() => setMode('gpt')}>GPT Mode</button>
        <button onClick={() => setMode('drive')}>Drive Mode</button>
      </StyledNavbar>
    </>
  );
};

export default Navbar;
