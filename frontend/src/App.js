import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import TextSummarizer from './pages/TextSummarizer';
import PDFSummarizer from './pages/PDFSummarizer';
import YouTubeSummarizer from './pages/YouTubeSummarizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/text" element={<TextSummarizer />} />
        <Route path="/pdf" element={<PDFSummarizer />} />
        <Route path="/youtube" element={<YouTubeSummarizer />} />
      </Routes>
    </Router>
  );
}

export default App;
