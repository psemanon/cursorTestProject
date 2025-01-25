import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatAnalysis from './pages/ChatAnalysis';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/" element={<ChatAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App; 