import React, { useEffect, useState, useCallback } from 'react';

const USERS_ENDPOINT = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

const TEAMS_ENDPOINT = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

const EMPTY_FORM = { name: '', username: '', email: '', password: '', team_id: '' };

function Users() {
  const [users, setUsers]       = useState([]);
  const [teams, setTeams]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editUser, setEditUser] = useState(null);   // user being edited
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchUsers = useCallback(() => {
    return fetch(USERS_ENDPOINT)
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : d.results || []));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(USERS_ENDPOINT).then(r => r.json()),
      fetch(TEAMS_ENDPOINT).then(r => r.json()),
    ])
      .then(([userData, teamData]) => {
        setUsers(Array.isArray(userData) ? userData : userData.results || []);
        setTeams(Array.isArray(teamData) ? teamData : teamData.results || []);
      })
      .catch(err => console.error('Error loading data:', err))
      .finally(() => setLoading(false));
  }, []);

  function openEdit(user) {
    setEditUser(user);
    setForm({
      name:     user.name     || '',
      username: user.username || '',
      email:    user.email    || '',
      password: '',
      team_id:  user.team ? String(user.team.id) : '',
    });
    setSaveError('');
  }

  function closeEdit() {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setSaveError('');
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    const payload = {
      name:     form.name,
      username: form.username,
      email:    form.email,
      team_id:  form.team_id !== '' ? Number(form.team_id) : null,
    };
    if (form.password) payload.password = form.password;

    fetch(`${USERS_ENDPOINT}${editUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) return r.json().then(e => Promise.reject(e));
        return r.json();
      })
      .then(() => fetchUsers())
      .then(() => closeEdit())
      .catch(err => setSaveError(JSON.stringify(err)))
      .finally(() => setSaving(false));
  }

  return (
    <div>
      <h2 className="page-heading">Users</h2>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-striped table-hover table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-3">No users found.</td></tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><span className="fw-semibold">{user.name}</span></td>
                      <td><span className="text-secondary">{user.username}</span></td>
                      <td><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                      <td>
                        {user.team
                          ? <span className="badge bg-info text-dark">{user.team.name}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer text-muted small">
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </div>
        </div>
      )}

      {/* ── Edit modal ── */}
      {editUser && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">Edit User — {editUser.username}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeEdit} />
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body">
                    {saveError && (
                      <div className="alert alert-danger py-2 small">{saveError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text" name="name" className="form-control"
                        value={form.name} onChange={handleChange} required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Username</label>
                      <input
                        type="text" name="username" className="form-control"
                        value={form.username} onChange={handleChange} required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email" name="email" className="form-control"
                        value={form.email} onChange={handleChange} required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Password <small className="text-muted fw-normal">(leave blank to keep current)</small>
                      </label>
                      <input
                        type="password" name="password" className="form-control"
                        value={form.password} onChange={handleChange}
                        placeholder="New password…"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Team</label>
                      <select
                        name="team_id" className="form-select"
                        value={form.team_id} onChange={handleChange}
                      >
                        <option value="">— No team —</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;

