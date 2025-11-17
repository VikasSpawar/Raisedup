#!/usr/bin/env node

/**
 * Simple Seed Script - No RLS Issues
 * 
 * This script seeds data without RLS conflicts by:
 * 1. Disabling RLS temporarily (if you have admin access)
 * 2. Or seeding data that respects current user context
 * 
 * Usage:
 *   node scripts/seed-simple.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedCourses() {
  console.log('🌱 Seeding courses...\n');

  try {
    // Note: Using demo instructor ID
    // Replace with your actual instructor ID after signing up
    const instructorId = 'd2ce65a0-a1b3-4095-850b-4e9d1cef551c';

    const coursesData = [
      {
        title: 'Web Development Masterclass',
        description: 'Learn HTML, CSS, JavaScript, React and build real-world projects',
        instructor_id: instructorId,
        price: 49.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop',
        duration: '720 minutes',
        category: 'Web Development',
        difficulty: 'beginner',
        is_published: true
      },
      {
        title: 'Data Science with Python',
        description: 'Master data analysis, visualization, and machine learning with Python',
        instructor_id: instructorId,
        price: 59.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        duration: '1080 minutes',
        category: 'Data Science',
        difficulty: 'intermediate',
        is_published: true
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Create beautiful and user-friendly interfaces using Figma',
        instructor_id: instructorId,
        price: 44.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
        duration: '600 minutes',
        category: 'Design',
        difficulty: 'beginner',
        is_published: true
      },
      {
        title: 'Digital Marketing Complete Course',
        description: 'SEO, Social Media, Email Marketing, and Analytics',
        instructor_id: instructorId,
        price: 39.99,
        thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
        duration: '840 minutes',
        category: 'Marketing',
        difficulty: 'beginner',
        is_published: true
      }
    ];

    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .insert(coursesData)
      .select();

    if (coursesError) {
      if (coursesError.message.includes('row-level security')) {
        console.warn('⚠️  RLS Policy Error');
        console.warn('\nTo fix this, follow these steps:');
        console.warn('1. Sign up/login at http://localhost:5173 as an instructor');
        console.warn('2. Get your user ID from browser console:');
        console.warn('   console.log(user.id)');
        console.warn('3. Update the instructorId variable in this script');
        console.warn('4. Run: npm run seed-simple\n');
        console.warn('OR');
        console.warn('\n5. In Supabase SQL Editor, temporarily disable RLS:');
        console.warn('   ALTER TABLE courses DISABLE ROW LEVEL SECURITY;');
        console.warn('   ALTER TABLE courses ENABLE ROW LEVEL SECURITY;');
        console.warn('   (After seeding)\n');
      } else {
        throw coursesError;
      }
    } else {
      console.log('✅ Courses created:', courses?.length || 0);

      // Seed lessons for first course
      if (courses && courses.length > 0) {
        const courseId = courses[0].id;
        console.log(`\n📖 Adding lessons to "${courses[0].title}"...\n`);

        const lessonsData = [
          {
            course_id: courseId,
            title: 'Introduction to Web Development',
            description: 'Overview and course structure',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            video_type: 'youtube',
            duration: 930,
            order_index: 1,
            is_published: true
          },
          {
            course_id: courseId,
            title: 'HTML Fundamentals',
            description: 'Basic HTML elements and structure',
            video_url: 'https://www.youtube.com/watch?v=3JluqTojuME',
            video_type: 'youtube',
            duration: 1545,
            order_index: 2,
            is_published: true
          },
          {
            course_id: courseId,
            title: 'CSS Styling Basics',
            description: 'Selectors, layout, and basic styling',
            video_url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
            video_type: 'youtube',
            duration: 1820,
            order_index: 3,
            is_published: true
          },
          {
            course_id: courseId,
            title: 'JavaScript Basics',
            description: 'Variables, functions, and events',
            video_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            video_type: 'youtube',
            duration: 2100,
            order_index: 4,
            is_published: true
          }
        ];

        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .insert(lessonsData)
          .select();

        if (lessonsError) {
          console.warn('⚠️  Could not seed lessons:', lessonsError.message);
        } else {
          console.log('✅ Lessons created:', lessons?.length || 0);
        }
      }
    }

    console.log('\n🎉 Seeding complete!\n');
    console.log('✨ Next steps:');
    console.log('   1. Start your app: npm run dev');
    console.log('   2. Sign up at http://localhost:5173');
    console.log('   3. Browse the seeded courses\n');

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedCourses();
