import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiLock, FiLogOut, FiMapPin, FiClipboard } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [pw, setPw] = useState({ current: '', next: '' });

  if (!user) {
    return (
      <div className="page container state-block">
        <h3>You're not logged in</h3>
        <Link to="/login" className="btn btn-primary mt-16">Login</Link>
      </div>
    );
  }

  const saveProfile = (e) => {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
    showToast('Profile updated', 'success');
  };

  const savePassword = (e) => {
    e.preventDefault();
    setChangingPw(false);
    setPw({ current: '', next: '' });
    showToast('Password changed', 'success');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Account</span>
          <h1>My Profile</h1>
        </div>

        <div className="profile-layout">
          <div className="card card-pad profile-summary">
            <img src={user.avatar} alt={user.name} />
            <h3>{user.name}</h3>
            <p className="muted">{user.email}</p>
            <p className="muted">{user.phone}</p>
          </div>

          <div className="profile-actions">
            {!editing ? (
              <div className="card card-pad">
                <div className="flex-between">
                  <h3 style={{ fontSize: 15 }}>Profile Details</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}><FiEdit2 /> Edit Profile</button>
                </div>
                <div className="profile-detail-row"><span className="muted">Name</span><span>{user.name}</span></div>
                <div className="profile-detail-row"><span className="muted">Email</span><span>{user.email}</span></div>
                <div className="profile-detail-row"><span className="muted">Phone</span><span>{user.phone}</span></div>
              </div>
            ) : (
              <form className="card card-pad" onSubmit={saveProfile}>
                <h3 style={{ fontSize: 15 }}>Edit Profile</h3>
                <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="field"><label>Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="flex gap-8">
                  <button className="btn btn-primary" type="submit">Save Changes</button>
                  <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            )}

            {!changingPw ? (
              <div className="card card-pad">
                <div className="flex-between">
                  <h3 style={{ fontSize: 15 }}>Password</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setChangingPw(true)}><FiLock /> Change Password</button>
                </div>
                <p className="muted" style={{ marginBottom: 0 }}>••••••••</p>
              </div>
            ) : (
              <form className="card card-pad" onSubmit={savePassword}>
                <h3 style={{ fontSize: 15 }}>Change Password</h3>
                <div className="field"><label>Current Password</label><input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
                <div className="field"><label>New Password</label><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
                <div className="flex gap-8">
                  <button className="btn btn-primary" type="submit">Update Password</button>
                  <button className="btn btn-ghost" type="button" onClick={() => setChangingPw(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="card card-pad">
              <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
                <Link to="/locations" className="btn btn-outline btn-sm"><FiMapPin /> Saved Locations</Link>
                <Link to="/orders" className="btn btn-outline btn-sm"><FiClipboard /> Order History</Link>
                <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/'); showToast('Logged out', 'info'); }}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
