import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutForm from './pages/WorkoutForm';
import NutritionForm from './pages/NutritionForm';
import Preferences from './pages/Preferences';
import Programs from './pages/Programs';
import Nutrition from './pages/Nutrition';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogForm from './pages/admin/BlogForm';
import BlogManagement from './pages/admin/BlogManagement';
import UserManagement from './pages/admin/UserManagement';
import NewsletterManagement from './pages/admin/NewsletterManagement';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/workout/new"
              element={
                <PrivateRoute>
                  <WorkoutForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/workout/edit/:id"
              element={<PrivateRoute><WorkoutForm /></PrivateRoute>}
            />
            <Route
              path="/nutrition/new"
              element={
                <PrivateRoute>
                  <NutritionForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/nutrition/edit/:id"
              element={<PrivateRoute><NutritionForm /></PrivateRoute>}
            />
            <Route
              path="/preferences"
              element={
                <PrivateRoute>
                  <Preferences />
                </PrivateRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <AdminRoute>
                  <BlogManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blogs/new"
              element={
                <AdminRoute>
                  <BlogForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blogs/edit/:id"
              element={
                <AdminRoute>
                  <BlogForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/newsletter"
              element={
                <AdminRoute>
                  <NewsletterManagement />
                </AdminRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
