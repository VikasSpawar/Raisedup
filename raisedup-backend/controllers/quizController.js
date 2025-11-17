const supabase = require('../config/supabase');

// Get quiz for a course
const getQuizByCourse = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions(*)
      `)
      .eq('course_id', req.params.courseId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Quiz not found' });
  }
};

// Submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { quiz_id, answers } = req.body; // answers: array of answer indices
    
    // Get quiz questions
    const { data: quiz } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions(*)
      `)
      .eq('id', quiz_id)
      .single();

    // Calculate score
    let correctCount = 0;
    quiz.quiz_questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    const totalQuestions = quiz.quiz_questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.passing_score;

    // Save result
    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert([{
        user_id: req.user.id,
        quiz_id,
        score: correctCount,
        total_questions: totalQuestions,
        passed
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      ...result,
      scorePercentage,
      correctAnswers: correctCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's quiz results
const getUserQuizResults = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select(`
        *,
        quizzes(
          title,
          course_id,
          courses(title)
        )
      `)
      .eq('user_id', req.user.id)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create quiz (instructor only)
const createQuiz = async (req, res) => {
  try {
    const { course_id, title, passing_score, questions } = req.body;
    
    // Verify user owns the course
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', course_id)
      .single();

    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([{ course_id, title, passing_score }])
      .select()
      .single();

    if (quizError) throw quizError;

    // Create questions
    const questionsWithQuizId = questions.map((q, index) => ({
      quiz_id: quiz.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      order_index: index
    }));

    const { data: createdQuestions, error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsWithQuizId)
      .select();

    if (questionsError) throw questionsError;

    res.status(201).json({ ...quiz, quiz_questions: createdQuestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getQuizByCourse,
  submitQuiz,
  getUserQuizResults,
  createQuiz
};
