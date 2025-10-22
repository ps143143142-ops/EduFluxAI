import React, { useState, useEffect } from 'react';
import { Resource, ResourceType } from '../../types';
import Card from '../ui/Card';
import * as api from '../../services/apiService';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
    const iconMap: Record<ResourceType, React.ReactNode> = {
        youtube: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        book: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        article: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        pdf: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
        link: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    };

    return (
        <Card className="p-4">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 h-full">
                <div className="flex-shrink-0">{iconMap[resource.type]}</div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-slate-800 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">{resource.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">{resource.description}</p>
                    <span className="mt-2 inline-block bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full self-start">{resource.category}</span>
                </div>
            </a>
        </Card>
    );
};

const ResourcesPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);

    useEffect(() => {
        setResources(api.getResources());
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">Free Learning Resources</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">A curated library of high-quality tutorials, books, and articles to supplement your learning.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
        </div>
    );
};

export default ResourcesPage;
