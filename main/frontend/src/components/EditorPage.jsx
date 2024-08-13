import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axiosInstance from '../axiosInstance';
import { FaSave, FaCopy } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import Avatar from 'react-avatar';

const EditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams(); // Project ID from URL
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('// Type your code here\n');
  const [token, setToken] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [clients, setClients] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const editorRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/');
      return;
    }
    setToken(storedToken);

    try {
      const decodedToken = jwtDecode(storedToken); // Decode the token
      setUsername(decodedToken.username);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    const fetchProject = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          params: { room: roomId }, // Send roomId as a query parameter
        });
        const code = data.data?.data;
        setCode(code || '// Type your code here\n');
      } catch (error) {
        console.error(
          'Error fetching project:',
          error.response?.data?.message || error.message
        );
      }
    };

    fetchProject();
  }, [navigate, projectId, roomId]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (socketRef.current && roomId) {
      socketRef.current.emit('inputUpdate', { roomId, input: e.target.value, username });
    }
  };

  const handleOutputChange = (e) => {
    setOutputValue(e.target.value);
    if (socketRef.current && roomId) {
      socketRef.current.emit('outputUpdate', { roomId, output: e.target.value, username });
    }
  };

  const handleRunCode = async () => {
    const payload = {
      userInput: inputValue,
      code,
      format: language,
    };
    try {
      const { data } = await axiosInstance.post(`/user/projects/${projectId}/run`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutputValue(data.data);
      if (socketRef.current && roomId) {
        socketRef.current.emit('outputUpdate', { roomId, output: data.data, username });
      }
    } catch (error) {
      console.error('Error running code:', error.response?.data?.message || error.message);
    }
  };

  const handleSaveCode = async () => {
    try {
      const payload = { data: code };
      await axiosInstance.put(`/user/update/${projectId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error.response?.data?.message || error.message);
    }
  };

  const handleCollaborativeMode = async () => {
    if (socketRef.current) {
      if (isOwner) {
        // Disband the room if the user is the owner
        try {
          await axiosInstance.put(`/user/projects/${projectId}/disbandRoom`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Error disbanding room:', error.response?.data?.message || error.message);
        }
        socketRef.current.emit('endSession', { roomId, username });
        socketRef.current.disconnect();
        setRoomId('');
        setClients([]);
        setIsOwner(false);
        navigate('/dashboard');
      } else {
        // Leave the room if the user is not the owner
        socketRef.current.emit('leaveRoom', { roomId, username });
        socketRef.current.disconnect();
        setRoomId('');
        setClients([]);
        navigate('/dashboard');
      }
      return;
    }

    // If roomId already exists in state, join the existing session
    if (roomId) {
      const socket = io('http://localhost:3000');
      socketRef.current = socket;

      socket.emit('joinRoom', { roomId, username });

      socket.on('codeUpdate', (newCode) => {
        setCode(newCode);
      });

      socket.on('clientUpdate', (clientsList) => {
        setClients(clientsList);
      });

      socket.on('roomDisbanded', () => {
        alert('The room has been disbanded by the owner.');
        socket.disconnect();
        setRoomId('');
        setClients([]);
        navigate('/dashboard');
      });
    } else {
      // Create a new room if no roomId exists
      const generatedRoomId = uuidv4();

      try {
        const { data } = await axiosInstance.put(
          `/user/projects/${projectId}/addRoom`,
          { roomId: generatedRoomId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRoomId(generatedRoomId);
        setIsOwner(true);

        const socket = io('http://localhost:3000');
        socketRef.current = socket;

        socket.emit('joinRoom', { roomId: generatedRoomId, username });

        socket.on('codeUpdate', (newCode) => {
          setCode(newCode);
        });

        socket.on('clientUpdate', (clientsList) => {
          setClients(clientsList);
        });

        socket.on('roomDisbanded', () => {
          alert('The room has been disbanded by the owner.');
          socket.disconnect();
          setRoomId('');
          setClients([]);
          navigate('/dashboard');
        });
      } catch (error) {
        console.error('Error creating room:', error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const room = query.get('room'); // Extract roomId from URL query parameter

    if (room) {
      setRoomId(room);
      const socket = io('http://localhost:3000');
      socketRef.current = socket;

      socket.emit('joinRoom', { roomId: room, username });

      socket.on('codeUpdate', (newCode) => {
        setCode(newCode);
      });

      socket.on('clientUpdate', (clientsList) => {
        setClients(clientsList);
      });

      socket.on('inputUpdate', (input) => {
        setInputValue(input);
      });

      socket.on('outputUpdate', (output) => {
        setOutputValue(output);
      });

      socket.on('roomDisbanded', () => {
        alert('The room has been disbanded by the owner.');
        socket.disconnect();
        setRoomId('');
        setClients([]);
        navigate('/dashboard');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [location.search, projectId, username]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (socketRef.current && roomId) {
      socketRef.current.emit('codeUpdate', { roomId, code: value, username });
    }
  };

  const handleCopy = () => {
    const textToCopy = `Project ID: ${projectId}\nRoom ID: ${roomId}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 text-white w-64 p-4 flex-shrink-0">
        <div className="flex-1 flex items-center justify-center mb-4">
          <h1 className="text-xl font-semibold my-4">CODE NEXUS</h1>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`${roomId ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} text-white px-4 py-2 rounded mb-2 w-full`}
            onClick={handleCollaborativeMode}
          >
            {roomId ? 'Leave Session' : 'Start Collaborative Session'}
          </button>
          {(isOwner || roomId) && (
            <div className="relative mt-2 p-4 border rounded border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={handleCopy}
                aria-label="Copy IDs"
              >
                <FaCopy />
              </button>
              <div className="mb-2 text-sm">
                <p className="font-semibold text-gray-800">Project ID:</p>
                <span className="text-blue-600 break-all">{projectId}</span>
              </div>
              {roomId && (
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Room ID:</p>
                  <span className="text-blue-600 break-all">{roomId}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {roomId && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Connected Clients:</h2>
            <ul className="flex flex-wrap gap-4">
              {clients.map((client, index) => (
                <li key={index} className="text-sm flex flex-col items-center">
                  <Avatar name={client.username} size="50" round={true} /> 
                  <span className="mt-2">{client.username}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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
                onChange={handleEditorChange}
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
                  onChange={handleOutputChange}
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