import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './auth.css';

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = ['customer', 'restaurant', 'rider', 'admin'].includes(params.get('role')) ? params.get('role') : 'customer';
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', restaurantName: '', address: '', vehicleType: '', adminKey: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await register(role, form);
      showToast(role === 'customer' ? 'Account created successfully' : 'Registration submitted successfully', 'success');
      navigate(role === 'customer' ? '/' : '/login');
    } catch (err) { setError(err.message || 'Registration failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page auth-page">
      <div className="container auth-container">
        <div className="card auth-card">
          <span className="eyebrow">Join CampusEats</span>
          <h1 style={{ fontSize: 24 }}>Create your account</h1>

          <form onSubmit={submit}>
            <div className="field">
              <label>Register As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant Owner</option>
                <option value="rider">Delivery Rider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Name</label>
              <input placeholder="Full name" value={form.name} onChange={update('name')} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input placeholder="01XXXXXXXXX" value={form.phone} onChange={update('phone')} />
            </div>
            {role === 'restaurant' && <>
              <div className="field"><label>Restaurant Name</label><input placeholder="Your restaurant name" value={form.restaurantName} onChange={update('restaurantName')} /></div>
              <div className="field"><label>Restaurant Address</label><input placeholder="Restaurant address" value={form.address} onChange={update('address')} /></div>
            </>}
            {role === 'rider' && <div className="field"><label>Vehicle Type</label><input placeholder="Motorbike, bicycle, etc." value={form.vehicleType} onChange={update('vehicleType')} /></div>}
            {role === 'admin' && <div className="field"><label>Admin Setup Key</label><input type="password" placeholder="Private setup key" value={form.adminKey} onChange={update('adminKey')} /></div>}
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={update('password')} />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={update('confirm')} />
              {error && <div className="field-error">{error}</div>}
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : role === 'customer' ? 'Create Account' : role === 'admin' ? 'Create Admin Account' : 'Submit for Approval'}</button>
          </form>

          <p className="text-center mt-16 muted">
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
