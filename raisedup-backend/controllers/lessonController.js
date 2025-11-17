const supabase = require('../config/supabase');

// Get all lessons for a course
const getLessonsByCourse = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', req.params.courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single lesson
const getLessonById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Lesson not found' });
  }
};

// Create lesson (instructor only)
const createLesson = async (req, res) => {
  try {
    const { course_id, title, video_url, duration, order_index, is_locked } = req.body;
    
    // Verify user owns the course
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', course_id)
      .single();

    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert([{ course_id, title, video_url, duration, order_index, is_locked }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update lesson
const updateLesson = async (req, res) => {
  try {
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('id', req.params.id)
      .single();

    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', lesson.course_id)
      .single();

    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('lessons')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete lesson
const deleteLesson = async (req, res) => {
  try {
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('id', req.params.id)
      .single();

    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', lesson.course_id)
      .single();

    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
