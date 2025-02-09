import React from 'react';
<<<<<<< HEAD
import ChatAnalysis from './pages/ChatAnalysis';

function App() {
  return (
    <div className="App">
      <ChatAnalysis />
    </div>
=======
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
>>>>>>> 93043bfdae8393d537594289bc6be433d67d7c94
  );
}

export default App; 