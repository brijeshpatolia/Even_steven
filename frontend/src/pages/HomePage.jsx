import { useState } from 'react';
import { CreateGroupForm } from "../components/organisms/CreateGroupForm";
import { GroupList } from "../components/organisms/GroupList";
import { UserBalanceChecker } from "../components/organisms/UserBalanceChecker";
import { Chatbot } from '../components/organisms/Chatbot';
import { Button } from '../components/atoms/Button';

// Icon for the chatbot toggle button
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);


export const HomePage = () => {
  const [isChatVisible, setChatVisible] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-green-400">Even Steven</h1>
        <p className="text-gray-400 mt-2">Splitting expenses, not friendships.</p>
      </header>
      
      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">My Groups</h2>
          <GroupList />
        </section>

        <div className="space-y-8">
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">Create New Group</h2>
            <CreateGroupForm />
          </section>
          
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">Check Balance</h2>
            <UserBalanceChecker />
          </section>
        </div>
      </main>

      <Chatbot 
        isVisible={isChatVisible} 
        onClose={() => setChatVisible(false)} 
      />
      
     
      <div className="fixed bottom-5 right-5">
        <Button
          onClick={() => setChatVisible(!isChatVisible)}
         
          className="rounded-full w-18 h-18 flex items-center justify-center shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
          aria-label="Toggle Chatbot"
        >
          <ChatIcon />
        </Button>
      </div>
    </div>
  );
}