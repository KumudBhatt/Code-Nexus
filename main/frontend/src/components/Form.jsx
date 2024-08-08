import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const Form = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          // Handle password mismatch
          console.error('Passwords do not match');
          return;
        }
        // Registration
        const response = await axiosInstance.post('/user/signup', {
          firstName,
          lastName,
          username,
          email,
          password,
        });
        console.log('Registration response:', response.data);

        // Store token and redirect to dashboard
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        // Login
        const response = await axiosInstance.post('/user/signin', {
          username,
          password,
        });
        console.log('Login response:', response.data);
        // Store token and navigate to dashboard
        localStorage.setItem('token', response.data.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || 'Registration failed');
      // Handle error response
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isRegister && (
        <>
          <div>
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              placeholder="First Name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              placeholder="Last Name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </>
      )}
      <div>
        <label className="block text-gray-700">Username:</label>
        <input
          type="text"
          placeholder="Username"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      {isRegister && (
        <div>
          <label className="block text-gray-700">Email Address:</label>
          <input
            type="email"
            placeholder="Email Address"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}
      <div>
        <label className="block text-gray-700">Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {isRegister && (
        <div>
          <label className="block text-gray-700">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          {isRegister ? 'Register' : 'Login'}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Back to Login' : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default Form;
