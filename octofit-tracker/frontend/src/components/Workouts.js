import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `${API_BASE}/api/workouts/`;

  useEffect(() => {
    console.log(`Fetching workouts from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Workouts data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching workouts:', err);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div>
      <h2 className="page-heading">Workouts</h2>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body p-0">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.length === 0 ? (
                    <tr><td colSpan="4" className="text-center text-muted py-3">No workouts found.</td></tr>
                  ) : (
                    workouts.map((workout, index) => (
                      <tr key={workout.id}>
                        <td className="text-muted">{index + 1}</td>
                        <td><span className="fw-semibold">{workout.name}</span></td>
                        <td className="text-muted">{workout.description}</td>
                        <td><span className="badge bg-success">{workout.duration} min</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer text-muted small">
              {workouts.length} workout{workouts.length !== 1 ? 's' : ''} total
            </div>
          </div>

          <div className="row">
            {workouts.map(workout => (
              <div className="col-md-4 mb-3" key={`card-${workout.id}`}>
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-dark text-white">
                    <h6 className="mb-0">{workout.name}</h6>
                  </div>
                  <div className="card-body">
                    <p className="card-text text-muted">{workout.description}</p>
                  </div>
                  <div className="card-footer">
                    <span className="badge bg-success">{workout.duration} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Workouts;
