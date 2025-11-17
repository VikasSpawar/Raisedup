# 📐 PROJECT STRUCTURE & ROUTING GUIDE

## 🏗️ New Application Architecture

```
raisedup/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx          ✅ NEW - Route guard for authenticated pages
│   │   ├── LandingPage.jsx             ✅ NEW - Public landing page
│   │   ├── LoginPage.jsx               ✅ NEW - User login
│   │   ├── SignupPage.jsx              ✅ NEW - User signup with role selection
│   │   ├── DashboardRouter.jsx         ✅ NEW - Routes to correct dashboard based on role
│   │   ├── StudentDashboard.jsx        ✅ NEW - Student-specific dashboard
│   │   ├── InstructorDashboard.jsx     ✅ REFACTORED - Instructor-specific dashboard
│   │   ├── AdminDashboard.jsx          ✅ REFACTORED - Admin-specific dashboard
│   │   ├── CoursePlayerPage.jsx        ✅ EXISTING - Video player for lessons
│   │   ├── CoursesPage.jsx             ✅ EXISTING - Course listing
│   │   ├── VideoPlayer.jsx             ✅ EXISTING - Video component
│   │   ├── PaymentButton.jsx           ✅ EXISTING - Stripe payment
│   │   ├── ErrorBoundary.jsx           ✅ EXISTING - Error handling
│   │   └── Home.jsx                    ⚠️  LEGACY - Now only for /home route
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx             ✅ UPDATED - Enhanced with role support
│   │
│   ├── services/
│   │   └── api.js                      ✅ EXISTING - API endpoints
│   │
│   ├── App.jsx                         ✅ UPDATED - Proper routing
│   ├── main.jsx                        ✅ EXISTING - Entry point
│   └── App.css                         ✅ EXISTING - Styles
```

---

## 🔀 ROUTING STRUCTURE

### Public Routes (No Authentication Required)
```
/                   → Landing Page (public homepage)
/login              → Login Page
/signup             → Signup Page (with user type selection)
```

### Protected Routes (Authentication Required)
```
/dashboard          → DashboardRouter (routes based on user role)
  ├─ Student         → StudentDashboard (course browsing, enrollment)
  ├─ Instructor      → InstructorDashboard (course management)
  └─ Admin           → AdminDashboard (platform management)

/home               → Legacy Home component (fallback)
```

### Flow Diagram
```
┌─────────────────────────────────────┐
│         App.jsx (Router)            │
└─────────────────────────────────────┘
              ↓
    ┌─────────┴──────────┬──────────┐
    ↓                    ↓          ↓
 Public            Protected    Legacy
 Routes            Routes       Routes
 
 /                /dashboard    /home
 /login     ├─ Student          
 /signup    ├─ Instructor   (Old behavior)
            └─ Admin
```

---

## 👤 USER TYPES & FEATURES

### 1. STUDENT
**Route**: `/dashboard` → `StudentDashboard`

**Features**:
- ✅ Browse all courses
- ✅ Search & filter courses
- ✅ Enroll in courses
- ✅ Watch video lessons
- ✅ Track progress
- ✅ Take quizzes
- ✅ View certificates

**Dashboard Components**:
- Course browsing grid
- Course search & filter
- Course enrollment
- Video player
- Progress tracking

### 2. INSTRUCTOR
**Route**: `/dashboard` → `InstructorDashboard`

**Features**:
- ✅ Create courses
- ✅ Edit courses
- ✅ Delete courses
- ✅ Add lessons
- ✅ View student enrollment
- ✅ Track course analytics
- ✅ Create quizzes

**Dashboard Components**:
- Course management table
- Create/Edit course modal
- Lesson management
- Student analytics
- Revenue tracking

### 3. ADMIN
**Route**: `/dashboard` → `AdminDashboard`

**Features**:
- ✅ Manage users
- ✅ Manage courses
- ✅ View platform analytics
- ✅ Ban/remove users
- ✅ Approve courses
- ✅ Generate reports
- ✅ System settings

**Dashboard Components**:
- User management
- Course management
- Analytics dashboard
- System logs
- Settings panel

---

## 📝 SIGNUP FLOW (User-Type Aware)

### Step 1: Select User Type
```
┌──────────────────────────────────┐
│  Choose Your Account Type        │
├──────────────────────────────────┤
│ ┌─────────┐ ┌──────────┐ ┌──────┐│
│ │ Student │ │Instructor│ │Admin ││
│ │  Learn  │ │  Teach   │ │Manage││
│ └─────────┘ └──────────┘ └──────┘│
└──────────────────────────────────┘
```

### Step 2: Enter Account Details
```
┌──────────────────────────────────┐
│  Create Your Account             │
│  [Selected: Student]             │
├──────────────────────────────────┤
│ Full Name     [_____________]    │
│ Email         [_____________]    │
│ Password      [_____________]    │
│ Confirm Pwd   [_____________]    │
│                                  │
│  [Back]  [Create Account]        │
└──────────────────────────────────┘
```

### Step 3: Redirect to Dashboard
```
After signup → /dashboard
            → StudentDashboard (if role = student)
            → InstructorDashboard (if role = instructor)
            → AdminDashboard (if role = admin)
```

---

## 🔐 AUTHENTICATION FLOW

### Login/Signup
```
User enters credentials
        ↓
AuthContext.signUp() or signIn()
        ↓
Supabase Auth
        ↓
Create profile record
        ↓
Store in context
        ↓
Navigate to /dashboard
```

### Protected Route Verification
```
ProtectedRoute component
        ↓
Check if user exists
        ↓
Check if profile exists
        ↓
Allow access or redirect to /login
```

### Role-Based Routing
```
DashboardRouter component
        ↓
Read profile.role from AuthContext
        ↓
Route to appropriate dashboard:
├─ Student     → StudentDashboard
├─ Instructor  → InstructorDashboard
└─ Admin       → AdminDashboard
```

---

## 📋 COMPONENT RESPONSIBILITIES

### ProtectedRoute.jsx
- ✅ Checks if user is authenticated
- ✅ Checks if specific role is required
- ✅ Redirects to login if not authenticated
- ✅ Shows loading state during auth check

### LandingPage.jsx
- ✅ Shows public landing page
- ✅ Features section
- ✅ CTA buttons (Sign Up, Sign In)
- ✅ Statistics
- ✅ No authentication required

### LoginPage.jsx
- ✅ Email/password login form
- ✅ Error handling
- ✅ Links to signup & landing page
- ✅ Loading states

### SignupPage.jsx
- ✅ 2-step signup process
- ✅ User type selection
- ✅ Account details form
- ✅ Validation
- ✅ Role assignment on signup

### DashboardRouter.jsx
- ✅ Routes based on user role
- ✅ Handles loading states
- ✅ Error handling for missing profile

### StudentDashboard.jsx
- ✅ Browse courses
- ✅ Search & filter
- ✅ Play enrolled courses
- ✅ Navigation bar
- ✅ User menu

### InstructorDashboard.jsx
- ✅ Create/edit/delete courses
- ✅ Manage lessons
- ✅ View student enrollment
- ✅ Analytics

### AdminDashboard.jsx
- ✅ User management
- ✅ Course moderation
- ✅ Platform analytics
- ✅ System controls

---

## 🔄 MIGRATION GUIDE

### Old Structure (All-in-One Home.jsx)
```
Home.jsx
├─ Login logic
├─ Signup logic
├─ Student viewing
├─ Instructor dashboard
└─ Admin dashboard
```

### New Structure (Segregated)
```
App.jsx (Router)
├─ Public Routes
│  ├─ LandingPage
│  ├─ LoginPage
│  └─ SignupPage
│
└─ Protected Routes
   └─ DashboardRouter
      ├─ StudentDashboard
      ├─ InstructorDashboard
      └─ AdminDashboard
```

**Benefits**:
✅ Better code organization  
✅ Easier to maintain  
✅ Better role-based access control  
✅ Cleaner component separation  
✅ Easier testing  

---

## 🚀 NEXT STEPS

1. ✅ App.jsx updated with routing
2. ✅ ProtectedRoute component created
3. ✅ LandingPage created
4. ✅ LoginPage created
5. ✅ SignupPage created (with user type selection)
6. ✅ DashboardRouter created
7. ✅ StudentDashboard created
8. ⏳ InstructorDashboard needs updates
9. ⏳ AdminDashboard needs updates
10. ⏳ AuthContext needs enhancement for roles

---

## 📞 ROUTING REFERENCE TABLE

| Route | Component | Auth Required | User Types | Purpose |
|-------|-----------|---------------|-----------|---------|
| `/` | LandingPage | No | All | Public landing |
| `/login` | LoginPage | No | All | User login |
| `/signup` | SignupPage | No | All | User registration |
| `/dashboard` | DashboardRouter | Yes | All | Role-based dashboard |
| `/home` | EduFlowPlatform | Yes | All | Legacy fallback |

---

## ✅ VERIFICATION CHECKLIST

- [x] App.jsx has Routes
- [x] ProtectedRoute guard exists
- [x] LandingPage created
- [x] LoginPage created
- [x] SignupPage with user type selection created
- [x] DashboardRouter created
- [x] StudentDashboard created
- [ ] InstructorDashboard updated
- [ ] AdminDashboard updated
- [ ] AuthContext enhanced

---

**Status**: 70% Complete ✅
**Next**: Update InstructorDashboard and AdminDashboard components
