import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import video from "../assets/background-video.mp4";

const Profile = () => {
  const [user, setUser ] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
  const [editingProject, setEditingProject] = useState(null);  
  const [editProjectData, setEditProjectData] = useState({ title: '', description: '', link: '' });  
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      let isAuthenticated = true;

      try {
        const userResponse = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
          signal,
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser (userData);
          setUsername(userData.name || userData.username);
          setLinkedin(userData.linkedin || '');
        } else {
          isAuthenticated = false;
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching user data:', error);
          isAuthenticated = false;
        }
      }

      if (!isAuthenticated) {
        toast.error('Please Login to view profile');
        navigate('/login');
        return;
      }

      // Fetch skills
      try {
        const skillsResponse = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile/skills', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal,
        });

        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData.skills);
          setSkillsText(skillsData.skills.join(', '));
        } else {
          toast.error('Failed to fetch skills');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching skills:', error);
          toast.error('Failed to fetch skills');
        }
      }

      // Fetch projects
      try {
        const projectsResponse = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile/projects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal,
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects);
        } else {
          toast.error('Failed to fetch projects');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching projects:', error);
          toast.error('Failed to fetch projects');
        }
      }
    };
    fetchData();
    return () => controller.abort();
  }, [navigate]);

  useEffect(() => {
    setSkillsText(skills.join(', '));
  }, [skills]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Skill cannot be empty");
      return;
    }

    try {
      const response = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ skill: newSkill }),
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);
        setNewSkill("");
        toast.success("Skill added successfully");
      } else {
        toast.error("Failed to add skill");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const handleUpdateSkills = async () => {
    const updatedSkills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    try {
      const response = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ skills: updatedSkills }),
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);
        toast.success("Skills updated successfully");
        setIsEditingSkills(false); // Close editing mode
      } else {
        toast.error("Failed to update skills");
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('https://internship-backend-bkhn.onrender.comauth/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('User  and associated data deleted successfully!');
        navigate('/signup');
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (username.trim() === '') {
      toast.error('Username cannot be empty');
      return;
    }

    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < minLength || 
        !hasNumber.test(password) || 
        !hasUpperCase.test(password) || 
        !hasSpecialChar.test(password)) {
      toast.error('Password must be at least 8 characters long, include at least one number, one uppercase letter, and one special character.');
      return;
    }

    try {
      const response = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          linkedin, 
        }),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser (data.user);
        toast.success('User  data updated successfully');
        setIsEditingProfile(false);
      } else {
        toast.error('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.link) {
      toast.error("Project title and link cannot be empty");
      return;
    }

    try {
      const response = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        const data = await response.json(); 
        setProjects(prevProjects => [...prevProjects, data.projects[data.projects.length - 1]]);  
        setNewProject({ title: '', description: '', link: '' });
        toast.success("Project added successfully");
      } else {
        toast.error("Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditProjectData({ title: project.title, description: project.description, link: project.link });
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://internship-backend-bkhn.onrender.com/auth/profile/projects', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData.projects);
      } else {
        toast.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };

  const handleUpdateProject = async () => {
    if (!editProjectData.title || !editProjectData.link) {
      toast.error("Project title and link cannot be empty");
      return;
    }

    try {
      const response = await fetch(`https://internship-backend-bkhn.onrender.com/auth/profile/projects/${editingProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editProjectData),
      });

      if (response.ok) {
        await response.json();  
        await fetchProjects(); 
        setEditProjectData({ title: '', description: '', link: '' });
        setEditingProject(null);
        toast.success("Project updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`https://internship-backend-bkhn.onrender.com/auth/profile/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
        toast.success("Project deleted successfully");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setEditProjectData({ title: '', description: '', link: '' });
  };

  return (
    <div className="profile-page">
      <video autoPlay loop muted className="background-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="profile-content">
        <h1>Profile</h1>
        {user ? (
          <>
            <p>Name: {user.name || user.username || 'No Name Available'}</p>
            <p>Email: {user.email}</p>
            <p>LinkedIn: {linkedin || 'No LinkedIn profile added'}</p>
            <button onClick={() => setIsEditingProfile(!isEditingProfile)}>
              {isEditingProfile ? 'Cancel Update' : 'Edit Profile'}
            </button>
            {isEditingProfile && (
              <form onSubmit={handleUpdateProfile}>
                <div>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div> 
                <div>
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div>
                  <label htmlFor="linkedin">LinkedIn:</label>
                  <input type="text" id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </div>
                <button type="submit">Update</button>
              </form>
            )}
            <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>
              Delete User
            </button>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
        
        <div className="skills-section">
          <h2>Skills</h2>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span>{skill}</span>
              </div>
            ))}
          </div>
          <div className="add-skill">
            <input type="text" placeholder="Add a new skill" value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button onClick={handleAddSkill}>Add Skill</button>
            <button onClick={() => setIsEditingSkills(!isEditingSkills)}>
              {isEditingSkills ? 'Cancel Edit Skills' : 'Edit Skills'}
            </button>
          </div>
          
          {isEditingSkills && (
            <div>
              <textarea value={skillsText} onChange={(e) => setSkillsText(e.target.value)} rows="4"
                cols="50" placeholder="Enter skills separated by commas"
              />
              <button onClick={handleUpdateSkills}>Update Skills</button>
            </div>
          )}
        </div>

        {showDeleteConfirmation && (
          <div className="confirmation-modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete your account?</h3>
              <p>This action cannot be undone.</p>
              <button onClick={handleDelete}>Yes, Delete</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        )}

        <div className="projects-section">
          <h2>Projects</h2>
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
                <div>
                  <button onClick={() => handleEditProject(project)}>Edit</button>
                  <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
                </div>
                {editingProject && editingProject._id === project._id && (
                  <div className="edit-project">
                    <h3>Edit Project</h3>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={editProjectData.title}
                      onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Project Description"
                      value={editProjectData.description}
                      onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Project Link"
                      value={editProjectData.link}
                      onChange={(e) => setEditProjectData({ ...editProjectData, link: e.target.value })}
                    />
                    <button onClick={handleUpdateProject}>Update</button>
                    <button onClick={cancelEditProject}>Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="add-project">
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Project Link"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            />
            <button onClick={handleAddProject}>Add Project</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;