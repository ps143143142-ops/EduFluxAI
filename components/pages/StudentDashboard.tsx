import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { User, ExternalAccount, Course, Payment } from '../../types';
import * as api from '../../services/apiService';

interface StudentDashboardProps {
    user: User;
    navigateToCourse: (courseId: string) => void;
}

const PlatformLogo: React.FC<{ platform: ExternalAccount['platform'] }> = ({ platform }) => {
    const logoMap = {
        LeetCode: 'LC',
        HackerRank: 'HR',
        CodeChef: 'CC',
        GeeksforGeeks: 'GFG',
    };
    const colorMap = {
        LeetCode: 'bg-yellow-500',
        HackerRank: 'bg-green-500',
        CodeChef: 'bg-blue-500',
        GeeksforGeeks: 'bg-green-600',
    };
    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${colorMap[platform]}`}>
            {logoMap[platform]}
        </div>
    )
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, navigateToCourse }) => {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [transactions, setTransactions] = useState<Payment[]>([]);
    
    useEffect(() => {
        // Fetch all courses to match IDs with names for display
        setAllCourses(api.getCourses());
        setTransactions(api.getTransactionsForUser(user.id));
    }, [user.id, user.enrolledCourses]); // Re-fetch if enrolled courses or user ID changes
    
    const enrolledCourses = allCourses.filter(course => user.enrolledCourses.includes(course.id));
    
    // Aggregated Stats Logic
    const totalSolvedProblems = user.externalAccounts.reduce((sum, acc) => sum + acc.stats.solvedCount, 0);
    const averageRanking = user.externalAccounts.length > 0
        ? Math.round(user.externalAccounts.reduce((sum, acc) => sum + acc.stats.ranking, 0) / user.externalAccounts.length)
        : 0;
    const lastSyncedDate = user.externalAccounts.length > 0
        ? new Date(Math.max(...user.externalAccounts.map(acc => new Date(acc.lastSynced).getTime()))).toLocaleDateString()
        : 'N/A';

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Welcome, {user.name}!</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Enrolled Courses</h3>
                    <p className="text-5xl font-bold text-indigo-500">{enrolledCourses.length}</p>
                </Card>
                 <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">DSA Problems Solved</h3>
                    <p className="text-5xl font-bold text-indigo-500">{totalSolvedProblems}</p>
                </Card>
                 <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Overall Progress</h3>
                    <p className="text-5xl font-bold text-indigo-500">48%</p>
                </Card>
                 <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Certificates Earned</h3>
                    <p className="text-5xl font-bold text-indigo-500">1</p>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Your Enrolled Courses</h2>
                        <div className="space-y-4">
                            {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                                <div key={course.id} className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <div>
                                        <h4 className="font-bold text-lg">{course.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">by {course.instructor}</p>
                                    </div>
                                    <button onClick={() => navigateToCourse(course.id)} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                        Continue Learning
                                    </button>
                                </div>
                            )) : <p className="text-slate-500 dark:text-slate-400">You are not enrolled in any courses yet.</p>}
                        </div>
                    </Card>
                     <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Transaction History</h2>
                        {transactions.length > 0 ? (
                             <table className="w-full text-left">
                                <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="p-2 text-sm font-semibold">Course</th>
                                        <th className="p-2 text-sm font-semibold text-right">Amount</th>
                                        <th className="p-2 text-sm font-semibold text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => {
                                        const course = allCourses.find(c => c.id === tx.courseId);
                                        return (
                                             <tr key={tx.transactionId} className="border-b border-slate-200 dark:border-slate-700">
                                                <td className="p-2">{course?.title || 'Unknown Course'}</td>
                                                <td className="p-2 text-right font-medium">${tx.amount.toFixed(2)}</td>
                                                <td className="p-2 text-right text-sm text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400">No payment history found.</p>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Competitive Programming Stats</h2>
                        {user.externalAccounts.length > 0 ? (
                             <div className="space-y-4">
                                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Total Solved</h3>
                                    <p className="text-3xl font-bold text-indigo-500">{totalSolvedProblems}</p>
                                    <h3 className="font-bold text-lg mt-2 text-slate-800 dark:text-white">Avg. Rank</h3>
                                    <p className="text-2xl font-bold text-indigo-500">~{averageRanking.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Last Synced: {lastSyncedDate}</p>
                                </div>
                                {user.externalAccounts.map(account => (
                                    <div key={account.platform} className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <PlatformLogo platform={account.platform} />
                                        <div>
                                            <h4 className="font-bold">{account.platform}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Solved: {account.stats.solvedCount}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400">No accounts linked yet. Link your accounts in settings to track your progress!</p>
                        )}
                       
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;