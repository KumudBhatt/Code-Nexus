// Info.js
import React from 'react';

const Info = () => {
  return (
    <div className="h-full flex flex-col justify-center bg-gradient-to-b from-gray-800 to-black p-10 text-white">
      <h2 className="text-4xl font-bold mb-4">Code Nexus</h2>
      <p className="text-lg mb-6">
        Welcome to Code Nexus, your collaborative coding platform. Work together in real-time, share code, and execute
        projects with ease. Secure, efficient, and built for developers.
      </p>
      <ul className="space-y-2">
        <li className="flex items-center">
          <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 00-1.414 1.414l4.414 4.414a1 1 0 001.414 0l8.414-8.414a1 1 0 00-1.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Real-time code collaboration
        </li>
        <li className="flex items-center">
          <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 00-1.414 1.414l4.414 4.414a1 1 0 001.414 0l8.414-8.414a1 1 0 00-1.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Secure authentication
        </li>
        <li className="flex items-center">
          <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 00-1.414 1.414l4.414 4.414a1 1 0 001.414 0l8.414-8.414a1 1 0 00-1.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Responsive UI
        </li>
        <li className="flex items-center">
          <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 00-1.414 1.414l4.414 4.414a1 1 0 001.414 0l8.414-8.414a1 1 0 00-1.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Robust error handling
        </li>
      </ul>
    </div>
  );
};

export default Info;