import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axiosInstance from '../axiosInstance';
import { FaSave } from 'react-icons/fa'; // Importing the save icon

const EditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { token } = location.state;
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState('// Type your code here\n');
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const code = data.data?.data; // Adjust this according to the new response structure
        setCode(code || '// Type your code here\n');
      } catch (error) {
        console.error('Error fetching project:', error.response?.data?.message || error.message);
      }
    };
    
    fetchProject();
    
  }, [projectId, token]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRunCode = async () => {
    const payload = {
      userInput: inputValue,
      code,
      format: language
    };
    try {
      const { data } = await axiosInstance.post(`/user/projects/${projectId}/run`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOutputValue(data.data); // Access the output directly from data.data
    } catch (error) {
      console.error('Error running code:', error.response?.data?.message || error.message);
    }
  };

  const handleSaveCode = async () => {
    try {
      const payload = { data: code }; // Adjust the payload as necessary
      await axiosInstance.put(`/user/update/${projectId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 text-white w-64 p-4 flex-shrink-0">
        <div className="flex items-center mb-4">
          <img className="h-12" src="/code-sync.png" alt="logo" />
        </div>
        <h3 className="text-xl font-semibold mb-4">Platform Name</h3>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 h-full p-4 bg-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <label className="block text-gray-700 mr-2">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div className="flex items-center">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-2 flex items-center"
              onClick={handleSaveCode}
            >
              <FaSave className="mr-2" /> Save Code
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleRunCode}
            >
              Run Code
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-grow mb-4" style={{ flexBasis: '60%' }}>
            <div className="h-full">
              <MonacoEditor
                height="100%"
                defaultLanguage={language}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-light"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
                editorDidMount={(editor) => { editorRef.current = editor; }}
              />
            </div>
          </div>
          <div className="flex flex-col" style={{ flexBasis: '20%' }}>
            <div className="flex mb-4">
              <div className="flex-1 mr-4">
                <label className="block text-gray-700">Input:</label>
                <textarea
                  className="border border-gray-300 rounded p-2 w-full h-full resize-none overflow-auto"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter input..."
                />
              </div>
              <div className="flex-1 ml-4">
                <label className="block text-gray-700">Output:</label>
                <textarea
                  className="border border-gray-300 rounded p-2 w-full h-full resize-none overflow-auto"
                  value={outputValue}
                  readOnly
                  placeholder="Output will appear here..."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditorPage;
