import React from 'react';
import { User, Page } from '../../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  navigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, navigate }) => {
    const navLinkClasses = "px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";

    const renderNavLinks = () => {
        if (!currentUser) {
            return null;
        }
        if (currentUser.role === 'student') {
            return (
                <>
                    <button onClick={() => navigate('student-dashboard')} className={navLinkClasses}>Dashboard</button>
                    <button onClick={() => navigate('courses')} className={navLinkClasses}>Courses</button>
                    <button onClick={() => navigate('dsa-problems')} className={navLinkClasses}>DSA Problems</button>
                     <button onClick={() => navigate('dsa-leaderboard')} className={navLinkClasses}>Leaderboard</button>
                    <button onClick={() => navigate('resources')} className={navLinkClasses}>Resources</button>
                    <button onClick={() => navigate('learning-roadmap')} className={navLinkClasses}>AI Roadmap</button>
                    <button onClick={() => navigate('career-quiz')} className={navLinkClasses}>Career Quiz</button>
                    <button onClick={() => navigate('future-trends')} className={navLinkClasses}>Future Trends</button>
                    <button onClick={() => navigate('resume-builder')} className={navLinkClasses}>AI Resume Builder</button>
                </>
            )
        }
        if (currentUser.role === 'admin') {
            return (
                 <>
                    <button onClick={() => navigate('admin-dashboard')} className={navLinkClasses}>Dashboard</button>
                    <button onClick={() => navigate('courses')} className={navLinkClasses}>Manage Courses</button>
                </>
            )
        }
    }

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => navigate(currentUser ? (currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard') : 'home')} className="flex-shrink-0 flex items-center gap-2">
               <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
              <span className="text-xl font-bold text-slate-800 dark:text-white">EduFluxAI</span>
            </button>
          </div>
          <nav className="hidden md:flex items-center">
            {renderNavLinks()}
          </nav>
          <div className="flex items-center">
            {currentUser ? (
              <div className='flex items-center gap-4'>
                 <button onClick={() => navigate('profile-settings')} className='text-sm font-medium hidden sm:block hover:text-indigo-500'>Welcome, {currentUser.name}</button>
                 <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;