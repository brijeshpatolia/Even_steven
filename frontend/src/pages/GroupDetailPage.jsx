// src/pages/GroupDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AddExpenseForm } from '../components/organisms/AddExpenseForm';
import { GroupBalanceDisplay } from '../components/organisms/GroupBalanceDisplay';
import { Chatbot } from '../components/organisms/Chatbot';
import { Button } from '../components/atoms/Button';
import { getGroups } from '../api/groupApi'; // We'll need to fetch groups to find the ID

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const GroupDetailPage = () => {
    const { groupName } = useParams();
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChatVisible, setChatVisible] = useState(false);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                setIsLoading(true);
                const allGroups = await getGroups();
                const currentGroup = allGroups.find(g => g.name === groupName);

                if (currentGroup) {
                    setGroup(currentGroup);
                } else {
                    setError('Group not found.');
                }
            } catch (err) {
                setError('Failed to fetch group details.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroupDetails();
    }, [groupName]);

    if (isLoading) {
        return <div className="p-8 text-center text-white">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-8">
            <Link to="/" className="text-green-400 hover:underline mb-8 inline-block">&larr; Back to Home</Link>
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white">
                    <span className="text-gray-500">Group:</span> <span className="text-green-400">{group.name}</span>
                </h1>
            </header>

            <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    {/* CORRECTED: Pass the numerical group.id, not the name */}
                    <AddExpenseForm groupId={group.id} />
                </div>
                <div className="flex justify-center">
                    {/* CORRECTED: Pass the numerical group.id, not the name */}
                    <GroupBalanceDisplay groupId={group.id} />
                </div>
            </main>

            <Chatbot
                isVisible={isChatVisible}
                onClose={() => setChatVisible(false)}
            />
            <div className="fixed bottom-5 right-5 z-50">
                <Button
                    onClick={() => setChatVisible(!isChatVisible)}
                    className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
                    aria-label="Toggle Chatbot"
                >
                    <ChatIcon />
                </Button>
            </div>
        </div>
    );
};