
import React, { useState, useEffect, useCallback } from 'react';
import { Course, User } from '../../types';
import * as api from '../../services/apiService';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';

const DownloadIcon: React.FC<{ type: 'pdf' | 'zip' }> = ({ type }) => {
    if (type === 'pdf') {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
};

interface CourseDetailPageProps {
    courseId: string;
    currentUser: User | null;
    onUpdateUser: (user: User) => void;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, currentUser, onUpdateUser }) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchedCourse = api.getCourseById(courseId);
        if (fetchedCourse) {
            setCourse(fetchedCourse);
        }
        setIsLoading(false);
    }, [courseId, currentUser]); // Rerun when currentUser changes to reflect new enrollment

    const handleEnrollment = useCallback(() => {
        if (!course || !currentUser) return;
        
        const updatedUser = {
            ...currentUser,
            enrolledCourses: [...currentUser.enrolledCourses, course.id]
        };
        onUpdateUser(updatedUser);
        alert(`You have successfully enrolled in the free course: "${course.title}"!`);
    }, [course, currentUser, onUpdateUser]);

    const handlePayment = useCallback(() => {
        if (!course || !currentUser) return;

        const options = {
            key: 'rzp_test_ILzaLVL3eG19O1', // Using a public test key
            amount: course.price * 100,
            currency: 'USD',
            name: 'EduFluxAI',
            description: `Payment for ${course.title}`,
            image: 'https://picsum.photos/seed/logo/128/128',
            handler: function (response: any) {
                console.log(response);
                // 1. Process the payment and create a transaction record
                api.processPayment(currentUser.id, course.id, course.price, response.razorpay_payment_id);
                
                // 2. Enroll the user in the course
                const updatedUser = {
                    ...currentUser,
                    enrolledCourses: [...currentUser.enrolledCourses, course.id]
                };
                onUpdateUser(updatedUser);
                alert(`Payment successful! You are now enrolled in "${course.title}". A confirmation email has been sent.`);
            },
            prefill: {
                name: currentUser.name,
                email: currentUser.email,
            },
            notes: {
                course_id: course.id,
                user_id: currentUser.id,
            },
            theme: {
                color: '#6366f1',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    }, [course, currentUser, onUpdateUser]);


    if (isLoading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    if (!course) {
        return <div className="text-center py-20">Course not found.</div>;
    }
    
    const isEnrolled = currentUser?.enrolledCourses.includes(course.id);

    // --- ENROLLED VIEW ---
    if (isEnrolled) {
        const completedModules = course.modules.filter(m => m.status === 'Completed').length;
        const totalModules = course.modules.length;
        const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

        return (
            <Card className="p-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{course.title}</h1>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                            <p className="text-white">Video Player Placeholder</p>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{progress.toFixed(0)}% Completed</p>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Course Content</h2>
                            <ul className="space-y-2">
                                {course.modules.map((module, index) => (
                                    <li key={index} className="flex items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                                        {module.status === 'Completed' ? 
                                            <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> :
                                            <div className={`h-5 w-5 mr-3 rounded-full border-2 ${module.status === 'In Progress' ? 'border-indigo-500' : 'border-slate-400'}`}></div>
                                        }
                                        <span className={module.status === 'Completed' ? 'line-through text-slate-500' : ''}>{module.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Downloads</h2>
                            <ul className="space-y-2">
                                {course.downloads.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.url} download className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                                            <DownloadIcon type={item.type} />
                                            <span className="font-medium text-sm">{item.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // --- NOT ENROLLED VIEW ---
    return (
        <div className="max-w-5xl mx-auto">
            <Card className="grid md:grid-cols-2 overflow-hidden">
                <img src={course.imageUrl} alt={course.title} className="w-full h-64 md:h-full object-cover"/>
                <div className="p-8 flex flex-col">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">By {course.instructor}</p>
                    <div className="mt-2">
                        {course.tags.map(tag => (
                            <span key={tag} className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-4 flex-grow">{course.description}</p>
                    
                    <div className="mt-6">
                        {course.type === 'free' ? (
                            <button 
                                onClick={handleEnrollment}
                                className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                                Enroll for Free
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="text-4xl font-bold text-indigo-500 mb-4">${course.price}</p>
                                <button
                                    onClick={handlePayment} 
                                    className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
                                    Buy Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CourseDetailPage;