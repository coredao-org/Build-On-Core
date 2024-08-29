// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import New from './New';
import Get from './Get';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/tasks" element={<Get />} />
        <Route path="/*" element={<New />} />
      </Routes>
    </Router>
  );
}

export default App;
