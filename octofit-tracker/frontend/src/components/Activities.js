import React, { useEffect, useState } from 'react';

function formatDate(isoString) {
  if (!isoString) return '—';
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `${API_BASE}/api/activities/`;

  useEffect(() => {
    console.log(`Fetching activities from: ${endpoint}`);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        console.log('Activities data:', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div>
      <h2 className="page-heading">Activities</h2>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped table-hover table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Activity Type</th>
                  <th>Duration</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted py-3">No activities found.</td></tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr key={activity.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><span className="fw-semibold">{activity.user?.username || activity.user}</span></td>
                      <td>{activity.activity_type}</td>
                      <td><span className="badge bg-secondary">{activity.duration} min</span></td>
                      <td>{formatDate(activity.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer text-muted small">
            {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} total
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;
