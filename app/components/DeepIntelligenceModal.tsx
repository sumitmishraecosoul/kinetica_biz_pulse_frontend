'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deepIntelligenceAPI, ChatRequest } from '../services/deepIntelligenceAPI';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  context?: string;
  data?: any;
  charts?: any[];
}

interface DeepIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeepIntelligenceModal({ isOpen, onClose }: DeepIntelligenceModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    years: [2023, 2024, 2025],
    months: [] as string[],
    businesses: [] as string[],
    channels: [] as string[],
    customers: [] as string[],
    brands: [] as string[],
    categories: [] as string[]
  });
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [showTimeFilters, setShowTimeFilters] = useState(true);
  const [showSegmentFilters, setShowSegmentFilters] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatRequest: ChatRequest = {
        query: userMessage.content,
        conversation_history: messages.map(m => ({ role: m.role, content: m.content })),
        filters: filters
      };

      const data = await deepIntelligenceAPI.chat(chatRequest);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
        context: data.context,
        data: data.data,
        charts: data.charts
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error while processing your request. Please try again. Details: ${error.message}`,
          timestamp: new Date().toLocaleString(),
          context: "Error",
          data: { error: error.message }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
  };

  const removeYear = (year: number) => {
    setFilters(prev => ({ ...prev, years: prev.years.filter(y => y !== year) }));
  };

  const addYear = (year: number) => {
    if (!filters.years.includes(year)) {
      setFilters(prev => ({ ...prev, years: [...prev.years, year] }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-7xl h-[90vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full">
            {/* Left Sidebar - Filter Data */}
            <div className="w-80 bg-gray-800 border-r border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Filter Data</h3>
                
                {/* Time Filters */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowTimeFilters(!showTimeFilters)}
                    className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-white font-medium">Time Filters</span>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${showTimeFilters ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {showTimeFilters && (
                    <div className="mt-4 space-y-4">
                      {/* Select Years */}
                      <div>
                        <label className="block text-sm text-white mb-2">Select Years</label>
                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-600">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {filters.years.map(year => (
                              <span key={year} className="px-3 py-1 bg-red-500 text-white text-sm rounded-full flex items-center gap-2">
                                {year}
                                <button 
                                  onClick={() => removeYear(year)}
                                  className="hover:bg-red-600 rounded-full p-0.5"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => addYear(2023)}
                              className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                            </button>
                            <span className="text-gray-400 text-sm">Add year</span>
                          </div>
                        </div>
                      </div>

                      {/* Select Months */}
                      <div>
                        <label className="block text-sm text-white mb-2">Select Months</label>
                        <div className="relative">
                          <select className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none appearance-none">
                            <option>Choose options</option>
                            <option>January</option>
                            <option>February</option>
                            <option>March</option>
                            <option>April</option>
                            <option>May</option>
                            <option>June</option>
                            <option>July</option>
                            <option>August</option>
                            <option>September</option>
                            <option>October</option>
                            <option>November</option>
                            <option>December</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Segment Filters */}
                <div>
                  <button
                    onClick={() => setShowSegmentFilters(!showSegmentFilters)}
                    className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-white font-medium">Segment Filters</span>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${showSegmentFilters ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {showSegmentFilters && (
                    <div className="mt-4 space-y-4">
                      {[
                        { label: 'Select Businesses', key: 'businesses' },
                        { label: 'Select Channels', key: 'channels' },
                        { label: 'Select Customers', key: 'customers' },
                        { label: 'Select Brands', key: 'brands' },
                        { label: 'Select Categories', key: 'categories' }
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="block text-sm text-white mb-2">{label}</label>
                          <div className="relative">
                            <select className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none appearance-none">
                              <option>Choose options</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-gray-900">
              {/* Header */}
              <div className="p-8 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl font-bold text-white">Thrive</span>
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Vector AI Deep Intelligence - BVG</h1>
                    <p className="text-gray-300 text-lg">Ask questions about finance data (2023-July 2025). Use filters or voice to explore insights!</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">36,270</div>
                    <div className="text-sm text-gray-400">Total Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">2024 - 2024</div>
                    <div className="text-sm text-gray-400">Years Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-sm text-gray-400">Business Segments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-sm text-gray-400">Channels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">53</div>
                    <div className="text-sm text-gray-400">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">33</div>
                    <div className="text-sm text-gray-400">Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">50</div>
                    <div className="text-sm text-gray-400">Categories</div>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={clearChatHistory}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear Chat History
                  </button>
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={useVoiceInput}
                      onChange={(e) => setUseVoiceInput(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span>Use Voice Input</span>
                  </label>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </div>
                    <p className="text-lg">Start a conversation with Deep Intelligence</p>
                    <p className="text-sm">Ask questions about your business data</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-100'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.timestamp && (
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your business data..."
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || inputValue.trim() === ''}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}