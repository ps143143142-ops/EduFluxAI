
import React, { useState, useCallback } from 'react';
import { recommendCareerPath } from '../../services/geminiService';
import { CareerPath } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

const CareerQuizPage: React.FC = () => {
    const [answers, setAnswers] = useState({
        interests: '',
        activities: '',
        learningStyle: '',
        goal: ''
    });
    const [result, setResult] = useState<CareerPath | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAnswers(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const careerPath = await recommendCareerPath(answers);
            setResult(careerPath);
        } catch (err: any) {
            setError(err.message || 'Failed to get career recommendation.');
        } finally {
            setIsLoading(false);
        }
    }, [answers]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">AI Career Recommendation Engine</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Answer a few questions and let our AI find the perfect tech career path for you.</p>

            {!result && (
                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What are your interests? (e.g., problem-solving, design, data)</label>
                            <input type="text" name="interests" value={answers.interests} onChange={handleChange} required className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What activities do you enjoy most?</label>
                            <select name="activities" value={answers.activities} onChange={handleChange} required className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                <option value="">Select an option</option>
                                <option value="Building tangible products">Building tangible products</option>
                                <option value="Analyzing data and finding patterns">Analyzing data and finding patterns</option>
                                <option value="Automating processes and systems">Automating processes and systems</option>
                                <option value="Creating user-friendly interfaces">Creating user-friendly interfaces</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What's your preferred learning style?</label>
                            <select name="learningStyle" value={answers.learningStyle} onChange={handleChange} required className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                <option value="">Select an option</option>
                                <option value="Project-based and hands-on">Project-based and hands-on</option>
                                <option value="Theoretical and reading-focused">Theoretical and reading-focused</option>
                                <option value="Visual, through videos and tutorials">Visual, through videos and tutorials</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What is your primary career goal?</label>
                            <input type="text" name="goal" value={answers.goal} onChange={handleChange} placeholder="e.g., High salary, work-life balance, cutting-edge tech" required className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isLoading ? <Spinner /> : 'Find My Career Path'}
                        </button>
                    </form>
                </Card>
            )}

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            {result && (
                <Card className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-2 text-indigo-500">Your Recommended Career Path: {result.name}</h2>
                    <p className="text-center text-slate-600 dark:text-slate-300 mb-6">{result.description}</p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Learning Plan</h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                                {result.learningPlan.map((step, i) => <li key={i}>{step}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-xl font-bold mb-2">Suggested Certifications</h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                                {result.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-xl font-bold mb-2">Where to Find Jobs</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.jobPortals.map((portal, i) => (
                                    <span key={i} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full">{portal}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setResult(null)} className="mt-8 w-full px-6 py-3 text-lg font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-200 dark:hover:bg-slate-600">
                        Take Quiz Again
                    </button>
                </Card>
            )}
        </div>
    );
};

export default CareerQuizPage;
