// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mint from './Mint';
import Get from './Get';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/get" element={<Get />} />
        <Route path="/*" element={<Mint />} />
      </Routes>
    </Router>
  );
}

export default App;
