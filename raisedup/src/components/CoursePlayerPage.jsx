import { CheckCircle, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { lessonsAPI, progressAPI } from '../services/api';
import VideoPlayer from './VideoPlayer';
import { useParams } from 'react-router-dom';

export const CoursePlayerPage = () => {
  const {courseId : selectedCourse} = useParams();
  
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    if (selectedCourse) {
      loadLessons();
      loadProgress();
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonsAPI.getByCourse(selectedCourse);
      setLessons(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load lessons');
      console.error('Error loading lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await progressAPI.getUserProgress();
      const completed = new Set(
        data
          .filter(p => p.completed)
          .map(p => p.lesson_id)
      );
      setCompletedLessons(completed);
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      await progressAPI.updateLesson(lessonId, true);
      setCompletedLessons(prev => new Set([...prev, lessonId]));
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      setError('Failed to mark lesson as complete');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadLessons}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div>
                <VideoPlayer
                  videoUrl={currentLesson.video_url}
                  title={currentLesson.title}
                />
                <div className="bg-gray-800 rounded-lg p-6 mt-6 text-white">
                  <h1 className="text-3xl font-bold mb-4">{currentLesson.title}</h1>
                  {currentLesson.description && (
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {currentLesson.description}
                    </p>
                  )}
                  {currentLesson.duration && (
                    <div className="flex items-center space-x-2 text-gray-400 mb-6">
                      <span>Duration: {currentLesson.duration} minutes</span>
                    </div>
                  )}
                  
                  {!completedLessons.has(currentLesson.id) ? (
                    <button
                      onClick={() => markLessonComplete(currentLesson.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                    >
                      Mark as Complete
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle size={20} />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center text-gray-300">
                <p>No lessons available</p>
              </div>
            )}
          </div>

          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 text-white sticky top-24">
              <h2 className="text-2xl font-bold mb-4">
                {selectedCourse?.title}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {selectedCourse?.description}
              </p>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-blue-400 font-medium">
                    {Math.round((completedLessons.size / lessons.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: lessons.length > 0 
                        ? `${(completedLessons.size / lessons.length) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-4">Lessons</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {lessons.length === 0 ? (
                  <p className="text-gray-400 text-sm">No lessons yet</p>
                ) : (
                  lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`p-3 rounded-lg cursor-pointer transition flex items-start space-x-3 ${
                        currentLesson?.id === lesson.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <div className="shrink-0 pt-1">
                        {lesson.is_locked ? (
                          <Lock size={16} />
                        ) : completedLessons.has(lesson.id) ? (
                          <CheckCircle size={16} className="text-green-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {index + 1}. {lesson.title}
                        </p>
                        {lesson.duration && (
                          <p className="text-xs opacity-75">
                            {lesson.duration} min
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
