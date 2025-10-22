
import React from 'react';
import { User, Page } from '../../types';

interface SidebarProps {
  currentUser: User | null;
  onLogout: () => void;
  navigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, navigate }) => {
    const navLinkClasses = "flex items-center w-full px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";
    
    const iconMap: Record<string, React.ReactNode> = {
        Dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        Courses: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        Settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        Users: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        AITools: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    }

    const renderNavLinks = () => {
        if (!currentUser) {
            return (
                 <>
                    <button onClick={() => navigate('courses')} className={navLinkClasses}>Courses</button>
                    <button disabled className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>About Us</button>
                    <button disabled className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Contact</button>
                </>
            );
        }
        if (currentUser.role === 'student') {
            return (
                <>
                    <button onClick={() => navigate('student-dashboard')} className={navLinkClasses}>{iconMap.Dashboard}Dashboard</button>
                    <button onClick={() => navigate('courses')} className={navLinkClasses}>{iconMap.Courses}My Courses</button>
                    <button onClick={() => navigate('ai-tools')} className={navLinkClasses}>{iconMap.AITools}AI Tools</button>
                    <button disabled className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Messages</button>
                    <button onClick={() => navigate('profile-settings')} className={navLinkClasses}>{iconMap.Settings}Settings</button>
                </>
            )
        }
        if (currentUser.role === 'admin') {
            return (
                 <>
                    <button onClick={() => navigate('admin-dashboard')} className={navLinkClasses}>{iconMap.Dashboard}Dashboard</button>
                    <button onClick={() => navigate('courses')} className={navLinkClasses}>{iconMap.Courses}Manage Courses</button>
                    <button onClick={() => navigate('admin-users')} className={navLinkClasses}>{iconMap.Users}Manage Users</button>
                    <button disabled className={`${navLinkClasses} opacity-50 cursor-not-allowed`}>Messages</button>
                    <button onClick={() => navigate('profile-settings')} className={navLinkClasses}>{iconMap.Settings}Settings</button>
                </>
            )
        }
    }

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 h-screen sticky top-0 flex flex-col p-4 shadow-md">
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2">
         <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
         </svg>
        <span className="text-xl font-bold text-slate-800 dark:text-white">EduFluxAI</span>
      </div>
      
      <nav className="mt-8 flex-grow space-y-2">
        {renderNavLinks()}
      </nav>

      <div className="flex-shrink-0 mt-auto">
        {currentUser ? (
          <div className='p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg'>
             <div className='text-sm font-medium'>Welcome, {currentUser.name}</div>
             <button
                onClick={onLogout}
                className="w-full mt-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
            >
                Logout
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => navigate('login')}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate('register')}
              className="w-full px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-md shadow-sm hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;