import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const todos = await response.json();

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <section>
      <h2>Profile</h2>

      <h3>Account Information</h3>
      <p>
        Name: <strong>{email}</strong>
      </p>
      <p>Status: Authenticated</p>

      <h3>Todo Statistics</h3>

      {loading && <p>Loading statistics...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          <li>Total Todos: {todoStats.total}</li>
          <li>Completed Todos: {todoStats.completed}</li>
          <li>Active Todos: {todoStats.active}</li>
          <li>Completion Percentage: {completionPercentage}%</li>
        </ul>
      )}
    </section>
  );
}

export default ProfilePage;