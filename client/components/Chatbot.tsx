import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Loader2, Volume2, ThumbsUp, ThumbsDown, RefreshCcw } from 'lucide-react';

// Custom Bot Icon matching the screenshot (Chat face)
const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fillOpacity="0.2"/>
    <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM10 13C9.45 13 9 12.55 9 12C9 11.45 9.45 11 10 11C10.55 11 11 11.45 11 12C11 12.55 10.55 13 10 13ZM14 13C13.45 13 13 12.55 13 12C13 11.45 13.45 11 14 11C14.55 11 15 11.45 15 12C15 12.55 14.55 13 14 13Z" />
  </svg>
);

// Specific Icon for the header and welcome screen as seen in screenshot
// A rounded square with a chat bubble face inside
const BrandBotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="40" height="40" rx="12" fill="#C266E5"/>
        <path d="M12 14C12 11.7909 13.7909 10 16 10H24C26.2091 10 28 11.7909 28 14V22C28 24.2091 26.2091 26 24 26H16L12 30V14Z" fill="white"/>
        <circle cx="17.5" cy="18.5" r="1.5" fill="#C266E5"/>
        <circle cx="22.5" cy="18.5" r="1.5" fill="#C266E5"/>
    </svg>
);

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;
    if (isLoading) return;

    // Add User Message
    const userText = text;
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "I encountered a temporary error. Please try again or book a call." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
      // Map quick actions to natural language prompts
      let prompt = action;
      if (action === 'Book a Call') prompt = "I'd like to book a call.";
      if (action === 'Get a Quote') prompt = "How can I get a quote?";
      if (action === 'Explore Services') prompt = "What services do you offer?";
      
      handleSend(prompt);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: Select a specific voice if desired, or let browser default
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRegenerate = () => {
    // Find last user message to resend
    // We search from end of array
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg && !isLoading) {
       handleSend(lastUserMsg.text);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-brand-card w-[calc(100vw-32px)] md:w-[400px] h-[600px] max-h-[80vh] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-white dark:bg-brand-card p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
               <BrandBotIcon className="w-8 h-8 rounded-lg" />
               <span className="font-medium text-lg text-brand-black dark:text-white block">AI Chatbot</span>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full transition-colors text-gray-500 dark:text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-brand-darker relative flex flex-col">
            
            {messages.length === 0 ? (
                // Welcome / Empty State
                <div className="flex flex-col items-center justify-center h-full p-6 text-center mt-[-40px]">
                    <div className="mb-6">
                         <BrandBotIcon className="w-20 h-20 md:w-24 md:h-24" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-300 text-base font-normal mb-1">
                        Welcome to Ambitiouspedia Support
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-10 max-w-[280px]">
                        Your smart virtual assistant for all your Tech needs
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center w-full px-2">
                        <button 
                            onClick={() => handleQuickAction('Book a Call')}
                            className="bg-[#E9D5FF] hover:bg-[#D8B4FE] dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-[#6B21A8] dark:text-purple-200 px-5 py-3 rounded-md text-sm font-medium transition-colors"
                        >
                            Book a Call
                        </button>
                        <button 
                            onClick={() => handleQuickAction('Get a Quote')}
                            className="bg-[#E9D5FF] hover:bg-[#D8B4FE] dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-[#6B21A8] dark:text-purple-200 px-5 py-3 rounded-md text-sm font-medium transition-colors"
                        >
                            Get a Quote
                        </button>
                        <button 
                            onClick={() => handleQuickAction('Explore Services')}
                            className="bg-[#E9D5FF] hover:bg-[#D8B4FE] dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-[#6B21A8] dark:text-purple-200 px-5 py-3 rounded-md text-sm font-medium transition-colors"
                        >
                            Explore Services
                        </button>
                    </div>
                </div>
            ) : (
                // Message List
                <div className="p-4 space-y-6 flex-1">
                    {messages.map((msg, idx) => (
                    <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        
                        {/* Bot Icon */}
                        {msg.sender === 'bot' && (
                            <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 mt-1 shrink-0">
                                <BrandBotIcon className="w-full h-full" />
                            </div>
                        )}

                        <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                            
                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-[#E9D5FF] text-[#2F2F2F] rounded-br-none' 
                                    : 'bg-[#F3F4F6] dark:bg-brand-card text-[#2F2F2F] dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                            }`}>
                                {msg.text}
                            </div>

                            {/* Bot Actions */}
                            {msg.sender === 'bot' && (
                                <div className="flex items-center gap-4 mt-2 ml-1 animate-in fade-in duration-500">
                                    <button 
                                        onClick={() => handleSpeak(msg.text)}
                                        className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        title="Read Aloud"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-green-600 transition-colors" title="Like">
                                        <ThumbsUp size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors" title="Dislike">
                                        <ThumbsDown size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleRegenerate()}
                                        className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        title="Regenerate"
                                    >
                                        <RefreshCcw size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                    
                    {/* Custom Loading Animation with Sparkles */}
                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in zoom-in duration-300">
                            <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 mt-1 shrink-0">
                                <BrandBotIcon className="w-full h-full" />
                            </div>
                            <div className="
                                relative px-5 py-4 rounded-2xl rounded-bl-none 
                                bg-gradient-to-r from-[#E9D5FF] to-[#F3E8FF] dark:from-[#3b0764] dark:to-[#581c87]
                                flex items-center gap-6 shadow-sm border border-purple-100 dark:border-purple-800
                            ">
                                {/* Sparkles */}
                                <div className="relative w-8 h-8">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 absolute top-0 left-0 text-purple-500 animate-pulse" style={{ animationDuration: '2s' }}>
                                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#starGradient)" />
                                        <defs>
                                            <linearGradient id="starGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#F0ABFC" />
                                                <stop offset="1" stopColor="#A855F7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 absolute -top-1 -right-2 text-purple-400 animate-pulse delay-75" style={{ animationDuration: '2s' }}>
                                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#starGradientSmall)" />
                                        <defs>
                                            <linearGradient id="starGradientSmall" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#F0ABFC" />
                                                <stop offset="1" stopColor="#C084FC" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Dots */}
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white dark:bg-brand-card mt-auto">
            <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3.5 pr-14 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-[#C266E5] focus:ring-1 focus:ring-[#C266E5] transition-all placeholder:text-gray-400"
                  placeholder="Ask Anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#C266E5] hover:bg-[#a74ce9] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 bg-white dark:bg-brand-card p-2 pl-5 rounded-full shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-purple-500/20 transition-all duration-300"
        >
            <span className="hidden md:block font-semibold text-brand-black dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Hi, How can I assist you?
            </span>
            <div className="w-12 h-12 bg-[#C266E5] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                 <MessageSquare size={24} />
            </div>
        </button>
      )}

    </div>
  );
};