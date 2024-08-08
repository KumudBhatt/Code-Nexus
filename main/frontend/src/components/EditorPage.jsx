import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';

const EditorPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from the URL
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState('// Type your code here\n');
  const editorRef = useRef(null);

  useEffect(() => {
    // Fetch project details using projectId
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCode(data.data.code || '// Type your code here\n'); // Initialize code with project data
      } catch (error) {
        console.error('Error fetching project:', error.response.data.message);
      }
    };

    fetchProject();
  }, [projectId]);

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
      const { data } = await axios.post(`http://localhost:3001/api/v1/user/projects/${projectId}/run`, payload);
      setOutputValue(data.data.output);
    } catch (error) {
      console.error('Error running code:', error.response.data.message);
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
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleRunCode}
          >
            Run Code
          </button>
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
