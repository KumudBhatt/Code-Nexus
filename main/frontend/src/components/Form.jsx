import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const Form = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await axiosInstance.post('/user/signup', {
          firstName,
          lastName,
          username,
          email,
          password,
        });
        const token = response.data.data.token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        const response = await axiosInstance.post('/user/signin', {
          username,
          password,
        });
        const token = response.data.data.token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-gray-800 to-black text-white p-8 rounded shadow-md w-full max-w-md flex flex-col space-y-4"
        style={{ maxHeight: '100vh', overflowY: 'auto' }}
      >
        <h1 className="text-2xl font-semibold mb-4">{isRegister ? 'Register' : 'Login'}</h1>
        {isRegister && (
          <>
            <div className="flex flex-col space-y-1">
              <label className="text-gray-300">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-gray-600 rounded p-2 w-full bg-white text-black"
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-gray-300">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-gray-600 rounded p-2 w-full bg-white text-black"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-600 rounded p-2 w-full bg-white text-black"
              />
            </div>
          </>
        )}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-600 rounded p-2 w-full bg-white text-black"
          />
        </div>
        <div className="flex flex-col space-y-1 relative">
          <label className="text-gray-300">Password</label>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600 rounded p-2 w-full bg-white text-black"
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle the showPassword state
              className="absolute right-2 top-9 text-gray-400 hover:text-gray-200 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          )}
        </div>
       
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-green-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : 'Don’t have an account? Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
