import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const endpoint = `${API_BASE}/api/leaderboard/`;

  useEffect(() => {
    console.log(`Fetching leaderboard from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard data:', data);
        const list = Array.isArray(data) ? data : data.results || [];
        // Sort descending by score
        setEntries([...list].sort((a, b) => b.score - a.score));
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, [endpoint]);

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.user?.username || entry.user}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
