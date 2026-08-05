import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './auth.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const user = await login(role, identifier, password);
      showToast('Logged in successfully', 'success');
      navigate(user.role === 'restaurant' ? '/restaurant-dashboard' : user.role === 'rider' ? '/rider-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/');
    } catch (err) { setError(err.message || 'Login failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page auth-page">
      <div className="container auth-container">
        <div className="card auth-card">
          <span className="eyebrow">Welcome back</span>
          <h1 style={{ fontSize: 24 }}>Login to CampusEats</h1>
          <p className="muted">This is a frontend demo — any email/phone and password will work.</p>

          <form onSubmit={submit}>
            <div className="field">
              <label>Account Type</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option><option value="restaurant">Restaurant</option><option value="rider">Delivery Rider</option><option value="admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Email / Phone</label>
              <input placeholder="you@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <div className="field-error">{error}</div>}
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
          </form>

          <p className="text-center mt-16 muted">
            Don't have a {role === 'restaurant' ? 'restaurant owner' : role === 'rider' ? 'delivery rider' : role === 'admin' ? 'admin' : 'customer'} account?{' '}
            <Link to={`/register?role=${role}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
