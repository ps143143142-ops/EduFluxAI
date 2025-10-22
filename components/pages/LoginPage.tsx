
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
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('alex@eduflux.ai');
  const [password, setPassword] = useState('alex');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
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

  const handleRequestOtp = () => {
      setError('');
      setMessage('');
      setIsLoading(true);
      setTimeout(() => {
          const result = api.requestLoginOtp(email);
          setIsLoading(false);
          if (result.success) {
              setMessage(result.message);
              setIsOtpSent(true);
          } else {
              setError(result.message);
          }
      }, 500);
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      setTimeout(() => {
          const result = api.loginWithOtp(email, otp);
          setIsLoading(false);
          if(result.success && result.user) {
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
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Login to continue your learning journey.</p>
        
        <div className="flex justify-center mb-6 border border-slate-300 dark:border-slate-600 rounded-lg p-1">
            <button 
                onClick={() => setLoginMode('password')}
                className={`w-1/2 py-2 rounded-md font-semibold ${loginMode === 'password' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
                Password
            </button>
            <button 
                onClick={() => setLoginMode('otp')}
                className={`w-1/2 py-2 rounded-md font-semibold ${loginMode === 'otp' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
                Email OTP
            </button>
        </div>
        
        {loginMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="alex@eduflux.ai"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="••••••••"/>
                </div>
                <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                    {isLoading ? <Spinner /> : 'Login'}
                </button>
            </form>
        ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="flex gap-2">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-grow w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="alex@eduflux.ai" disabled={isOtpSent}/>
                        <button type="button" onClick={handleRequestOtp} disabled={isLoading || isOtpSent} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                           {isLoading ? <Spinner /> : (isOtpSent ? 'Sent' : 'Get OTP')}
                        </button>
                    </div>
                 </div>
                 {isOtpSent && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter OTP</label>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className="w-full p-2 text-center tracking-[0.5em] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"/>
                        <button type="submit" disabled={isLoading} className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-400">
                           {isLoading ? <Spinner /> : 'Login with OTP'}
                        </button>
                    </div>
                 )}
            </form>
        )}

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mt-4">{message}</p>}

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