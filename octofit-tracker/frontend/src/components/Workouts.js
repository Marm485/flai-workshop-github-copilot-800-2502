import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const endpoint = `${API_BASE}/api/workouts/`;

  useEffect(() => {
    console.log(`Fetching workouts from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Workouts data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => console.error('Error fetching workouts:', err));
  }, [endpoint]);

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
      <div className="row">
        {workouts.map(workout => (
          <div className="col-md-4 mb-3" key={workout.id}>
            <div className="card h-100">
              <div className="card-header bg-dark text-white">
                <h6 className="mb-0">{workout.name}</h6>
              </div>
              <div className="card-body">
                <p className="card-text">{workout.description}</p>
                <span className="badge bg-secondary">{workout.duration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
