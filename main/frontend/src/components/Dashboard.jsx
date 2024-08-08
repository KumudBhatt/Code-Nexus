import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../axiosInstance';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/user/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error.response.data.message);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    navigate(`/editor/${project._id}`, { state: { project } });
  };

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-6">
        <div className="text-xl font-semibold mb-6">Dashboard</div>
        <ul className="space-y-4">
          <li className="cursor-pointer">Projects</li>
          <li className="cursor-pointer">Create Project</li>
          <li className="cursor-pointer">Logout</li>
        </ul>
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="w-full bg-gray-100 p-6">
          <h1 className="text-2xl font-semibold">Welcome, User!</h1>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Projects</h2>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              <button className="ml-2 text-gray-600">Search</button>
            </div>
          </div>
          <section>
            {projects.length > 0 ? (
              <ul>
                {projects.map(project => (
                  <li
                    key={project._id}
                    className="border p-4 mb-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleProjectClick(project)} // Add click handler
                  >
                    {project.projectName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
