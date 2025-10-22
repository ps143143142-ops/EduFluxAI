import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChat, generateSpeech } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';
import { decode, decodeAudioData } from '../utils/audio';

const AIAssistantChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            chatRef.current = createChat();
            setMessages([{ sender: 'ai', text: "Hello! I'm your AI Smart Tutor. How can I help you with your studies today?" }]);
            // Initialize AudioContext on user interaction (opening the chat)
            if (!audioContextRef.current) {
                try {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                } catch (e) {
                    console.error("Web Audio API is not supported in this browser.", e);
                }
            }
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const playAudio = useCallback(async (base64: string) => {
        if (!audioContextRef.current) return;
        try {
            const audioBytes = decode(base64);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
        } catch (error) {
            console.error("Failed to play audio:", error);
        }
    }, []);

    const handleSend = useCallback(async () => {
        if (input.trim() === '' || !chatRef.current || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: input });
            let aiResponse = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]); // Add placeholder for AI response

            for await (const chunk of stream) {
                aiResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = aiResponse;
                    return newMessages;
                });
            }

            // Once text is complete, generate and play speech
            const audioBase64 = await generateSpeech(aiResponse);
            if (audioBase64) {
                await playAudio(audioBase64);
            }

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                // If there was an error mid-stream, update the last message.
                if (newMessages[newMessages.length - 1].sender === 'ai') {
                    newMessages[newMessages.length - 1].text = 'Sorry, I encountered an error. Please try again.';
                } else { // Otherwise add a new message.
                    newMessages.push({ sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' });
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, playAudio]);

    return (
        <>
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-110"
                    aria-label="Toggle AI Assistant"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="fixed bottom-20 right-5 z-50 w-full max-w-sm h-[60vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col transition-all duration-300">
                    <header className="p-4 bg-indigo-600 text-white rounded-t-xl flex justify-between items-center">
                        <h3 className="font-bold">AI Smart Tutor</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200 text-2xl leading-none">&times;</button>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                                    {msg.text || <span className="animate-pulse">...</span>}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-grow w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 disabled:bg-indigo-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default AIAssistantChatbot;