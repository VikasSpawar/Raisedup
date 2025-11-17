const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const supabase = require('../config/supabase');

const createCheckout = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({ error: 'Stripe is not configured' });
    }

    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: course.title,
                description: course.description || 'Course enrollment',
                images: course.thumbnail_url ? [course.thumbnail_url] : []
              },
              unit_amount: Math.round((course.price || 0) * 100) // Convert to cents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/courses/${courseId}`,
        metadata: {
          courseId,
          userId: req.user.id
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      res.status(400).json({ error: 'Failed to create payment session', details: stripeError.message });
    }
  } catch (error) {
    console.error('createCheckout error:', error);
    res.status(500).json({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({ error: 'Stripe is not configured' });
    }

    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        // Record payment
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([{
            user_id: session.metadata.userId,
            course_id: session.metadata.courseId,
            amount: (session.amount_total || 0) / 100,
            status: 'completed',
            transaction_id: session.id,
            created_at: new Date().toISOString()
          }]);

        if (paymentError) {
          console.error('Payment record error:', paymentError);
        }

        // Auto-enroll user
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert([{
            user_id: session.metadata.userId,
            course_id: session.metadata.courseId,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (enrollmentError && !enrollmentError.message.includes('duplicate')) {
          console.error('Enrollment error:', enrollmentError);
        }

        res.json({ success: true, message: 'Payment verified and user enrolled' });
      } else {
        res.status(400).json({ error: 'Payment not completed', status: session.payment_status });
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      res.status(400).json({ error: 'Failed to verify payment', details: stripeError.message });
    }
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's payments
const getUserPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        courses(title, thumbnail_url)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('getUserPayments error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCheckout, verifyPayment, getUserPayments };
