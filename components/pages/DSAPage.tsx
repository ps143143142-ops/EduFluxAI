import React, { useState, useCallback, useEffect } from 'react';
import { DSAProblem } from '../../types';
import Card from '../ui/Card';
import { getDSAHint } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import * as api from '../../services/apiService';

const HintModal: React.FC<{ title: string; hint: string; isLoading: boolean; onClose: () => void; }> = ({ title, hint, isLoading, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <Card className="w-full max-w-lg p-6 relative">
                 <button onClick={onClose} className="absolute top-3 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-3xl font-bold">&times;</button>
                 <h2 className="text-xl font-bold mb-4">AI Hint for: <span className="text-indigo-500">{title}</span></h2>
                 {isLoading ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                 ) : (
                    <p className="text-slate-600 dark:text-slate-300">{hint}</p>
                 )}
            </Card>
        </div>
    );
};

const PlatformTag: React.FC<{ platform: DSAProblem['platform'] }> = ({ platform }) => {
    const colorMap = {
        LeetCode: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
        HackerRank: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
        CodeChef: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
        GeeksforGeeks: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    };
    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorMap[platform]}`}>{platform}</span>
}


const DSAPage: React.FC = () => {
    const [dsaProblems, setDsaProblems] = useState<{ category: string, problems: DSAProblem[] }[]>([]);
    const [hintData, setHintData] = useState<{ problem: DSAProblem | null, hint: string, isLoading: boolean }>({ problem: null, hint: '', isLoading: false });
    
    useEffect(() => {
        setDsaProblems(api.getDsaProblems());
    }, []);
    
    const handleGetHint = useCallback(async (problem: DSAProblem) => {
        setHintData({ problem, hint: '', isLoading: true });
        try {
            const hintText = await getDSAHint(problem.title);
            setHintData({ problem, hint: hintText, isLoading: false });
        } catch (error: any) {
            setHintData({ problem, hint: error.message || 'Failed to load hint.', isLoading: false });
        }
    }, []);

    const closeHintModal = () => {
        setHintData({ problem: null, hint: '', isLoading: false });
    };

    const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300';
            case 'Medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Hard': return 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300';
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">DSA Practice Zone</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Hone your skills with curated problems and get help from our AI assistant.</p>
            
            <div className="space-y-8">
                {dsaProblems.length > 0 && dsaProblems[0]?.problems.length > 1 && (
                 <Card className="p-6 border-2 border-indigo-500">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-500 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        Recommended For You
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Based on your linked accounts, here are some problems to tackle next.</p>
                    <ul className="space-y-3">
                        {dsaProblems[0].problems.slice(0, 2).map(problem => (
                            <li key={problem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <div className="flex-grow flex items-center gap-3">
                                    <PlatformTag platform={problem.platform} />
                                    <div>
                                        <a href={problem.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{problem.title}</a>
                                        <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-0 flex gap-2 self-end sm:self-center">
                                    <button onClick={() => handleGetHint(problem)} className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Get AI Hint</button>
                                    <a href={problem.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-slate-700 rounded-md hover:bg-indigo-200 dark:hover:bg-slate-600">Solve</a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
                )}

                {dsaProblems.map(({ category, problems }) => (
                    <Card key={category} className="p-6">
                        <h2 className="text-2xl font-bold mb-4 ">{category}</h2>
                        <ul className="space-y-3">
                            {problems.map(problem => (
                                <li key={problem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <div className="flex-grow flex items-center gap-3">
                                         <PlatformTag platform={problem.platform} />
                                        <div>
                                            <a href={problem.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{problem.title}</a>
                                            <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 flex gap-2 self-end sm:self-center">
                                        <button onClick={() => handleGetHint(problem)} className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Get AI Hint</button>
                                        <a href={problem.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-slate-700 rounded-md hover:bg-indigo-200 dark:hover:bg-slate-600">Solve</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
            
            {hintData.problem && (
                <HintModal 
                    title={hintData.problem.title}
                    hint={hintData.hint}
                    isLoading={hintData.isLoading}
                    onClose={closeHintModal}
                />
            )}
        </div>
    );
};

export default DSAPage;
