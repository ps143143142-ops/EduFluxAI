
import React from 'react';
import Card from '../ui/Card';
import { Page } from '../../types';

interface AIToolsPageProps {
    navigate: (page: Page) => void;
}

const ToolCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <Card className="p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer" onClick={onClick}>
        <div className="flex justify-center mb-4 text-indigo-500">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm">{description}</p>
    </Card>
);


const AIToolsPage: React.FC<AIToolsPageProps> = ({ navigate }) => {
    
    const tools = [
        { 
            title: 'AI Career Advisor', 
            description: 'Get personalized career path recommendations based on your interests and goals.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            page: 'career-quiz' as Page,
        },
        { 
            title: 'AI Learning Roadmap', 
            description: 'Generate a step-by-step learning plan for any technical topic, complete with resources.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v- உண்மையில்" /></svg>,
            page: 'learning-roadmap' as Page,
        },
        { 
            title: 'AI Future Trends', 
            description: 'Discover the future skills and technologies that will shape your career path.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            page: 'future-trends' as Page,
        },
        { 
            title: 'AI Resume Builder', 
            description: 'Craft a professional, job-ready resume with the help of our AI writing assistant.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            page: 'resume-builder' as Page,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">AI Tools Hub</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Your central command for AI-powered learning and career development.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {tools.map(tool => (
                    <ToolCard 
                        key={tool.page}
                        title={tool.title}
                        description={tool.description}
                        icon={tool.icon}
                        onClick={() => navigate(tool.page)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AIToolsPage;