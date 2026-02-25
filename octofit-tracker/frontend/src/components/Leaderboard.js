import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function scoreBadgeClass(index) {
  if (index === 0) return 'bg-warning text-dark';
  if (index === 1) return 'bg-secondary';
  if (index === 2) return 'bg-danger';
  return 'bg-primary';
}

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `${API_BASE}/api/leaderboard/`;

  useEffect(() => {
    console.log(`Fetching leaderboard from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard data:', data);
        const list = Array.isArray(data) ? data : data.results || [];
        setEntries([...list].sort((a, b) => b.score - a.score));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div>
      <h2 className="page-heading">Leaderboard</h2>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped table-hover table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Team</th>
                  <th>Score</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-3">No entries found.</td></tr>
                ) : (
                  entries.map((entry, index) => (
                    <tr key={entry.id}>
                      <td className={`rank-number ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''} fw-bold`}>
                        {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                      </td>
                      <td><span className="fw-semibold">{entry.user?.name || '—'}</span></td>
                      <td><span className="text-secondary">{entry.user?.username || entry.user}</span></td>
                      <td><span className="badge bg-info text-dark">{entry.team || '—'}</span></td>
                      <td>
                        <span className={`badge ${scoreBadgeClass(index)}`}>
                          {entry.score} pts
                        </span>
                      </td>
                      <td><span className="badge bg-success">{entry.total_calories} cal</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer text-muted small">
            {entries.length} competitor{entries.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
