import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import axiosInstance from '../axiosInstance';
import { FaEllipsisV, FaTrash } from 'react-icons/fa'; 
import CreateProjectForm from './CreateProjectForm';
import JoinRoom from './JoinRoom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [username, setUsername] = useState(''); // State for username
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

    // Retrieve and decode the token to get the username
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username || 'User');
      } catch (error) {
        console.error('Error decoding token:', error.message);
        setUsername('User');
      }
    }
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

    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/user/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projects.filter(project => project._id !== id));
        setShowMenu(null); 
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
          <li
            className={`cursor-pointer ${!showCreateProject && !showJoinRoom ? 'bg-gray-700' : ''}`}
            onClick={() => { setShowCreateProject(false); setShowJoinRoom(false); }}
          >
            Projects
          </li>
          <li
            className={`cursor-pointer ${showCreateProject ? 'bg-gray-700' : ''}`}
            onClick={() => { setShowCreateProject(true); setShowJoinRoom(false); }}
          >
            Create Project
          </li>
          <li
            className={`cursor-pointer ${showJoinRoom ? 'bg-gray-700' : ''}`}
            onClick={() => { setShowCreateProject(false); setShowJoinRoom(true); }}
          >
            Join Room
          </li>
          <li className="cursor-pointer" onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="w-full bg-gray-100 p-6">
          <h1 className="text-2xl font-semibold">Welcome, {username}!</h1>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          {showCreateProject ? (
            <div className="flex items-center justify-center h-full">
              <CreateProjectForm onCreate={handleCreateProject} />
            </div>
          ) : showJoinRoom ? (
            <div className="flex items-center justify-center h-full">
              <JoinRoom />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">All Projects</h2>
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
                              e.stopPropagation(); 
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

export default Dashboard;
