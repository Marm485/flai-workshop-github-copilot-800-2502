import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `${API_BASE}/api/teams/`;

  useEffect(() => {
    console.log(`Fetching teams from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Teams data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div>
      <h2 className="page-heading">Teams</h2>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {teams.length === 0 ? (
            <p className="text-muted">No teams found.</p>
          ) : (
            teams.map(team => (
              <div className="col-md-6 mb-4" key={team.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{team.name}</h5>
                    <span className="badge bg-primary">
                      {(team.members || []).length} member{(team.members || []).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-striped table-hover table-bordered mb-0">
                      <thead className="table-secondary">
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(team.members || []).map((member, index) => (
                          <tr key={member.id}>
                            <td className="text-muted">{index + 1}</td>
                            <td><span className="fw-semibold">{member.username}</span></td>
                            <td><a href={`mailto:${member.email}`} className="text-decoration-none">{member.email}</a></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Teams;
