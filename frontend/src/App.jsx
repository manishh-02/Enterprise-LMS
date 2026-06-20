import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Layouts & Components
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import AssessmentEngine from './pages/AssessmentEngine';
// Pages
import AdminUserManagement from './pages/AdminUserManagement';
import Login from './pages/Login';
import AddCourse from './pages/AddCourse';
import Courses from './pages/Courses';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CoursePlayer from './pages/CoursePlayer';
import HRDashboard from './pages/HRDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/assessment" element={<AssessmentEngine />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        
        {/* 🚨 THE FIX: Instructor ko uska naya, alag aur secure rasta de diya */}
        <Route 
          path="/instructor/dashboard" 
          element={
            <PrivateRoute allowedRoles={['Instructor', 'Admin']}>
              <InstructorDashboard />
            </PrivateRoute>
          } 
        />

        {/* PROTECTED ROUTE: NEW EMPLOYEE DASHBOARD */}
        <Route 
          path="/employee/dashboard" 
          element={
            <PrivateRoute allowedRoles={['Student', 'Employee', 'Admin']}>
              <EmployeeDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/player" 
          element={
            <PrivateRoute allowedRoles={['Student', 'Employee', 'Admin']}>
              <CoursePlayer />
            </PrivateRoute>
          } 
        />

        {/* PROTECTED ROUTES: ENTERPRISE DASHBOARD (Admin's Domain) */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['Admin', 'HR', 'Instructor']}>
            <DashboardLayout />
          </PrivateRoute>
        }>
          
          {/* Default view */}
          <Route index element={<AnalyticsDashboard />} />
          
          {/* Analytics (HR & Admin only) */}
          <Route path="analytics" element={
            <PrivateRoute allowedRoles={['Admin', 'HR']}>
              <AnalyticsDashboard />
            </PrivateRoute>
          } />

          {/* User Management (Admin only) */}
          <Route path="users" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminUserManagement />
            </PrivateRoute>
          } />

          {/* 🚨 ADMIN COURSE MANAGEMENT: Ye ab bilkul safe hai aur purane AWS tareeke se chalega */}
          <Route path="courses" element={
            <PrivateRoute allowedRoles={['Admin', 'Instructor']}>
              <Courses />
            </PrivateRoute>
          } />

          <Route path="add-course" element={
            <PrivateRoute allowedRoles={['Admin', 'Instructor']}>
              <AddCourse />
            </PrivateRoute>
          } />
          
          {/* Assessments */}
          <Route path="assessments" element={
            <div style={{ padding: '20px' }}>
              <h2 style={{ color: '#0f172a', fontWeight: '800' }}>Live Assessments</h2>
              <p style={{ color: '#64748b' }}>AI-based test evaluation interface is currently under system upgrade.</p>
            </div>
          } />
          
        </Route>

        {/* Catch all unauthorized or invalid routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;