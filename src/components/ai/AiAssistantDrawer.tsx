import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Mic, MicOff, Volume2, VolumeX, RotateCcw, Bot, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const AiAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setAiDrawerOpen, aiMessages, addAiMessage } = useStore();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages, isThinking]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput('');
    addAiMessage({ role: 'user', content: userText });
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...aiMessages, { role: 'user', content: userText }] }),
      });

      const data = await response.json();
      if (data.content) {
        addAiMessage({ role: 'assistant', content: data.content });
        if (!isMuted) speak(data.content);
      } else {
        throw new Error('No response from Mazi Kalu');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addAiMessage({ role: 'assistant', content: "Ewo! My connection to the city grid is a bit shaky. Let's try that again, my brother/sister." });
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-NG';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.start();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex justify-end">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-lg bg-zinc-50 dark:bg-zinc-950 h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)] border-l border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#0B7A3B] to-[#169C4A] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                Mazi Kalu
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-[#0B7A3B] uppercase tracking-widest">Online</span>
                </div>
              </h3>
              <p className="text-xs text-zinc-500 font-bold">Aba's Intelligent Operating Layer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
              {isMuted ? <VolumeX className="w-5 h-5 text-zinc-400" /> : <Volume2 className="w-5 h-5 text-[#0B7A3B]" />}
            </button>
            <button onClick={() => setAiDrawerOpen(false)} className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-400 hover:text-rose-500 rounded-2xl transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {aiMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-zinc-500" /> : <Bot className="w-5 h-5 text-[#0B7A3B]" />}
                </div>
                <div className={`max-w-[85%] px-6 py-4 rounded-[2.5rem] text-sm leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-[#0B7A3B] text-white rounded-tr-none border-[#0B7A3B]' 
                    : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-tl-none border-zinc-100 dark:border-zinc-800 font-medium'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#0B7A3B] animate-spin" />
              </div>
              <div className="px-6 py-4 rounded-[2.5rem] rounded-tl-none bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#0B7A3B] rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#0B7A3B] rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#0B7A3B] rounded-full" />
                </div>
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Scanning the city...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested Actions */}
        <div className="px-8 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {['Best shoes in Ariaria?', 'Find cheap hotels', 'Market closing hours', 'Book a logistics bike'].map((s) => (
            <button 
              key={s}
              onClick={() => { setInput(s); handleSend(); }}
              className="flex-shrink-0 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-black text-zinc-600 dark:text-zinc-400 hover:border-[#0B7A3B] hover:text-[#0B7A3B] transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-8 pt-0">
          <form 
            onSubmit={handleSend} 
            className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex items-center gap-3 shadow-xl focus-within:ring-2 focus-within:ring-[#0B7A3B] transition-all"
          >
            <button 
              type="button"
              onClick={toggleRecording}
              className={`p-4 rounded-[2rem] transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400 hover:text-zinc-600'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input || ''}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mazi Kalu anything about Aba..."
              className="flex-1 bg-transparent border-none text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-4 bg-[#0B7A3B] text-white rounded-[2rem] hover:bg-[#169C4A] disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[9px] text-center mt-4 font-black text-zinc-400 uppercase tracking-widest">
            Always support Made-in-Aba products 🇳🇬
          </p>
        </div>
      </motion.div>
    </div>
  );
};

