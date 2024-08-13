import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const [projectId, setProjectId] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectId.trim() && roomId.trim()) {
      navigate(`/editor/${projectId}?room=${roomId}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs w-80 h-80 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Join a Room</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Project ID</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-700"
              placeholder="Enter Project ID"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-700"
              placeholder="Enter Room ID"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full text-lg font-semibold"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;