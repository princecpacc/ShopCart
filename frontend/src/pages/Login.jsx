import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data) {
  const errors = {};

  const email = data.email.trim();
  if (!email) {
    errors.email = 'Email is required';
  } else if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await api.post('/customers/login', formData);
      navigate('/home');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the server. Please try again.');
      } else if (err.response.status >= 500) {
        setError('Something went wrong on the server. Please try again.');
      } else {
        setError('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-box">
        <span className="brand">ShopKart</span>
        <h1>Welcome back</h1>
        <p className="form-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {fieldErrors.email && <div className="error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {fieldErrors.password && <div className="error">{fieldErrors.password}</div>}
          </div>

          {error && <div className="error" style={{ marginBottom: '8px' }}>{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="link-row">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
