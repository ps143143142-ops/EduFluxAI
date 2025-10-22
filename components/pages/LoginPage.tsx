import React, { useState } from 'react';
import Card from '../ui/Card';
import { User, Page } from '../../types';
import * as api from '../../services/apiService';
import Spinner from '../ui/Spinner';

interface LoginPageProps {
  onLogin: (user: User) => void;
  navigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigate }) => {
  const [email, setEmail] = useState('alex@eduflux.ai');
  const [password, setPassword] = useState('alex');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
        const result = api.loginUser(email, password);
        setIsLoading(false);
        if (result.success && result.user) {
            onLogin(result.user);
        } else {
            setError(result.message);
        }
    }, 500);
  };

  return (
    <div className="flex justify-center items-center py-20">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800 dark:text-white">Welcome Back!</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Login to continue your learning journey.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" 
              placeholder="alex@eduflux.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" 
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? <Spinner /> : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => navigate('register')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Don't have an account? Register here.
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
