import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';

/**
 * DashboardRouter - Routes to different dashboards based on user role
 * - Student: Course enrollment, learning path, progress
 * - Instructor: Course management, student management, analytics
 * - Admin: Platform management, user management, analytics
 */
export const DashboardRouter = () => {
  const { user, profile, loading, loadProfile } = useAuth();
  const [retryCount, setRetryCount] = useState(0);

  // Retry loading profile if it's missing
  useEffect(() => {
    if (!loading && user && !profile && retryCount < 5) {
      console.log(`Profile missing for user ${user.id}. Retrying... (${retryCount + 1}/5)`);
      const timer = setTimeout(() => {
        loadProfile(user.id, 2);
        setRetryCount(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, retryCount, loadProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error: Not authenticated</p>
          <p className="text-slate-400 text-sm mt-2">Please log in to continue</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    // Still loading/retrying - show loading state instead of error
    if (retryCount < 5) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Setting up your profile...</p>
            <p className="text-slate-400 text-sm mt-2">({retryCount}/5)</p>
          </div>
        </div>
      );
    }
    
    // Profile failed to load after retries
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error: Profile failed to load</p>
          <p className="text-slate-400 text-sm mt-2">Please refresh the page or contact support</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  switch (profile.role) {
    case 'instructor':
      return <InstructorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

export default DashboardRouter;
