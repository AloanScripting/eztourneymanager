import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
      <h1>Welcome to Gamer's EZ Tournament Manager</h1>
      <p>Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to create or join tournaments.</p>
    </div>
  );
}

export default Home;
