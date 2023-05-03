import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateTournament from './components/CreateTournament';
import ViewTournaments from './components/ViewTournaments';
import { auth } from './firestorev9/firestorev9.utils';
import { AuthProvider } from "./utils/AuthProvider";
import Dashboard from './components/Dashboard';
import TournamentHolder from './components/TournamentHolder';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((userAuth) => {
      setCurrentUser(userAuth);
    });

    return () => {
      unsubscribeFromAuth();
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      document.title = `Welcome, ${currentUser.displayName}!`;
    } else {
      document.title = "EZ Tourament Manager";
    }
  }, [currentUser]);

  return (
    <AuthProvider setCurrentUser={setCurrentUser}>
      <div className="app">
        <Header currentUser={currentUser} />
        <Routes>
          <Route path="/login" element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-tournament" element={<CreateTournament currentUser={currentUser} />} />
          <Route path="/tournament-holder/:id" element={<TournamentHolder />} />
          <Route path="/" element={<Home />} />
          <Route path="/view-tournaments" element={<ViewTournaments currentUser={currentUser} />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
