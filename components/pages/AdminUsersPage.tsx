
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import * as api from '../../services/apiService';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';

const AddUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (result: { success: boolean, message: string }) => void;
}> = ({ isOpen, onClose, onAddUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' as UserRole, isVerified: true });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const result = api.addUser(formData);
            onAddUser(result);
            setIsLoading(false);
            if(result.success) {
                onClose();
            }
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card className="w-full max-w-lg p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-3xl font-bold">&times;</button>
                <h2 className="text-2xl font-bold text-center mb-6">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                     <label className="flex items-center space-x-2">
                        <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} className="form-checkbox text-indigo-600" />
                        <span>Mark as verified</span>
                    </label>
                    <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-400">
                        {isLoading ? <Spinner /> : 'Add User'}
                    </button>
                </form>
            </Card>
        </div>
    );
};


const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const fetchUsers = () => {
        setUsers(api.getAllUsers());
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleAddUserResult = (result: { success: boolean, message: string }) => {
        if (result.success) {
            setFeedback({ type: 'success', message: result.message });
            fetchUsers(); // Refresh the list
        } else {
            setFeedback({ type: 'error', message: result.message });
        }
        // Clear feedback after a few seconds
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const result = api.deleteUser(userId);
            if (result.success) {
                setFeedback({ type: 'success', message: result.message });
                fetchUsers();
            } else {
                setFeedback({ type: 'error', message: result.message });
            }
            setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
                <button onClick={() => setShowAddModal(true)} className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700">
                    Add New User
                </button>
            </div>
            
            {feedback.message && (
                <div className={`p-4 mb-4 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.message}
                </div>
            )}

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-sm font-semibold">Name</th>
                            <th className="p-3 text-sm font-semibold">Email</th>
                            <th className="p-3 text-sm font-semibold">Role</th>
                            <th className="p-3 text-sm font-semibold text-center">Verified</th>
                            <th className="p-3 text-sm font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700">
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3 text-slate-500 dark:text-slate-400">{user.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-300'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    {user.isVerified ? (
                                        <span className="text-green-500">✔</span>
                                    ) : (
                                        <span className="text-red-500">✖</span>
                                    )}
                                </td>
                                <td className="p-3 text-right">
                                    <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddUser={handleAddUserResult} />
        </div>
    );
};

export default AdminUsersPage;