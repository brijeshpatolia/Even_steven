

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AddExpenseForm } from '../components/organisms/AddExpenseForm';
import { GroupBalanceDisplay } from '../components/organisms/GroupBalanceDisplay';
import { Chatbot } from '../components/organisms/Chatbot';
import { Button } from '../components/atoms/Button';

import { apiGetGroup } from '../api/groupApi'; 

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);


export const GroupDetailPage = () => {
    // UPDATED: Get groupId from the URL parameters
    const { groupId } = useParams();
    const [isChatVisible, setChatVisible] = useState(false);

    // UPDATED: Fetch the specific group using its ID
    const { data: group, isLoading, isError, error } = useQuery({
        queryKey: ['group', groupId],
        queryFn: () => apiGetGroup(groupId),
        enabled: !!groupId, // Ensure the query only runs if groupId is available
    });

    if (isLoading) {
        return <div className="p-8 text-center text-white">Loading group details...</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">{error?.message || 'Failed to fetch group details.'}</div>;
    }

    // Ensure group data is available before rendering components that need it
    if (!group) {
        return <div className="p-8 text-center text-white">Group not found.</div>;
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
                    <AddExpenseForm groupId={group.id} />
                </div>
                <div className="flex justify-center">
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