
import React, { useState, useCallback, useEffect } from 'react';
import { User, Page } from './types';
import Header from './components/layout/Header'; // This is now the Sidebar
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import StudentDashboard from './components/pages/StudentDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import CoursesPage from './components/pages/CoursesPage';
import LearningRoadmapPage from './components/pages/LearningRoadmapPage';
import CareerQuizPage from './components/pages/CareerQuizPage';
import ResumeBuilderPage from './components/pages/ResumeBuilderPage';
import DSALearningPage from './components/pages/DSALearningPage';
import AIAssistantChatbot from './components/AIAssistantChatbot';
import FutureTrendsPage from './components/pages/FutureTrendsPage';
import DSAPage from './components/pages/DSAPage';
import ResourcesPage from './components/pages/ResourcesPage';
import ProfileSettingsPage from './components/pages/ProfileSettingsPage';
import LeaderboardPage from './components/pages/LeaderboardPage';
import CourseDetailPage from './components/pages/CourseDetailPage';
import AdminUsersPage from './components/pages/AdminUsersPage';
import AIToolsPage from './components/pages/AIToolsPage';
import * as api from './services/apiService';
import {
  createToken,
  decodeToken,
  getToken,
  isTokenExpired,
  removeToken,
  setToken
} from './utils/auth';
import Spinner from './components/ui/Spinner';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('learning-roadmap');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check for token on initial load
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && !isTokenExpired(decoded.exp)) {
        // Token is valid, fetch the latest user data from our "DB"
        const freshUser = api.getUserById(decoded.user.id);
        if (freshUser) {
            setCurrentUser(freshUser);
            // On fresh load, if not navigating somewhere specific, send user to dashboard
            if (currentPage === 'home' || currentPage === 'login' || currentPage === 'register') {
               setCurrentPage(freshUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
            }
        } else {
            // User might have been deleted, clear token
            removeToken();
        }
      } else {
        removeToken();
      }
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    const token = createToken(user);
    setToken(token);
    setCurrentUser(user);
    setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const handleLogout = useCallback(() => {
    removeToken();
    setCurrentUser(null);
    setCurrentPage('home');
    setSelectedCourseId(null);
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);
  
  const navigateToCourse = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
  }, []);
  
  const handleUpdateUser = useCallback((updatedUser: User) => {
      const result = api.updateUser(updatedUser);
      if(result.success && result.user) {
        setCurrentUser(result.user);
        // Refresh the token with updated user data
        const token = createToken(result.user);
        setToken(token);
      }
      return result;
  }, []);

  // Route protection logic
  useEffect(() => {
    if (isAuthLoading) return; // Wait until auth check is complete

    const protectedPages: Page[] = [
        'student-dashboard', 'admin-dashboard', 'courses', 'learning-roadmap', 
        'career-quiz', 'resume-builder', 'dsa-learning', 'future-trends', 
        'dsa-problems', 'resources', 'profile-settings', 'dsa-leaderboard', 'course-detail',
        'admin-users', 'ai-tools'
    ];
    
    // Redirect unauthenticated users from protected pages
    if (!currentUser && protectedPages.includes(currentPage)) {
        setCurrentPage('login');
    }
    
    // Redirect authenticated users from public-only pages (login, register)
    if (currentUser && (currentPage === 'login' || currentPage === 'register')) {
        setCurrentPage(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    }

  }, [currentPage, currentUser, isAuthLoading]);

  if (isAuthLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 justify-center items-center">
            <Spinner />
        </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} navigate={navigate} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={handleLogin} navigate={navigate} />;
      case 'student-dashboard':
        return currentUser ? <StudentDashboard user={currentUser} navigateToCourse={navigateToCourse} /> : null;
      case 'admin-dashboard':
        return currentUser?.role === 'admin' ? <AdminDashboard navigate={navigate} /> : null;
      case 'admin-users':
        return currentUser?.role === 'admin' ? <AdminUsersPage /> : null;
      case 'courses':
        return currentUser ? <CoursesPage currentUser={currentUser} navigateToCourse={navigateToCourse} /> : null;
      case 'course-detail':
        return selectedCourseId ? <CourseDetailPage courseId={selectedCourseId} currentUser={currentUser} onUpdateUser={handleUpdateUser} /> : null;
      case 'learning-roadmap':
        return <LearningRoadmapPage />;
      case 'career-quiz':
        return <CareerQuizPage />;
      case 'ai-tools':
          return <AIToolsPage navigate={navigate} />;
      case 'resume-builder':
        return <ResumeBuilderPage />;
      case 'dsa-learning':
        return <DSALearningPage />;
      case 'future-trends':
        return <FutureTrendsPage />;
      case 'dsa-problems':
        return <DSAPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'profile-settings':
        return currentUser ? <ProfileSettingsPage user={currentUser} onUpdateUser={handleUpdateUser} /> : null;
      case 'dsa-leaderboard':
        return <LeaderboardPage currentUser={currentUser} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header currentUser={currentUser} onLogout={handleLogout} navigate={navigate} /> {/* This is now the Sidebar */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">
          {renderPage()}
        </main>
        <Footer />
      </div>
      {currentUser && currentUser.role === 'student' && <AIAssistantChatbot />}
    </div>
  );
};

export default App;