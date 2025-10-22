
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../ui/Card';

const AdminDashboard: React.FC = () => {
    const revenueData = [
      { name: 'Jan', revenue: 4000 },
      { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 5000 },
      { name: 'Apr', revenue: 4500 },
      { name: 'May', revenue: 6000 },
      { name: 'Jun', revenue: 5500 },
    ];

    const courseData = [
      { name: 'Full-Stack', value: 400 },
      { name: 'AI/ML', value: 300 },
      { name: 'Frontend', value: 300 },
      { name: 'Cloud', value: 200 },
    ];
    const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

    const topCourses = [
        { name: 'Java Full-Stack Mastery', enrollments: 412 },
        { name: 'AI & Machine Learning Deep Dive', enrollments: 358 },
        { name: 'Modern Frontend with React & Tailwind', enrollments: 295 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Total Revenue</h3>
                    <p className="text-5xl font-bold text-indigo-500">$28,000</p>
                </Card>
                 <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Total Students</h3>
                    <p className="text-5xl font-bold text-indigo-500">1,250</p>
                </Card>
                 <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">Courses</h3>
                    <p className="text-5xl font-bold text-indigo-500">12</p>
                </Card>
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">New Signups (30d)</h3>
                    <p className="text-5xl font-bold text-indigo-500">82</p>
                </Card>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Revenue This Year</h2>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Top Courses</h2>
                    <ul className="space-y-4">
                       {topCourses.map((course, index) => (
                         <li key={index} className="flex justify-between items-center">
                           <span className="font-medium">{course.name}</span>
                           <span className="font-bold text-indigo-500">{course.enrollments}</span>
                         </li>
                       ))}
                    </ul>
                </Card>
                <Card className="lg:col-span-3 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Course Popularity Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={courseData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {courseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
