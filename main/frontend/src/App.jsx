// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Form from './components/Form';
import Info from './components/Info';
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

const LoginPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="flex flex-col md:flex-row bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
      <div className="flex-1 p-4">
        <Info />
      </div>
      <div className="flex-1 p-4">
        <Form />
      </div>
    </div>
  </div>
);

export default App;
