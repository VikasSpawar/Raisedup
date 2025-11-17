# 🚀 QUICK START - NEW ROUTING STRUCTURE

## 🎬 How to Test the New Application

### Step 1: Start Your Servers
```powershell
# Terminal 1: Backend
cd raisedup-backend
npm start

# Terminal 2: Frontend
cd raisedup
npm run dev
```

### Step 2: Open in Browser
```
http://localhost:5173
```

---

## 📍 NEW ROUTES TO TEST

### 1. **Public Landing Page**
- **URL**: http://localhost:5173/
- **What to see**: Landing page with features, stats, CTA buttons
- **Try clicking**: "Get Started", "Sign In"

### 2. **Login Page**
- **URL**: http://localhost:5173/login
- **What to do**: Enter email & password
- **Try**: Creating a new account first, then login

### 3. **Signup Page**
- **URL**: http://localhost:5173/signup
- **What to do**: 
  - Step 1: Select account type (Student/Instructor/Admin)
  - Step 2: Fill in name, email, password
  - Click "Create Account"
- **Result**: Redirects to /dashboard with your role's dashboard

### 4. **Student Dashboard** (if signup as Student)
- **URL**: http://localhost:5173/dashboard
- **What to see**:
  - Course browsing grid
  - Search bar
  - Category filter
  - Course cards with enrollment status
- **Try clicking**: Course play button (if enrolled)

### 5. **Protected Routes** (Try accessing without login)
- **URL**: http://localhost:5173/dashboard
- **Expected**: Auto-redirects to /login
- **Why**: Protected by ProtectedRoute guard

---

## 🧪 TEST SCENARIOS

### Scenario 1: New Student
```
1. Go to http://localhost:5173/
2. Click "Get Started"
3. Select "Student"
4. Enter details (name, email, password)
5. Click "Create Account"
6. ✅ Should see StudentDashboard
7. ✅ Can browse courses
```

### Scenario 2: New Instructor
```
1. Go to http://localhost:5173/
2. Click "Get Started"
3. Select "Instructor"
4. Enter details
5. Click "Create Account"
6. ✅ Should see InstructorDashboard
7. ✅ Can manage courses
```

### Scenario 3: New Admin
```
1. Go to http://localhost:5173/
2. Click "Get Started"
3. Select "Admin"
4. Enter details
5. Click "Create Account"
6. ✅ Should see AdminDashboard
7. ✅ Can manage platform
```

### Scenario 4: Login Returning User
```
1. Go to http://localhost:5173/login
2. Enter email & password
3. Click "Sign In"
4. ✅ Should redirect to /dashboard
5. ✅ Should see your role's dashboard
```

### Scenario 5: Auto-Redirect (Signed In)
```
1. Login to your account
2. Go to http://localhost:5173/
3. ✅ Auto-redirects to /dashboard
4. Same for /login and /signup
```

### Scenario 6: Protected Route
```
1. Go to http://localhost:5173/dashboard (not logged in)
2. ✅ Should redirect to /login
3. Shows loading spinner briefly
```

---

## 🔍 WHAT TO LOOK FOR

### ✅ Should Work
- Landing page loads
- Signup process (2 steps)
- Login process
- Dashboard shows based on role
- Course browsing
- Search & filter
- Mobile responsive menu
- Sign out button
- Form validation

### ⚠️ Possible Issues
- Database not set up → No courses showing (run FRESH_START.sql first)
- Auth token missing → Can't load profile
- CORS issues → Check backend is running

---

## 📊 USER TYPES & DASHBOARDS

### Student Dashboard
```
- Browse all courses
- Search & filter
- Enrollment status
- Play enrolled courses
- View progress (if CoursePlayerPage works)
```

### Instructor Dashboard
```
- Create courses
- Manage courses
- View enrollments
- Track analytics
```

### Admin Dashboard
```
- Manage users
- Moderate courses
- View platform stats
```

---

## 🎨 UI FEATURES TO TEST

### Landing Page
- [ ] Hero section displays
- [ ] Feature cards show
- [ ] Statistics visible
- [ ] Buttons redirect correctly
- [ ] Footer displays
- [ ] Responsive on mobile

### Login Page
- [ ] Form displays
- [ ] Email validation works
- [ ] Password field is hidden
- [ ] Error message shows on wrong credentials
- [ ] Links work (signup, landing)
- [ ] Loading spinner appears

### Signup Page
- [ ] Step 1: Three user type cards appear
- [ ] Step 2: Form fields appear
- [ ] Back button works
- [ ] Form validation works
- [ ] Password confirmation works
- [ ] Role is set correctly

### Student Dashboard
- [ ] Course grid displays
- [ ] Search works
- [ ] Filter works
- [ ] Course cards show correctly
- [ ] Enrollment status displays
- [ ] Mobile menu works
- [ ] Sign out works

---

## 🔐 AUTHENTICATION TESTS

### Test 1: Signup Creates Profile
```
Signup → Check Supabase profiles table
→ Your profile should be there with role = student/instructor/admin
```

### Test 2: Login Persists
```
Login → Refresh page → Still logged in
→ Session persists (using Supabase auth)
```

### Test 3: Logout Works
```
Click "Sign Out" → Redirects to /
→ Can't access /dashboard anymore
```

### Test 4: Protected Route Guard
```
Browser DevTools → Delete auth token → Refresh
→ Should redirect to /login
```

---

## 📱 RESPONSIVE DESIGN TEST

### Desktop (1920px)
- [ ] Navigation bar visible
- [ ] Course grid 3 columns
- [ ] All buttons visible
- [ ] Desktop menu shows

### Tablet (768px)
- [ ] Navigation adapts
- [ ] Course grid 2 columns
- [ ] Mobile menu appears
- [ ] Touch-friendly buttons

### Mobile (375px)
- [ ] Hamburger menu appears
- [ ] Course grid 1 column
- [ ] Touch-friendly buttons
- [ ] Forms stack vertically

---

## 🆘 TROUBLESHOOTING

### Landing page shows "Loading..."
**Cause**: App is checking authentication  
**Solution**: Wait a moment, should load

### Can't signup - "Email already exists"
**Cause**: Account already created with that email  
**Solution**: Use different email or login

### Dashboard shows error "Profile not found"
**Cause**: Signup didn't create profile  
**Solution**: Check Supabase profiles table

### Courses not showing
**Cause**: Database not initialized  
**Solution**: Run FRESH_START.sql in Supabase

### Can't login - "Invalid credentials"
**Cause**: Wrong email/password  
**Solution**: Check spelling, reset password if needed

### Mobile menu not working
**Cause**: Mobile menu button not responsive  
**Solution**: Check browser is in mobile view (DevTools)

---

## 📋 CHECKLIST TO VERIFY

- [x] App.jsx has Routes
- [x] ProtectedRoute works
- [x] LandingPage displays
- [x] LoginPage displays
- [x] SignupPage displays (2 steps)
- [x] DashboardRouter works
- [x] StudentDashboard displays
- [x] Form validation works
- [x] Error messages display
- [x] Responsive design works
- [ ] Database initialized (need FRESH_START.sql)
- [ ] InstructorDashboard tested
- [ ] AdminDashboard tested
- [ ] All auth flows tested

---

## 🎯 NEXT STEPS

1. **Test all routes** using scenarios above
2. **Check database** - Run FRESH_START.sql if needed
3. **Test on mobile** - Use DevTools or real device
4. **Add test users** - Create student, instructor, admin accounts
5. **Test course enrollment** - Need courses in database
6. **Test payment** - If Stripe is set up

---

## 📞 COMPONENT MAP

```
/ → LandingPage
/login → LoginPage
/signup → SignupPage
/dashboard → DashboardRouter
            ├─ (Student) → StudentDashboard
            ├─ (Instructor) → InstructorDashboard
            └─ (Admin) → AdminDashboard
```

---

**Ready to test?** Go to http://localhost:5173 🚀
