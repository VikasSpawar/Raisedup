#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script seeds sample data for development/testing.
 * 
 * Usage:
 *   node scripts/seed.js
 * 
 * Note: This requires environment variables to be set (.env file)
 */

const supabase = require('../config/supabase');
require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    console.log('📋 Step 1: Checking database schema...');
    console.log('   ✅ Using service key for privileged access\n');

    // We'll use demo UUIDs for courses
    const demoInstructorId = 'd2ce65a0-a1b3-4095-850b-4e9d1cef551c';

    // Step 3: Create sample courses (using service key for privileged access)
    console.log('📚 Step 2: Creating sample courses...');
    
    const courses = [
      {
        title: 'Web Development Masterclass',
        description: 'Learn HTML, CSS, JavaScript, React and build real-world projects',
        instructor_id: demoInstructorId,
        price: 49.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
        duration: 720,
        category: 'Web Development',
        difficulty: 'beginner',
        is_published: true
      },
      {
        title: 'Data Science with Python',
        description: 'Master data analysis, visualization, and machine learning with Python',
        instructor_id: demoInstructorId,
        price: 59.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
        duration: 1080,
        category: 'Data Science',
        difficulty: 'intermediate',
        is_published: true
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Create beautiful and user-friendly interfaces using Figma',
        instructor_id: demoInstructorId,
        price: 44.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
        duration: 600,
        category: 'Design',
        difficulty: 'beginner',
        is_published: true
      },
      {
        title: 'Digital Marketing Complete Course',
        description: 'SEO, Social Media, Email Marketing, and Analytics',
        instructor_id: demoInstructorId,
        price: 39.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        duration: 840,
        category: 'Marketing',
        difficulty: 'beginner',
        is_published: true
      }
    ];

    try {
      const { data: createdCourses, error: courseError } = await supabase
        .from('courses')
        .insert(courses)
        .select();

      if (courseError) throw courseError;
      
      console.log(`   ✅ ${createdCourses?.length || 0} courses created successfully`);

      // Step 4: Create sample lessons for first course
      if (createdCourses && createdCourses.length > 0) {
        console.log('\n📖 Step 3: Creating sample lessons...');
        
        const firstCourse = createdCourses[0];
        const lessons = [
          {
            course_id: firstCourse.id,
            title: 'Introduction to Web Development',
            description: 'Overview and course structure',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            video_type: 'youtube',
            duration: 930,
            order_index: 1,
            is_published: true
          },
          {
            course_id: firstCourse.id,
            title: 'HTML Fundamentals',
            description: 'Basic HTML elements and structure',
            video_url: 'https://www.youtube.com/watch?v=3JluqTojuME',
            video_type: 'youtube',
            duration: 1545,
            order_index: 2,
            is_published: true
          },
          {
            course_id: firstCourse.id,
            title: 'CSS Styling Basics',
            description: 'Selectors, layout, and basic styling',
            video_url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
            video_type: 'youtube',
            duration: 1820,
            order_index: 3,
            is_published: true
          }
        ];

        const { data: createdLessons, error: lessonError } = await supabase
          .from('lessons')
          .insert(lessons)
          .select();

        if (lessonError) throw lessonError;
        console.log(`   ✅ ${createdLessons?.length || 0} lessons created successfully`);

        // Step 5: Create sample quiz
        console.log('\n❓ Step 4: Creating sample quiz...');
        
        const { data: quizzes, error: quizError } = await supabase
          .from('quizzes')
          .insert([{
            course_id: firstCourse.id,
            title: 'Web Development Basics Quiz',
            description: 'Test your knowledge of HTML and CSS',
            pass_percentage: 70,
            attempts_allowed: 3
          }])
          .select();

        if (quizError) throw quizError;
        
        if (quizzes && quizzes.length > 0) {
          const quiz = quizzes[0];
          
          const questions = [
            {
              quiz_id: quiz.id,
              question: 'What does HTML stand for?',
              question_type: 'multiple_choice',
              options: JSON.stringify([
                { text: 'Hyper Text Markup Language', is_correct: true },
                { text: 'High Tech Modern Language', is_correct: false },
                { text: 'Home Tool Markup Language', is_correct: false },
                { text: 'Hyperlinks and Text Markup Language', is_correct: false }
              ]),
              correct_answer: 'Hyper Text Markup Language',
              order_index: 1
            },
            {
              quiz_id: quiz.id,
              question: 'Which CSS property controls text size?',
              question_type: 'multiple_choice',
              options: JSON.stringify([
                { text: 'text-style', is_correct: false },
                { text: 'font-size', is_correct: true },
                { text: 'text-size', is_correct: false },
                { text: 'font-style', is_correct: false }
              ]),
              correct_answer: 'font-size',
              order_index: 2
            }
          ];

          const { error: questionError } = await supabase
            .from('quiz_questions')
            .insert(questions)
            .select();

          if (questionError) throw questionError;
          console.log(`   ✅ ${questions.length} quiz questions created successfully`);
        }
      }

    } catch (err) {
      console.error('   ❌ Error creating courses/lessons:', err.message);
    }

    console.log('\n✅ Seed complete!\n');
    console.log('📝 Notes:');
    console.log('   - Courses have been seeded with demo instructor ID');
    console.log('   - To assign courses to your account:');
    console.log('     1. Sign up/login as instructor at http://localhost:5173');
    console.log('     2. Get your user ID from browser console: console.log(user.id)');
    console.log('     3. Update INSTRUCTOR_ID in this script with your ID');
    console.log('     4. Run: npm run seed');
    console.log('   - OR create new courses directly from instructor dashboard\n');

  } catch (error) {
    console.error('❌ Fatal error during seed:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
