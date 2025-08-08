import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const WorkoutForm = React.lazy(() => import('./pages/WorkoutForm'));
const NutritionForm = React.lazy(() => import('./pages/NutritionForm'));
const Preferences = React.lazy(() => import('./pages/Preferences'));
const Programs = React.lazy(() => import('./pages/Programs'));
const Nutrition = React.lazy(() => import('./pages/Nutrition'));
const About = React.lazy(() => import('./pages/About'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const BlogForm = React.lazy(() => import('./pages/admin/BlogForm'));
const BlogManagement = React.lazy(() => import('./pages/admin/BlogManagement'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const NewsletterManagement = React.lazy(() => import('./pages/admin/NewsletterManagement'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const SecuritySettings = React.lazy(() => import('./components/SecuritySettings'));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
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
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/security"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <SecuritySettings />
                    </div>
                  </div>
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
          </Suspense>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
