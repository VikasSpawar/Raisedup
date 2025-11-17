import { BookOpen, Filter, LogOut, Menu, Play, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI, enrollmentAPI } from '../services/api';
import { CoursePlayerPage } from './CoursePlayerPage';

const StudentDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('courses'); // courses, player, profile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesAPI.getAll();
      setCourses(data || []);
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const data = await enrollmentAPI.getUserEnrollments();
      setEnrolledCourses(data?.map(e => e.course_id) || []);
    } catch (err) {
      console.error('Error loading enrollments:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handlePlayCourse = (course) => {
    setSelectedCourse(course);
    setCurrentView('player');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-white">Raisedup</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('courses')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'courses'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Browse Courses
            </button>
            <div className="text-slate-400">
              {profile?.name}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-800 p-4 space-y-3">
            <button
              onClick={() => {
                setCurrentView('courses');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
            >
              Browse Courses
            </button>
            <div className="px-4 py-2 text-slate-400">{profile?.name}</div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Courses View */}
        {currentView === 'courses' && (
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome, {profile?.name}!</h2>
              <p className="text-slate-400">
                Browse and enroll in courses to start learning
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6 flex-col md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No courses available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => {
                  const isEnrolled = enrolledCourses.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      {/* Course Image */}
                      <div className="h-40 bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-12 h-12 text-white/50" />
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div>
                            {isEnrolled && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                Enrolled
                              </span>
                            )}
                            {!isEnrolled && course.price > 0 && (
                              <span className="text-sm font-semibold text-white">
                                ${course.price}
                              </span>
                            )}
                            {!isEnrolled && course.price === 0 && (
                              <span className="text-sm text-green-400">Free</span>
                            )}
                          </div>
                          <button
                            onClick={() => handlePlayCourse(course)}
                            disabled={!isEnrolled}
                            className={`p-2 rounded-lg transition-colors ${
                              isEnrolled
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Player View */}
        {currentView === 'player' && selectedCourse && (
          <div className="p-6">
            <button
              onClick={() => {
                setCurrentView('courses');
                setSelectedCourse(null);
              }}
              className="mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              ← Back to Courses
            </button>
            <CoursePlayerPage selectedCourse={selectedCourse} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
