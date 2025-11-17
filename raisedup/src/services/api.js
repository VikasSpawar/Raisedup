import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}` || ''
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

// Helper to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText };
    }
    
    const error = new Error(errorData.error || `API Error: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response;
};

// Auth API (handled by Supabase directly)
export const authAPI = {
  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  },
  
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('SignOut error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      return null;
    }
  }
};

// Courses API
export const coursesAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      await handleApiError(res);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('getAll courses error:', error);
      throw new Error(error.message || 'Failed to fetch courses');
    }
  },
  
  getById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}`);
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('getCourseById error:', error);
      throw new Error(error.message || 'Failed to fetch course');
    }
  },
  
  create: async (courseData) => {
    // console.log(courseData)
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(courseData)
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('createCourse error:', error);
      throw new Error(error.message || 'Failed to create course');
    }
  },
  
  update: async (id, courseData) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(courseData)
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('updateCourse error:', error);
      throw new Error(error.message || 'Failed to update course');
    }
  },
  
  delete: async (id) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers
      });
      await handleApiError(res);
    } catch (error) {
      console.error('deleteCourse error:', error);
      throw new Error(error.message || 'Failed to delete course');
    }
  }
};

// Lessons API
export const lessonsAPI = {
  getByCourse: async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/lessons/course/${courseId}`);
      await handleApiError(res);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('getLessonsByCourse error:', error);
      throw new Error(error.message || 'Failed to fetch lessons');
    }
  },
  
  getById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/lessons/${id}`);
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('getLessonById error:', error);
      throw new Error(error.message || 'Failed to fetch lesson');
    }
  },
  
  create: async (lessonData) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers,
        body: JSON.stringify(lessonData)
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('createLesson error:', error);
      throw new Error(error.message || 'Failed to create lesson');
    }
  },
  
  update: async (id, lessonData) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(lessonData)
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('updateLesson error:', error);
      throw new Error(error.message || 'Failed to update lesson');
    }
  },
  
  delete: async (id) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'DELETE',
        headers
      });
      await handleApiError(res);
    } catch (error) {
      console.error('deleteLesson error:', error);
      throw new Error(error.message || 'Failed to delete lesson');
    }
  }
};

// Enrollment API (Direct Supabase)
export const enrollmentAPI = {

  enroll: async (courseId) => {
    // console.log('Enrolling user in course:', courseId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      //  console.log('data at enroll' , user)
      if (!user) throw new Error('User not authenticated');
       
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{ user_id: user.id, course_id: courseId }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('enroll error:', error);
      throw new Error(error.message || 'Failed to enroll in course');
    }
  },
  
  getUserEnrollments: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('getUserEnrollments error:', error);
      throw new Error(error.message || 'Failed to fetch enrollments');
    }
  },
  
  isEnrolled: async (courseId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      return !!data;
    } catch (error) {
      console.error('isEnrolled error:', error);
      return false;
    }
  }
};

// Quiz API
export const quizAPI = {
  getByCourse: async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/quiz/course/${courseId}`);
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('getQuizByCourse error:', error);
      throw new Error(error.message || 'Failed to fetch quiz');
    }
  },
  
  submit: async (quizId, answers) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ quiz_id: quizId, answers })
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('submitQuiz error:', error);
      throw new Error(error.message || 'Failed to submit quiz');
    }
  },
  
  getResults: async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/quiz/results`, { headers });
      await handleApiError(res);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('getResults error:', error);
      throw new Error(error.message || 'Failed to fetch quiz results');
    }
  },
  
  create: async (quizData) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/quiz`, {
        method: 'POST',
        headers,
        body: JSON.stringify(quizData)
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('createQuiz error:', error);
      throw new Error(error.message || 'Failed to create quiz');
    }
  }
};

// Progress API
export const progressAPI = {
  getCourseProgress: async (userId, courseId) => {
    try {
      const res = await fetch(`${API_URL}/progress/${userId}/${courseId}`);
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('getCourseProgress error:', error);
      throw new Error(error.message || 'Failed to fetch progress');
    }
  },
  
  updateLesson: async (lessonId, completed) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/progress/update`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ lesson_id: lessonId, completed })
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('updateLesson error:', error);
      throw new Error(error.message || 'Failed to update progress');
    }
  },
  
  getUserProgress: async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/progress/user`, { headers });
      await handleApiError(res);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('getUserProgress error:', error);
      throw new Error(error.message || 'Failed to fetch user progress');
    }
  }
};

// Payment API
export const paymentAPI = {
  createCheckout: async (courseId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/payment/create-checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ courseId })
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('createCheckout error:', error);
      throw new Error(error.message || 'Failed to create checkout');
    }
  },
  
  verifyPayment: async (sessionId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sessionId })
      });
      await handleApiError(res);
      return res.json();
    } catch (error) {
      console.error('verifyPayment error:', error);
      throw new Error(error.message || 'Failed to verify payment');
    }
  }
};
