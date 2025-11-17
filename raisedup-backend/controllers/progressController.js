const supabase = require('../config/supabase');

// Get user's progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Get all lessons for the course
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    // Get user's completed lessons
    const { data: progress, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .in('lesson_id', lessons.map(l => l.id));

    if (error) throw error;

    const totalLessons = lessons.length;
    const completedLessons = progress.filter(p => p.completed).length;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    res.json({
      totalLessons,
      completedLessons,
      progressPercentage,
      lessons: progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark lesson as complete
const updateProgress = async (req, res) => {
  try {
    const { lesson_id, completed } = req.body;

    const { data, error } = await supabase
      .from('progress')
      .upsert([{
        user_id: req.user.id,
        lesson_id,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all user progress
const getAllUserProgress = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select(`
        *,
        lessons(
          title,
          course_id,
          courses(title)
        )
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCourseProgress,
  updateProgress,
  getAllUserProgress
};
