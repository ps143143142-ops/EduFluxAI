
import React, { useState, useCallback } from 'react';
import { generateResume } from '../../services/geminiService';
import { ResumeData } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';

const initialResumeData: ResumeData = {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '123-456-7890',
    summary: 'A highly motivated and results-oriented computer science student with a passion for developing innovative software solutions. Seeking to leverage skills in Java, Python, and web development in a challenging internship role.',
    experience: [{ title: 'Software Developer Intern', company: 'Tech Solutions Inc.', dates: 'Summer 2023', description: 'Developed and maintained features for a large-scale web application using React and Spring Boot. Wrote unit tests, increasing code coverage by 15%.' }],
    education: [{ degree: 'Bachelor of Science in Computer Science', school: 'State University', dates: '2021 - 2025' }],
    skills: 'Java, Spring Boot, Python, React, TypeScript, SQL, Git, Docker'
};

const ResumeBuilderPage: React.FC = () => {
    const [formData, setFormData] = useState<ResumeData>(initialResumeData);
    const [generatedResume, setGeneratedResume] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateResume(formData);
            setGeneratedResume(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    // Simplified Markdown to HTML renderer
    const renderMarkdown = (text: string) => {
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 border-b pb-1">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-center mb-2">$1</h1>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/^\s*<li/gm, '<ul><li')
            .replace(/<\/li>\s*$/, '</li></ul>')
            .replace(/<\/li>\s*<li/gm, '</li><li')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-white">AI Resume Builder</h1>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">Fill in your details and let our AI craft a professional resume for you.</p>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Your Information</h2>
                    {/* Simplified form for brevity. A real app would have dynamic fields. */}
                    <div>
                        <label className="font-bold">Summary</label>
                        <textarea 
                          value={formData.summary} 
                          onChange={(e) => setFormData({...formData, summary: e.target.value})}
                          className="w-full p-2 mt-1 bg-white dark:bg-slate-700 border rounded-md"
                          rows={4}
                        />
                    </div>
                     <div className="mt-4">
                        <label className="font-bold">Skills</label>
                        <input 
                          type="text"
                          value={formData.skills} 
                          onChange={(e) => setFormData({...formData, skills: e.target.value})}
                          className="w-full p-2 mt-1 bg-white dark:bg-slate-700 border rounded-md"
                          placeholder="Java, Python, React..."
                        />
                    </div>
                     <div className="mt-4">
                        <label className="font-bold">Experience</label>
                        <textarea 
                          value={formData.experience[0].description} 
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[0].description = e.target.value;
                            setFormData({...formData, experience: newExp});
                          }}
                          className="w-full p-2 mt-1 bg-white dark:bg-slate-700 border rounded-md"
                          rows={3}
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full mt-6 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isLoading ? <Spinner /> : 'Generate with AI'}
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </Card>
                
                <Card className="p-6">
                     <h2 className="text-2xl font-bold mb-4">Generated Resume</h2>
                     {generatedResume ? (
                        <div 
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedResume) }}
                        />
                     ) : (
                        <div className="text-center text-slate-500 py-10">
                            Your generated resume will appear here.
                        </div>
                     )}
                </Card>
            </div>
        </div>
    );
};

export default ResumeBuilderPage;
