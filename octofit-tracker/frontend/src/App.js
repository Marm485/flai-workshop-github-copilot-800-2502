import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import octoFitLogo from './octofitapp-small.svg';
import './App.css';

function Home() {
  return (
    <div className="hero-section text-center">
      <h1>🏋️ OctoFit Tracker</h1>
      <p className="lead">
        Track your fitness activities, compete with your team, and level up your health!
      </p>
      <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
        <NavLink to="/users" className="btn btn-light btn-lg">👤 Users</NavLink>
        <NavLink to="/teams" className="btn btn-light btn-lg">🤝 Teams</NavLink>
        <NavLink to="/activities" className="btn btn-light btn-lg">🏃 Activities</NavLink>
        <NavLink to="/leaderboard" className="btn btn-light btn-lg">🏆 Leaderboard</NavLink>
        <NavLink to="/workouts" className="btn btn-light btn-lg">💪 Workouts</NavLink>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img src={octoFitLogo} alt="OctoFit Tracker" height="38" className="octofit-logo" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">👤 Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/teams">🤝 Teams</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/activities">🏃 Activities</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/leaderboard">🏆 Leaderboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/workouts">💪 Workouts</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
