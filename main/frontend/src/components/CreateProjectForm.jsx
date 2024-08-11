import React, { useState } from 'react';

const CreateProjectForm = ({ onCreate }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreate(projectName);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};
export default CreateProjectForm;
