// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage'

import Dashboard from './components/Dashboard';
import EditorPage from './components/EditorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:projectId" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
