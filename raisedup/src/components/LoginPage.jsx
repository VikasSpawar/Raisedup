import { AlertCircle, BookOpen, Loader, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RaisEdUp</h1>
          </div>
        </div>

        <div className="w-full rounded-lg bg-white p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-gray-900 tracking-tight text-3xl font-bold leading-tight text-center pb-3 pt-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-center">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <label className="flex flex-col w-full">
              <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                Email Address
              </p>
              <div className="flex w-full flex-1 items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 bg-gray-50 focus:border-purple-500 h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                  placeholder="Enter your email address"
                  required
                />
                <div className="text-gray-400 flex border border-gray-300 bg-gray-50 items-center justify-center px-3 rounded-r-lg border-l-0">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </label>

            {/* Password Field */}
            <label className="flex flex-col w-full">
              <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                Password
              </p>
              <div className="flex w-full flex-1 items-stretch">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 bg-gray-50 focus:border-purple-500 h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                  placeholder="Enter your password"
                  required
                />
                <div className="text-gray-400 flex border border-gray-300 bg-gray-50 items-center justify-center px-3 rounded-r-lg border-l-0">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </label>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-lg px-6 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/signup"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-6 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Create Account
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-xs font-semibold mb-2">Demo Credentials:</p>
          <p className="text-blue-600 text-xs">Email: demo@example.com</p>
          <p className="text-blue-600 text-xs">Password: demo123456</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
