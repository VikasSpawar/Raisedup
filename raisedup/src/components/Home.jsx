import {
  Award,
  BookOpen,
  CheckCircle,
  LogOut,
  Menu,
  Star,
  TrendingUp,
  User,
  Video,
  X
} from 'lucide-react';
import '../App.css';

import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  coursesAPI,
  enrollmentAPI,
  quizAPI
} from '../services/api';
import AdminDashboard from './AdminDashboard';
import { CoursePlayerPage } from './CoursePlayerPage';
import CoursesPage from './CoursesPage';
import InstructorDashboard from './InstructorDashboard';

const EduFlowPlatform = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    score: 0
  });

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load user enrollments when user logs in
  useEffect(() => {
    if (user) {
      loadEnrollments();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesAPI.getAll();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const data = await enrollmentAPI.getUserEnrollments();
      setEnrolledCourses(data.map(e => e.course_id));
    } catch (err) {
      console.error('Error loading enrollments:', err);
    }
  };

  // Auth handlers
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
      setError(null);
    } catch (err) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      setLoading(true);
      await signUp(email, password, name);
      navigate('/dashboard');
      setError(null);
    } catch (err) {
      setError(err.message || 'Signup failed');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setEnrolledCourses([]);
      navigate('/dashboard');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Enrollment
  const enrollCourse = async (courseId) => {
    // console.log('Enrolling in course:', courseId);
    try {
      setLoading(true);
      await enrollmentAPI.enroll(courseId);
      setEnrolledCourses([...enrolledCourses, courseId]);
      navigate('/dashboard/my-courses');
      setError(null);
    } catch (err) {
      setError('Failed to enroll in course');
      console.error('Enrollment error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quiz logic
  const handleQuizAnswer = (answerIndex) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState({ ...quizState, answers: newAnswers });
  };

  const submitQuiz = async () => {
    if (!selectedCourse?.quiz?.id) return;
    
    try {
      setLoading(true);
      const result = await quizAPI.submit(selectedCourse.quiz.id, quizState.answers);
      setQuizState({ 
        ...quizState, 
        showResults: true, 
        score: result.correctAnswers 
      });
      setError(null);
    } catch (err) {
      setError('Failed to submit quiz');
      console.error('Quiz submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="bg-linear-to-br from-blue-400 to-purple-400 p-2 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RaisEDUp
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 transition">Home</button>
            <button onClick={() => navigate('/dashboard/courses')} className="text-gray-700 hover:text-blue-600 transition">Courses</button>
            {user && (
              <>
                <button onClick={() => navigate('/dashboard/my-courses')} className="text-gray-700 hover:text-blue-600 transition">My Learning</button>
                {user.user_metadata?.role === 'instructor' && (
                  <button onClick={() => navigate('/dashboard/instructor')} className="text-gray-700 hover:text-blue-600 transition">Instructor Dashboard</button>
                )}
                {user.user_metadata?.role === 'admin' && (
                  <button onClick={() => navigate('/dashboard/admin')} className="text-gray-700 hover:text-blue-600 transition">Admin Dashboard</button>
                )}
              </>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="text-sm">{user.user_metadata?.name || user.email}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-blue-600 transition">Login</button>
                <button onClick={() => navigate('/signup')} className="bg-linear-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
                  Sign Up
                </button>
              </>
            )}
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-700">Home</button>
            <button onClick={() => { navigate('/dashboard/courses'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-700">Courses</button>
            {user && (
              <button onClick={() => { navigate('/dashboard/my-courses'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-700">My Learning</button>
            )}
            {user && user.user_metadata?.role === 'instructor' && (
              <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-700">Instructor Dashboard</button>
            )}
            {user && user.user_metadata?.role === 'admin' && (
              <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-700">Admin Dashboard</button>
            )}
            {!user ? (
              <>
                <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-700">Login</button>
                <button onClick={() => { navigate('/signup'); setIsMenuOpen(false); }} className="block w-full text-left bg-blue-500 text-white px-4 py-2 rounded-lg">Sign Up</button>
              </>
            ) : (
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left text-red-600">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div className="pt-16">
      <div className="bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start, switch, or advance your career with thousands of courses, hands-on projects, and certificate programs.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/dashboard/courses')} className="bg-linear-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition transform hover:scale-105">
                Explore Courses
              </button>
              {!user && (
                <button onClick={() => navigate('/signup')} className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition border-2 border-blue-500">
                  Get Started Free
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose EduFlow?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="bg-blue-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Video className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">High-Quality Content</h3>
            <p className="text-gray-600">Learn from industry experts with professionally produced video content and resources.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="bg-purple-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Track Your Progress</h3>
            <p className="text-gray-600">Monitor your learning journey with detailed analytics and progress tracking.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="bg-pink-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Earn Certificates</h3>
            <p className="text-gray-600">Receive recognized certificates upon course completion to showcase your skills.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Featured Courses</h2>
              {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {courses.slice(0, 4).map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer" onClick={() => { setSelectedCourse(course); navigate(`/dashboard/courses/${course.id}`); }}>
                  <img src={course.thumbnail_url || 'https://via.placeholder.com/400x200'} alt={course.title} className="w-full h-40 object-cover rounded-t-xl" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.instructor_name || 'Instructor'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">${course.price}</span>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span>{course.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Course Detail Page
  const CourseDetailPage = ({selectedCourse}) => {

    const { courseId } = useParams();
    // console.log(selectedCourse, courseId)
    const course = selectedCourse || courses.find(c => String(c.id) === String(courseId));
    if (!course) return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div>Loading course...</div>
      </div>
    );
    const isEnrolled = enrolledCourses.includes(course.id);
    
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img src={course.thumbnail_url || course.thumbnail} alt={course.title} className="w-full h-64 object-cover rounded-xl mb-6" />
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.description}</p>
              
              <div className="bg-white rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">What You Will Learn</h2>
                <ul className="space-y-3">
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={20} /><span className="text-gray-700">Master the fundamentals and advanced concepts</span></li>
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={20} /><span className="text-gray-700">Build real-world projects from scratch</span></li>
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={20} /><span className="text-gray-700">Get hands-on experience with industry tools</span></li>
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={20} /><span className="text-gray-700">Earn a certificate upon completion</span></li>
                </ul>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
                <div className="text-3xl font-bold text-gray-900 mb-4">${course.price}</div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                {user && isEnrolled ? (
                  <button
                    onClick={() => navigate('/dashboard/my-courses')}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition mb-4"
                  >
                    Go to Course
                  </button>
                ) : (
                  <button
                    onClick={() => user ? enrollCourse(course.id) : navigate('/login')}
                    disabled={loading}
                    className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-4 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : user ? 'Enroll Now' : 'Login to Enroll'}
                  </button>
                )}
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between"><span className="text-gray-600">Duration:</span><span className="font-medium text-gray-900">{course.duration}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-600">Students:</span><span className="font-medium text-gray-900">{course.students_count || course.students || 0}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1"><Star className="text-yellow-400 fill-current" size={16} /><span className="font-medium text-gray-900">{course.rating || 0}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // My Courses Page
  const MyCoursesPage = () => {
    const enrolledCoursesList = courses.filter(c => enrolledCourses.includes(c.id));
    
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">My Learning</h1>
          
          {enrolledCoursesList.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-xl text-gray-600 mb-4">You have not enrolled in any courses yet</p>
              <button onClick={() => navigate('/dashboard/courses')} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCoursesList.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition">
                  <img src={course.thumbnail_url || course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-xl" />
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.instructor_name || course.instructor}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => { setSelectedCourse(course); navigate(`/dashboard/player/${course.id}`); }}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                      >
                        Continue Learning
                      </button>
                      {course.quiz && (
                        <button
                          onClick={() => { setSelectedCourse(course); navigate(`/dashboard/quiz/${course.id}`); setQuizState({ currentQuestion: 0, answers: [], showResults: false, score: 0 }); }}
                          className="px-4 bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                        >
                          Quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Login Page
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(email, password);
    };
    
    return (
      <div className="pt-16 min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-linear-to-br from-blue-400 to-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to continue your learning</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your email" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your password" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-600 font-semibold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    );
  };


  // Signup Page
 const SignupPage = () => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signUp(email, password, name, 'student');
      alert('Signup successful! Please check your email for verification.');
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pt-16 min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-linear-to-br from-blue-400 to-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Start your learning journey today</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your full name" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your email" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Create a password" 
              required 
              minLength={6}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">Sign In</button>
        </p>
      </div>
    </div>
  );
};

  // Quiz Page (keep as-is with minor adjustments)
  const QuizPage = () => {
    if (!selectedCourse || !selectedCourse.quiz) return null;
    const currentQ = selectedCourse.quiz[quizState.currentQuestion];
    
    if (quizState.showResults) {
      const percentage = (quizState.score / selectedCourse.quiz.length) * 100;
      const passed = percentage >= 70;
      
      return (
        <div className="pt-16 min-h-screen bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {passed ? (
                  <CheckCircle className="text-green-600" size={48} />
                ) : (
                  <X className="text-red-600" size={48} />
                )}
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                You scored {quizState.score} out of {selectedCourse.quiz.length}
              </p>
              <div className="text-4xl font-bold mb-8" style={{ color: passed ? '#10b981' : '#ef4444' }}>
                {percentage.toFixed(0)}%
              </div>
              {passed && (
                <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
                  <Award className="text-purple-600 mx-auto mb-4" size={48} />
                  <p className="text-lg font-semibold text-gray-900 mb-2">You've earned a certificate!</p>
                  <p className="text-gray-600 mb-4">Your achievement has been recorded</p>
                  <button className="bg-linear-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                    Download Certificate
                  </button>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setQuizState({ currentQuestion: 0, answers: [], showResults: false, score: 0 })}
                  className="px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => navigate('/dashboard/my-courses')}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Back to Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title} Quiz</h2>
              <span className="text-sm font-medium text-gray-600">
                Question {quizState.currentQuestion + 1} of {selectedCourse.quiz.length}
              </span>
            </div>
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${((quizState.currentQuestion + 1) / selectedCourse.quiz.length) * 100}%` }}
                ></div>
              </div>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">{currentQ.question}</h3>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${quizState.answers[quizState.currentQuestion] === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${quizState.answers[quizState.currentQuestion] === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {quizState.answers[quizState.currentQuestion] === index && (
                          <CheckCircle className="text-white" size={16} />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (quizState.currentQuestion > 0) {
                    setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion - 1 });
                  }
                }}
                disabled={quizState.currentQuestion === 0}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {quizState.currentQuestion === selectedCourse.quiz.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  disabled={quizState.answers[quizState.currentQuestion] === undefined || loading}
                  className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (quizState.answers[quizState.currentQuestion] !== undefined) {
                      setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion + 1 });
                    }
                  }}
                  disabled={quizState.answers[quizState.currentQuestion] === undefined}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main router — use nested routes under /dashboard so URLs are bookmarkable and back/forward works
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage setSelectedCourse={setSelectedCourse} />} />
          <Route path="courses/:courseId" element={<CourseDetailPage selectedCourse={selectedCourse} />} />
          <Route path="my-courses" element={<MyCoursesPage />} />
          <Route path="player/:courseId" element={<CoursePlayerPage selectedCourse={selectedCourse} />} />
          <Route path="instructor" element={<InstructorDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="quiz/:courseId" element={<QuizPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default EduFlowPlatform;
