import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firestorev9/firestorev9.utils';

function Header({ currentUser }) {
  const history = useNavigate();

  const handleSignOut = () => {
    auth.signOut();
    history('/');
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link to="/">
          <img
            className="header__logo"
            src=""
            alt=""
          />
        </Link>
      </div>
      {currentUser ? (
        <div className="header__right">
          <div className="header__dropdown">
            <button className="header__dropdownButton">Manage Tournaments</button>
            <div className="header__dropdownContent">
              <Link to="/create-tournament">Create Tournament</Link>
              <Link to="/view-tournaments">View Tournaments</Link>
            </div>
          </div>
          <Link to="/dashboard">{currentUser.displayName}</Link>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : null}
    </div>
  );
}

export default Header;
