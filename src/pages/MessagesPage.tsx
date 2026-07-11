import React, { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Image as ImageIcon,
  Phone,
  Video,
  Info,
  ChevronLeft,
  Pin,
  Clock,
  CheckCheck,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { MessageCard } from '../components/social/MessageCard';
import { MessageThread } from '../types';

export const MessagesPage: React.FC = () => {
  const { user } = useStore();
  const [selectedThread, setSelectedThread] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  
  const threads: MessageThread[] = [
    {
      id: '1',
      participant_id: 'p1',
      participant_name: 'Engr. Nnamdi',
      participant_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      last_message: 'The new order of Ariaria leather shoes is ready for inspection.',
      last_message_time: '12:45 PM',
      unread_count: 2,
      online_status: true,
      messages: [
        { id: 'm1', sender: 'other', text: 'Hello! Are you available for a quick meeting?', timestamp: '12:30 PM' },
        { id: 'm2', sender: 'user', text: 'Yes, I can meet in 30 minutes.', timestamp: '12:35 PM' },
        { id: 'm3', sender: 'other', text: 'The new order of Ariaria leather shoes is ready for inspection.', timestamp: '12:45 PM' },
      ]
    },
    {
      id: '2',
      participant_id: 'p2',
      participant_name: 'Aba Fashion House',
      participant_avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100',
      business_name: 'Aba Fashion House',
      last_message: 'We have received your payment for the fashion show tickets.',
      last_message_time: 'Yesterday',
      unread_count: 0,
      online_status: false,
      messages: []
    },
    {
      id: '3',
      participant_id: 'p3',
      participant_name: 'Chef Amaka',
      participant_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      last_message: 'Typing...',
      last_message_time: '2:15 PM',
      unread_count: 0,
      online_status: true,
      is_typing: true,
      messages: []
    }
  ];

  const activeThread = threads.find(t => t.id === selectedThread);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
      {/* Sidebar: Threads List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Messages</h1>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <Pin className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <Clock className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl pl-11 pr-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-6 space-y-1">
          {threads.map(thread => (
            <MessageCard 
              key={thread.id} 
              thread={thread} 
              isActive={selectedThread === thread.id}
              onClick={() => setSelectedThread(thread.id)}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900/30 ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
        {activeThread ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedThread(null)} className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <img 
                    src={activeThread.participant_avatar} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt="" 
                  />
                  {activeThread.online_status && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white leading-tight">
                    {activeThread.participant_name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold">
                    {activeThread.online_status ? 'Active now' : 'Away'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeThread.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] space-y-1`}>
                    <div className={`px-5 py-3 rounded-[2rem] text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-[#0B7A3B] text-white rounded-tr-none' 
                        : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-zinc-400 font-bold">{msg.timestamp}</span>
                      {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#0B7A3B]" />}
                    </div>
                  </div>
                </div>
              ))}
              {activeThread.is_typing && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 flex gap-1 items-center">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={messageText || ''}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Message Engr. Nnamdi..."
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl px-6 py-3.5 text-sm focus:ring-2 focus:ring-[#0B7A3B] transition-all"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                {messageText.trim() ? (
                  <motion.button 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="p-3.5 bg-[#0B7A3B] text-white rounded-2xl shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <button className="p-3.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-2xl">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-12 text-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">Professional Messenger</h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-sm">
                Select a conversation to start messaging Aba merchants, community leaders, and logistics providers.
              </p>
            </div>
            <button className="px-8 py-3 bg-[#0B7A3B] text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20">
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
