import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './auth.css';

const LENGTH = 4;

export default function OTPVerification() {
  const [digits, setDigits] = useState(Array(LENGTH).fill(''));
  const inputsRef = useRef([]);
  const { verifyOtp, pendingUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const verify = () => {
    if (digits.some((d) => d === '')) {
      showToast('Enter the full code', 'error');
      return;
    }
    verifyOtp();
    showToast('Account verified!', 'success');
    navigate('/profile');
  };

  const resend = () => {
    setDigits(Array(LENGTH).fill(''));
    showToast('OTP resent (demo — code is 1234)', 'info');
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="page auth-page">
      <div className="container auth-container">
        <div className="card auth-card text-center">
          <span className="eyebrow">One last step</span>
          <h1 style={{ fontSize: 24 }}>Verify Your Account</h1>
          <p className="muted">
            Enter the {LENGTH}-digit code sent to {pendingUser?.phone || pendingUser?.email || 'your device'}.
            <br />This is a frontend demo — no real OTP is sent.
          </p>

          <div className="otp-inputs">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={d}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <button className="btn btn-primary btn-block" onClick={verify}>Verify OTP</button>
          <button className="btn btn-ghost btn-block mt-8" onClick={resend}>Resend OTP</button>
        </div>
      </div>
    </div>
  );
}
