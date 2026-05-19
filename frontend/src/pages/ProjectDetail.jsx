import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedToId: '', dueDate: '' });

  useEffect(() => {
    fetchProject();
    if (user.role === 'ADMIN') {
      fetchUsers();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...newTask, projectId: id });
      setNewTask({ title: '', description: '', assignedToId: '', dueDate: '' });
      setShowTaskForm(false);
      fetchProject();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{project.name}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{project.description}</p>
      </header>

      {user.role === 'ADMIN' && (
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn-primary">
            {showTaskForm ? 'Cancel' : 'Add Task'}
          </button>

          {showTaskForm && (
            <div className="card animate-fade-in" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>New Task</h3>
              <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Title</label>
                  <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required className="input-field" placeholder="Task title" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
                  <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="input-field" rows="2" placeholder="Task details..."></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assign To</label>
                  <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})} className="input-field">
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="input-field" />
                </div>
                <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', justifySelf: 'start' }}>Save Task</button>
              </form>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tasks ({project.tasks.length})</h2>
        {project.tasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tasks in this project yet.</p>
        ) : (
          project.tasks.map(task => (
            <div key={task.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{task.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>Assigned: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <span className={`badge ${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
              </div>
              
              {(user.role === 'ADMIN' || user.id === task.assignedToId) && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
                    <button 
                      key={status}
                      onClick={() => updateTaskStatus(task.id, status)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.75rem', 
                        borderRadius: '0.25rem',
                        background: task.status === status ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
