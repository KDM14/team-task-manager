import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowCreate(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your team's projects</p>
        </div>
        {user.role === 'ADMIN' && (
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
            {showCreate ? 'Cancel' : 'New Project'}
          </button>
        )}
      </header>

      {showCreate && (
        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Create New Project</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Project Name</label>
              <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required className="input-field" placeholder="e.g. Website Redesign" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="input-field" rows="3" placeholder="Brief description..."></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Create Project</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} className="card" style={{ display: 'block', color: 'inherit' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description || 'No description provided.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{project.tasks.length} Tasks</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)' }}>View Details &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
