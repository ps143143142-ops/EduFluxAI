import React, { useState } from 'react';
import Card from '../ui/Card';
import { User, ExternalAccount } from '../../types';
import * as syncService from '../../services/syncService';
import Spinner from '../ui/Spinner';

interface ProfileSettingsPageProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const PlatformLogo: React.FC<{ platform: ExternalAccount['platform'] }> = ({ platform }) => {
    const logoMap = {
        LeetCode: 'LC',
        HackerRank: 'HR',
        CodeChef: 'CC',
        GeeksforGeeks: 'GFG',
    };
    const colorMap = {
        LeetCode: 'bg-yellow-500',
        HackerRank: 'bg-green-500',
        CodeChef: 'bg-blue-500',
        GeeksforGeeks: 'bg-green-600',
    };
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${colorMap[platform]}`}>
            {logoMap[platform]}
        </div>
    )
};


const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onUpdateUser }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({ platform: 'LeetCode' as ExternalAccount['platform'], username: '', profileUrl: '', apiKey: '' });
    const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);

    const handleSync = async (accountToSync: ExternalAccount) => {
        setSyncingPlatform(accountToSync.platform);
        try {
            const updatedAccount = await syncService.syncAccount(accountToSync);
            const updatedExternalAccounts = user.externalAccounts.map(acc => 
                acc.platform === updatedAccount.platform ? updatedAccount : acc
            );
            onUpdateUser({ ...user, externalAccounts: updatedExternalAccounts });
        } catch (error) {
            console.error("Failed to sync account:", error);
            alert("Failed to sync account. Please try again.");
        } finally {
            setSyncingPlatform(null);
        }
    };
    
    const handleUnlink = (platform: string) => {
        if (window.confirm(`Are you sure you want to unlink your ${platform} account?`)) {
            const updatedUser = {
                ...user,
                externalAccounts: user.externalAccounts.filter(acc => acc.platform !== platform),
            };
            onUpdateUser(updatedUser);
        }
    };

    const handleAddAccount = (e: React.FormEvent) => {
        e.preventDefault();

        if (user.externalAccounts.some(acc => acc.platform === newAccount.platform)) {
            alert(`You have already linked a ${newAccount.platform} account.`);
            return;
        }

        const accountToAdd: ExternalAccount = {
            platform: newAccount.platform,
            username: newAccount.username,
            profileUrl: newAccount.profileUrl,
            stats: { solvedCount: Math.floor(Math.random() * 50), ranking: Math.floor(Math.random() * 20000) },
            lastSynced: new Date().toISOString()
        };
        
        if (newAccount.apiKey && newAccount.platform === 'HackerRank') {
            accountToAdd.apiKey = newAccount.apiKey;
        }
        
        onUpdateUser({ ...user, externalAccounts: [...user.externalAccounts, accountToAdd] });
        setNewAccount({ platform: 'LeetCode', username: '', profileUrl: '', apiKey: '' });
        setIsAdding(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
             <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Profile & Settings</h1>
             <div className="space-y-8">
                <Card className="p-6">
                     <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">User Information</h2>
                     <div className="space-y-2">
                         <p><span className="font-semibold">Name:</span> {user.name}</p>
                         <p><span className="font-semibold">Email:</span> {user.email}</p>
                     </div>
                </Card>
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Linked Accounts</h2>
                        {!isAdding && <button onClick={() => setIsAdding(true)} className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700">Link New Account</button>}
                    </div>
                    {isAdding && (
                        <form onSubmit={handleAddAccount} className="p-4 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-3">
                            <h3 className="font-bold">Add New Account</h3>
                            <select value={newAccount.platform} onChange={e => setNewAccount({...newAccount, platform: e.target.value as ExternalAccount['platform']})} className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md">
                                <option>LeetCode</option>
                                <option>HackerRank</option>
                                <option>CodeChef</option>
                                <option>GeeksforGeeks</option>
                            </select>
                            <input value={newAccount.username} onChange={e => setNewAccount({...newAccount, username: e.target.value})} placeholder="Username" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                            <input value={newAccount.profileUrl} onChange={e => setNewAccount({...newAccount, profileUrl: e.target.value})} placeholder="Profile URL" required className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" />
                            
                            {newAccount.platform === 'HackerRank' && (
                                <div className="space-y-1">
                                    <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        API Key (Optional)
                                    </label>
                                    <input 
                                        id="apiKey"
                                        type="password"
                                        value={newAccount.apiKey} 
                                        onChange={e => setNewAccount({...newAccount, apiKey: e.target.value})} 
                                        placeholder="Enter your HackerRank API Key" 
                                        className="w-full p-2 bg-white dark:bg-slate-700 border rounded-md" 
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Providing an API key allows for more accurate and frequent stat syncing.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300">Cancel</button>
                            </div>
                        </form>
                    )}
                    <div className="space-y-4">
                        {user.externalAccounts.map(account => (
                            <div key={account.platform} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg gap-4">
                                <div className="flex items-center gap-4 flex-grow">
                                    <PlatformLogo platform={account.platform} />
                                    <div>
                                        <h3 className="text-lg font-bold">{account.platform}</h3>
                                        <a href={account.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">{account.username}</a>
                                        {account.apiKey && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">API Key: ••••••••••••</p>
                                        )}
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Last synced: {new Date(account.lastSynced).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-center">
                                    <p><span className="font-semibold">Solved:</span> {account.stats.solvedCount}</p>
                                    <p><span className="font-semibold">Ranking:</span> {account.stats.ranking.toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-center">
                                     <button 
                                        onClick={() => handleSync(account)} 
                                        disabled={syncingPlatform === account.platform}
                                        className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 w-24 text-center"
                                     >
                                        {syncingPlatform === account.platform ? <Spinner/> : 'Sync Now'}
                                     </button>
                                     <button onClick={() => handleUnlink(account.platform)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Unlink</button>
                                </div>
                            </div>
                        ))}
                         {user.externalAccounts.length === 0 && !isAdding && <p className="text-center text-slate-500 py-4">No accounts linked yet.</p>}
                    </div>
                </Card>
             </div>
        </div>
    );
};

export default ProfileSettingsPage;
