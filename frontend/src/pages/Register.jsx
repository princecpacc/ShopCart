import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^\p{L}[\p{L}\s.'-]*$/u;
const PHONE_REGEX = /^\d{10}$/;

function validate(data) {
  const errors = {};

  const name = data.fullName.trim();
  if (!name) {
    errors.fullName = 'Full name is required';
  } else if (name.length < 2 || name.length > 50) {
    errors.fullName = 'Full name must be 2 to 50 characters';
  } else if (!NAME_REGEX.test(name)) {
    errors.fullName = 'Full name can only contain letters, spaces, dots, hyphens and apostrophes';
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = 'Email is required';
  } else if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (data.password.length > 72) {
    errors.password = 'Password must be at most 72 characters';
  }

  const phone = data.phone.trim();
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Phone number must be exactly 10 digits';
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    let { name, value } = e.target;

    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await api.post('/customers/register', formData);
      navigate('/login');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the server. Please try again.');
      } else {
        setError(err.response.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-box">
        <span className="brand">ShopKart</span>
        <h1>Create account</h1>
        <p className="form-subtitle">Join ShopKart today</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {fieldErrors.fullName && <div className="error">{fieldErrors.fullName}</div>}
          </div>

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
              autoComplete="new-password"
            />
            {fieldErrors.password && <div className="error">{fieldErrors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              inputMode="numeric"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {fieldErrors.phone && <div className="error">{fieldErrors.phone}</div>}
          </div>

          {error && <div className="error" style={{ marginBottom: '8px' }}>{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="link-row">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
