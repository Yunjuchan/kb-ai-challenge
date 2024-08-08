import { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import GptPage from './pages/GptPage';
import DriveMode from './pages/DriveMode';
import Navbar from './components/Navbar';
import { GlobalStyle } from './GlobalStyles';

function App() {
  const [mode, setMode] = useState('gpt');

  return (
    <>
      <GlobalStyle />
      <Navbar setMode={setMode} />
      <Routes>
        <Route
          path="/"
          element={mode === 'gpt' ? <GptPage /> : <DriveMode />}
        />
      </Routes>
    </>
  );
}

export default App;
