import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (isRegister) {
        response = await axiosInstance.post('/user/signup', {
          firstName,
          lastName,
          username,
          email,
          password,
        });
      } else {
        response = await axiosInstance.post('/user/signin', {
          username,
          password,
        });
      }
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        
        {isRegister && (
          <>
            <div className="flex flex-col space-y-1">
              <label htmlFor="firstName" className="text-gray-300">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-gray-600 rounded p-2 w-full bg-white text-black"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label htmlFor="lastName" className="text-gray-300">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-gray-600 rounded p-2 w-full bg-white text-black"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-600 rounded p-2 w-full bg-white text-black"
                required
              />
            </div>
          </>
        )}
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="username" className="text-gray-300">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-600 rounded p-2 w-full bg-white text-black"
            required
          />
        </div>
        
        <div className="flex flex-col space-y-1 relative">
          <label htmlFor="password" className="text-gray-300">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600 rounded p-2 w-full bg-white text-black"
            required
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
            {isRegister ? 'Already have an account? Login' : 'Dont have an account? Register'}
          </button>
        </div>
      </form>
    </div>
  );
}