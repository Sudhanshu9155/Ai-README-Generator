import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chatWithAI } from '../api/aiApi';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';
import Loader from '../components/common/Loader';

const ChatReadme = () => {
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hi! I'm your AI assistant. Tell me about your project, and I'll help you generate a README file."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const conversationHistory = [...messages, userMessage];
            const response = await chatWithAI(conversationHistory);

            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.content
            }]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Sorry, I encountered an error communicating with the AI. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#343541]">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`w-full border-b border-black/10 dark:border-gray-900/50 ${msg.role === 'ai' ? 'bg-[#444654]' : 'bg-[#343541]'
                            }`}
                    >
                        <div className="max-w-3xl mx-auto flex p-4 gap-4 md:gap-6 m-auto">
                            <div className="flex-shrink-0 flex flex-col relative items-end">
                                <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${msg.role === 'ai' ? 'bg-green-500' : 'bg-[#5436DA]'}`}>
                                    {msg.role === 'ai' ? <FiCpu className="text-white" /> : <FiUser className="text-white" />}
                                </div>
                            </div>
                            <div className="relative flex-1 overflow-hidden">
                                <div className="prose prose-invert max-w-none text-gray-100 leading-7">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={`${className} bg-gray-700/50 rounded px-1 py-0.5`} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="w-full border-b border-black/10 dark:border-gray-900/50 bg-[#444654]">
                        <div className="max-w-3xl mx-auto flex p-4 gap-4 md:gap-6 m-auto">
                            <div className="flex-shrink-0 flex flex-col relative items-end">
                                <div className="w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center">
                                    <FiCpu className="text-white" />
                                </div>
                            </div>
                            <div className="relative flex-1 flex items-center">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-32" />
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-10 pb-6">
                <div className="max-w-3xl mx-auto px-4">
                    <form onSubmit={handleSend} className="relative flex flex-col w-full p-4 bg-[#40414F] rounded-md border border-gray-900/50 shadow-md">
                        <div className="flex flex-row">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Send a message..."
                                className="w-full bg-transparent text-white border-0 focus:ring-0 focus:outline-none p-0 pl-2 pr-8"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-3 bottom-2.5 p-1 rounded-md text-gray-400 hover:bg-gray-900 hover:text-gray-200 disabled:opacity-40 transition-colors"
                            >
                                <FiSend size={16} />
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-2 px-2">
                        <span className="text-xs text-gray-400">
                            AI may produce inaccurate information about people, places, or facts.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatReadme;
