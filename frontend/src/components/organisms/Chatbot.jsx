import { useState, useRef, useEffect } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a9 9 0 100 18 9 9 0 000-18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6M9 14h6m-7-6a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1z" />
    </svg>
);

export const Chatbot = ({ isVisible, onClose }) => {
    const [messages, setMessages] = useState([
        { from: 'ai', text: "Hi! I'm Even Steven's AI assistant. How can I help you?" }
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const userQuery = input;
        setMessages(prev => [...prev, { from: 'user', text: userQuery }]);
        setInput('');
        setIsStreaming(true);
        
       
        setMessages(prev => [...prev, { from: 'ai', text: '' }]);

        try {
            const response = await fetch('http://even-steven-jhyx.vercel.app/api/v1/chatbot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userQuery }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            
            const processStream = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    setIsStreaming(false); 
                    return;
                }

                const chunk = decoder.decode(value);
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages];
                    const lastMessageIndex = updatedMessages.length - 1;
                    updatedMessages[lastMessageIndex] = {
                        ...updatedMessages[lastMessageIndex],
                        text: updatedMessages[lastMessageIndex].text + chunk,
                    };
                    return updatedMessages;
                });

                
                await processStream();
            };

            
            await processStream();

        } catch (error) {
            console.error("Failed to fetch streaming response:", error);
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessageIndex = updatedMessages.length - 1;
                updatedMessages[lastMessageIndex] = {
                    ...updatedMessages[lastMessageIndex],
                    text: "Sorry, I couldn't connect to the server.",
                };
                return updatedMessages;
            });
            setIsStreaming(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 right-5 w-full max-w-md h-[600px] bg-gray-800 shadow-2xl rounded-lg flex flex-col z-50">
             <header className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
                <h2 className="font-bold text-white text-lg">Even Steven AI</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.from === 'ai' && <RobotIcon />}
                        <p className={`p-3 rounded-lg max-w-xs shadow-md whitespace-pre-wrap ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.text}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700 flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isStreaming ? "Waiting for response..." : "Ask about your expenses..."}
                    className="flex-1"
                    disabled={isStreaming}
                />
                <Button onClick={handleSend} disabled={isStreaming} className="px-4 py-2 flex-none bg-green-600">Send</Button>
            </div>
        </div>
    );
};