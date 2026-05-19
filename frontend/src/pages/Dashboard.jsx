import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const myTasks = tasks.filter(t => t.assignedToId === user.id);
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}!</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Total Tasks</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>{tasks.length}</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>My Tasks</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: 'var(--accent-primary)' }}>{myTasks.length}</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Overdue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: 'var(--error-color)' }}>{overdueTasks.length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>My Tasks</h2>
          {myTasks.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No tasks assigned to you.</p> : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myTasks.map(task => (
                <li key={task.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: '600' }}>{task.title}</h4>
                    <span className={`badge ${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Project: {task.project?.name}</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
                      <button 
                        key={status}
                        onClick={() => updateStatus(task.id, status)}
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
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Overdue Tasks</h2>
          {overdueTasks.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No overdue tasks. Great job!</p> : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {overdueTasks.map(task => (
                <li key={task.id} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: '600', color: 'var(--error-color)' }}>{task.title}</h4>
                    <span className={`badge ${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
