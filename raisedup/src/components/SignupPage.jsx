import { AlertCircle, Award, BookOpen, Loader, Lock, Mail, Shield, User, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Form state
  const [step, setStep] = useState(1); // 1: Select role, 2: Enter details
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User type options with descriptions
  const userTypes = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access courses and track your progress',
      icon: BookOpen,
      color: 'text-purple-500'
    },
    {
      id: 'instructor',
      title: 'Instructor',
      description: 'Create courses and manage students',
      icon: Award,
      color: 'text-indigo-600'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage the platform and user accounts',
      icon: Shield,
      color: 'text-violet-700'
    }
  ];

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setError(null);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        userType
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    const role = userTypes.find(t => t.id === userType);
    return role ? role.title : '';
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RaisEdUp</h1>
          </div>
        </div>

        <div className="w-full rounded-lg bg-white p-6 sm:p-10 shadow-lg">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div>
              <div className="flex flex-col items-center">
                <h1 className="text-gray-900 tracking-tight text-3xl font-bold leading-tight text-center pb-3 pt-2">
                  Join RaisEdUp
                </h1>
                <p className="text-gray-500 text-center mb-8">
                  Start by choosing your role on the platform.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-gray-900 text-base font-medium leading-normal">
                    1. Select Role
                  </span>
                  <span className="text-gray-500 text-base font-medium leading-normal">/</span>
                  <span className="text-gray-500 text-base font-medium leading-normal">
                    2. Create Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => handleUserTypeSelect(type.id)}
                      className="group flex flex-1 cursor-pointer flex-col gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 p-6 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:border-purple-300 relative overflow-hidden"
                    >
                      {/* linear hover effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      <div className="relative z-10">
                        <IconComponent className={`w-8 h-8 mb-2 ${type.color}`} />
                        <div className="flex flex-col gap-1">
                          <h2 className="text-gray-900 text-lg font-bold leading-tight">
                            {type.title}
                          </h2>
                          <p className="text-gray-500 text-sm font-normal leading-normal">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Account Details Form */}
          {step === 2 && (
            <div>
              <div className="flex flex-col items-center">
                <h2 className="text-gray-900 tracking-tight text-3xl font-bold leading-tight text-center pb-3 pt-2">
                  Create your {getRoleTitle()} Account
                </h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-500 text-base font-medium leading-normal hover:text-gray-900 cursor-pointer transition-colors"
                  >
                    1. Select Role
                  </button>
                  <span className="text-gray-500 text-base font-medium leading-normal">/</span>
                  <span className="text-gray-900 text-base font-medium leading-normal">
                    2. Create Account
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Full Name Field */}
                <label className="flex flex-col w-full">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                    Full Name
                  </p>
                  <div className="flex w-full flex-1 items-stretch">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 bg-gray-50 focus:border-purple-500 h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                      placeholder="Enter your full name"
                      required
                    />
                    <div className="text-gray-400 flex border border-gray-300 bg-gray-50 items-center justify-center px-3 rounded-r-lg border-l-0">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </label>

                {/* Email Field */}
                <label className="flex flex-col w-full">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                    Email
                  </p>
                  <div className="flex w-full flex-1 items-stretch">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 bg-gray-50 focus:border-purple-500 h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                      placeholder="Enter a strong password"
                      required
                    />
                    <div className="text-gray-400 flex border border-gray-300 bg-gray-50 items-center justify-center px-3 rounded-r-lg border-l-0">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                </label>

                {/* Confirm Password Field */}
                <label className="flex flex-col w-full">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
                    Confirm Password
                  </p>
                  <div className="flex w-full flex-1 items-stretch">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 bg-gray-50 focus:border-purple-500 h-12 placeholder:text-gray-400 px-4 text-base font-normal leading-normal"
                      placeholder="Confirm your password"
                      required
                    />
                    <div className="text-gray-400 flex border border-gray-300 bg-gray-50 items-center justify-center px-3 rounded-r-lg border-l-0">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                </label>

                {/* Form Actions */}
                <div className="flex  flex-col-reverse sm:flex-row items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex h-12 w-full sm:w-auto items-center justify-center rounded-lg border border-gray-300 bg-transparent px-8 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <div className='w-full'>
                    <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full flex-1 sm:flex-none items-center justify-center rounded-lg px-8 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                  </div>
                  
                </div>
              </form>
            </div>
          )}

          {/* Login Link */}
          <div className="text-center pt-8">
            <Link 
              to="/login" 
              className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
