import { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import GptPage from './pages/GptPage';
import { GlobalStyle } from './GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<GptPage />} />
      </Routes>
    </>
  );
}

export default App;
