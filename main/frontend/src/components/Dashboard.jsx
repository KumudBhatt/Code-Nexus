import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { FaEllipsisV, FaTrash } from 'react-icons/fa'; // Importing icons

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/user/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error.response?.data?.message || error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    const token = localStorage.getItem('token');
    navigate(`/editor/${project._id}`, { state: { project, token } });
  };

  const handleCreateProject = async (projectName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/user/create', { projectName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, response.data.data]);
      setShowCreateProject(false);
      navigate(`/editor/${response.data.data.projectId}`);
    } catch (error) {
      console.error('Error creating project:', error.response?.data?.message || error.message);
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up

    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/user/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projects.filter(project => project._id !== id));
        setShowMenu(null); // Close the menu after deletion
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error.response?.data?.message || error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-6">
        <div className="text-xl font-semibold mb-6">Dashboard</div>
        <ul className="space-y-4">
          <li className={`cursor-pointer ${!showCreateProject ? 'bg-gray-700' : ''}`} onClick={() => setShowCreateProject(false)}>Projects</li>
          <li className={`cursor-pointer ${showCreateProject ? 'bg-gray-700' : ''}`} onClick={() => setShowCreateProject(true)}>Create Project</li>
          <li className="cursor-pointer" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="w-full bg-gray-100 p-6">
          <h1 className="text-2xl font-semibold">Welcome, User!</h1>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          {showCreateProject ? (
            <CreateProjectForm onCreate={handleCreateProject} />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Projects</h2>
                {/* <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <button className="ml-2 text-gray-600">Search</button>
                </div> */}
              </div>
              <section>
                {projects.length > 0 ? (
                  <ul>
                    {projects.map(project => (
                      <li
                        key={project._id}
                        className="relative border p-4 mb-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{project.projectName}</span>
                          <FaEllipsisV
                            className="text-gray-400 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling to parent
                              setShowMenu(showMenu === project._id ? null : project._id);
                            }}
                          />
                        </div>
                        {showMenu === project._id && (
                          <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                            <button
                              className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                              onClick={(e) => handleDeleteProject(project._id, e)}
                            >
                              <FaTrash className="mr-2 inline" /> Delete
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No projects found.</p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Create Project Form Component
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

export default Dashboard;
