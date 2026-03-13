import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
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
      await login(form.email, form.password);
      showToast('Welcome back!');
      navigate('/');
    } catch (err) {
      setErrors({
        general: err?.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Sign in</h1>

        {errors.general && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange('password')}
              className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

            <div className="text-right mt-1">
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline hover:text-blue-800"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#FF9900] hover:bg-[#e68a00] text-black font-semibold rounded-md transition hover:shadow active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By continuing, you agree to Amazon&apos;s{' '}
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

      <div className="w-full max-w-sm mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 before:flex-1 before:border-t after:flex-1 after:border-t">
          New to Amazon?
        </div>

        <Link
          to="/signup"
          className="mt-3 block w-full text-center py-2.5 border border-gray-300 hover:bg-gray-100 text-sm text-gray-700 font-medium rounded-md transition"
        >
          Create your Amazon account
        </Link>
      </div>
    </div>
  );
}