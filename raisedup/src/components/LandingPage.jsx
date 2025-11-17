import { ArrowRight, Award, BookOpen, Play, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Learn Anything',
      description: 'Access hundreds of courses on various topics'
    },
    {
      icon: Play,
      title: 'Video Content',
      description: 'High-quality video lessons from expert instructors'
    },
    {
      icon: Award,
      title: 'Get Certified',
      description: 'Earn certificates after completing courses'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with students and instructors worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Raisedup</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 text-white hover:text-blue-400 transition-colors font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Learn, Teach & Grow
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Join thousands of students learning from expert instructors. Start your learning journey today.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose Raisedup?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <Icon className="w-8 h-8 text-blue-500 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16 bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-400 mb-2">1000+</p>
            <p className="text-slate-400">Active Students</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-400 mb-2">500+</p>
            <p className="text-slate-400">Expert Instructors</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-400 mb-2">5000+</p>
            <p className="text-slate-400">Available Courses</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20 text-center">
        <h3 className="text-3xl font-bold text-white mb-6">
          Ready to start learning?
        </h3>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          Join our community of learners and instructors. Create your account today and unlock unlimited learning opportunities.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
        >
          Create Free Account <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 px-6 py-8 text-center text-slate-400 text-sm">
        <p>&copy; 2024 Raisedup. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
