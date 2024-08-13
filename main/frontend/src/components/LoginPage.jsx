import React from 'react';
import Form from './Form';
import Info from './Info';

const LoginPage = () => (
  <div className="flex min-h-screen bg-gradient-to-b from-gray-800 to-black">
    <div className="flex-1 bg-white bg-opacity-10 shadow-2xl overflow-hidden flex">
      <div className="hidden md:flex flex-1">
        <Info />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Form />
      </div>
    </div>
  </div>
);

export default LoginPage;
