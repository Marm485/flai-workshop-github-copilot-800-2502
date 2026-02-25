import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Teams() {
  const [teams, setTeams] = useState([]);
  const endpoint = `${API_BASE}/api/teams/`;

  useEffect(() => {
    console.log(`Fetching teams from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Teams data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, [endpoint]);

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
      {teams.map(team => (
        <div className="card mb-3" key={team.id}>
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">{team.name}</h5>
          </div>
          <div className="card-body">
            <h6>Members:</h6>
            <ul className="list-group list-group-flush">
              {(team.members || []).map(member => (
                <li className="list-group-item" key={member.id}>
                  {member.username} — {member.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Teams;
