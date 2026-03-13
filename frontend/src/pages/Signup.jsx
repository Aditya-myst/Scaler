import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else {
      if (form.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
      general: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await signup(form.name, form.email, form.password);
      showToast('Account created successfully!');
      navigate('/');
    } catch (err) {
      setErrors({
        general: err?.message || 'Signup failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = form.password;
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(password)) score++;

    if (score <= 2) return 1;
    if (score <= 4) return 2;
    return 3;
  };

  const PasswordStrength = () => {
    const strength = getPasswordStrength();
    const hasPassword = form.password.length > 0;

    const barColor =
      strength === 1
        ? 'bg-red-500'
        : strength === 2
        ? 'bg-yellow-500'
        : 'bg-green-500';

    const label =
      strength === 1 ? 'Weak' : strength === 2 ? 'Good' : 'Strong';

    const labelColor =
      strength === 1
        ? 'text-red-600'
        : strength === 2
        ? 'text-yellow-600'
        : 'text-green-600';

    if (!hasPassword) return null;

    return (
      <div className="mt-2">
        <div className="flex gap-1">
          <div className={`h-1 flex-1 rounded ${strength >= 1 ? barColor : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded ${strength >= 2 ? barColor : 'bg-gray-200'}`} />
          <div className={`h-1 flex-1 rounded ${strength >= 3 ? barColor : 'bg-gray-200'}`} />
        </div>
        <p className={`text-xs mt-1 font-medium ${labelColor}`}>{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <Link to="/" className="mb-6">
        <span className="text-3xl font-extrabold text-[#131921]">
          amazon<span className="text-[#FF9900]">.</span>
          <span className="text-sm">in</span>
        </span>
      </Link>

      <div className="w-full max-w-sm border border-gray-300 rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Create account
        </h1>

        {errors.general && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Your name
            </label>
            <input
              type="text"
              placeholder="First and last name"
              value={form.name}
              onChange={handleChange('name')}
              className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 8 characters, 1 uppercase, 1 number, 1 special character"
              value={form.password}
              onChange={handleChange('password')}
              className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <PasswordStrength />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Re-enter password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#FF9900] hover:bg-[#e68a00] text-black font-semibold rounded-md transition hover:shadow active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By creating an account, you agree to Amazon&apos;s{' '}
          <button type="button" className="text-blue-600 hover:underline">
            Conditions of Use
          </button>{' '}
          and{' '}
          <button type="button" className="text-blue-600 hover:underline">
            Privacy Notice
          </button>
          .
        </p>
      </div>

      <p className="text-sm text-gray-700 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Sign in ›
        </Link>
      </p>
    </div>
  );
}