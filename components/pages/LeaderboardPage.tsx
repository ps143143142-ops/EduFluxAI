import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { LeaderboardUser, User } from '../../types';
import * as api from '../../services/apiService';

interface LeaderboardPageProps {
    currentUser: User | null;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ currentUser }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        setLeaderboard(api.getLeaderboard());
    }, []);

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-yellow-400 text-yellow-900';
        if (rank === 2) return 'bg-slate-300 text-slate-800';
        if (rank === 3) return 'bg-yellow-600/70 text-yellow-900';
        return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">DSA Leaderboard</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">See who's at the top of their game. Rankings are based on total problems solved across all linked platforms.</p>
            
            <Card className="overflow-hidden">
                <div className="p-6">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Rank</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Name</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-right">Problems Solved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user) => (
                                <tr key={user.id} className={`border-b border-slate-200 dark:border-slate-700 ${user.id === currentUser?.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`}>
                                    <td className="p-3">
                                        <span className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${getRankColor(user.rank)}`}>
                                            {user.rank}
                                        </span>
                                    </td>
                                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{user.name}</td>
                                    <td className="p-3 font-bold text-indigo-500 text-right text-lg">{user.totalSolved}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default LeaderboardPage;
