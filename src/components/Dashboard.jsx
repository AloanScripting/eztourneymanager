import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../firestorev9/firestorev9.utils';

function Dashboard() {
  const { currentUser, setCurrentUser } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useNavigate();

  useEffect(() => {
    if (currentUser && !name) {
      setName(currentUser.displayName);
    }
  }, [currentUser, name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await updateProfile(currentUser, name);
      const updatedUser = { ...currentUser, displayName: name };
      await setCurrentUser(updatedUser);
      history('/');
    } catch (error) {
      setError('Profile will be updated!');
    }

    setLoading(false);
  };


  return (
    <div>
      {currentUser ? (
        <div>
          <h2>Dashboard</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              Update Profile
            </button>
          </form>
          {error && <p>{error}</p>}
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
