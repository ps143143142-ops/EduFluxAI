import React, { useState, useEffect, useMemo } from 'react';
import { Course, User } from '../../types';
import Card from '../ui/Card';
import * as api from '../../services/apiService';

const CourseCard: React.FC<{ course: Course; isAdmin: boolean; isEnrolled: boolean; onClick: () => void; }> = ({ course, isAdmin, isEnrolled, onClick }) => (
    <Card className="flex flex-col cursor-pointer" onClick={onClick}>
        <img className="h-48 w-full object-cover" src={course.imageUrl} alt={course.title} />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{course.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 flex-grow text-sm">{course.description}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">By {course.instructor}</p>
            <div className="mt-4">
                {course.tags.map(tag => (
                    <span key={tag} className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                 {course.type === 'free' ? (
                    <p className="text-2xl font-bold text-green-500">Free</p>
                ) : (
                    <p className="text-2xl font-bold text-indigo-500">${course.price}</p>
                )}
                {isAdmin ? (
                     <div className="space-x-2">
                        <button onClick={(e) => e.stopPropagation()} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
                        <button onClick={(e) => e.stopPropagation()} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                    </div>
                ) : (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(); // Trigger same navigation as card click
                        }}
                        disabled={isEnrolled}
                        className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isEnrolled ? 'View Course' : 'View Details'}
                    </button>
                )}
            </div>
        </div>
    </Card>
);


const AddCourseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Omit<Course, 'id' | 'imageUrl' | 'modules' | 'downloads'>) => void;
}> = ({ isOpen, onClose, onAddCourse }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        price: 0,
        tags: '',
        type: 'paid' as 'paid' | 'free',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCourse({ ...formData, price: Number(formData.price), tags: formData.tags.split(',').map(t => t.trim()) });
        // Reset form
        setFormData({ title: '', description: '', instructor: '', price: 0, tags: '', type: 'paid' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card className="w-full max-w-lg p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-3xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-center mb-6">Add New Course</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md">
                        <option value="paid">Paid</option>
                        <option value="free">Free</option>
                    </select>
                    <button type="submit" className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">Add Course</button>
                </form>
            </Card>
        </div>
    );
};


interface CoursesPageProps {
  currentUser: User;
  navigateToCourse: (courseId: string) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ currentUser, navigateToCourse }) => {
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filters, setFilters] = useState({ searchTerm: '', tag: '', price: 'all' as 'all' | 'paid' | 'free' });
    const allTags = useMemo(() => api.getCourseTags(), []);

    useEffect(() => {
        const courses = api.getCourses(filters);
        setFilteredCourses(courses);
    }, [filters]);

    const isAdmin = currentUser?.role === 'admin';

    const handleAddCourse = (newCourseData: Omit<Course, 'id' | 'imageUrl' | 'modules' | 'downloads'>) => {
        api.addCourse(newCourseData);
        // Refresh the course list with the new course
        setFilters({ searchTerm: '', tag: '', price: 'all' }); // Reset filters to show new course
        setShowAddModal(false);
    };
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{isAdmin ? 'Manage Courses' : 'Explore Courses'}</h1>
        {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700">
                Add New Course
            </button>
        )}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
                type="text"
                name="searchTerm"
                placeholder="Search courses..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="md:col-span-1 p-2 bg-white dark:bg-slate-700 border rounded-md"
            />
            <select name="tag" value={filters.tag} onChange={handleFilterChange} className="md:col-span-1 p-2 bg-white dark:bg-slate-700 border rounded-md">
                <option value="">All Categories</option>
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <div className="md:col-span-1 flex items-center justify-around bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                 {['all', 'paid', 'free'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="price"
                            value={type}
                            checked={filters.price === type}
                            onChange={handleFilterChange}
                            className="form-radio text-indigo-600"
                        />
                        <span className="capitalize">{type}</span>
                    </label>
                 ))}
            </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            isAdmin={isAdmin} 
            onClick={() => navigateToCourse(course.id)}
            isEnrolled={currentUser.enrolledCourses.includes(course.id)}
          />
        ))}
      </div>
      {filteredCourses.length === 0 && <p className="text-center text-slate-500 col-span-full">No courses match your criteria.</p>}
      <AddCourseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddCourse={handleAddCourse} />
    </div>
  );
};

export default CoursesPage;