import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  Image as ImageIcon,
  MoreHorizontal,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'recommendation';
  data?: any;
}

export const MaziKaluChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Kedu! I am Mazi Kalu, your Aba City Assistant. How can I help you navigate Enyimba City today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.content) {
        const assistantMessage: Message = { role: 'assistant', content: data.content };
        setMessages(prev => [...prev, assistantMessage]);
        if (!isMuted) speak(data.content);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am sorry, my connection to the city grid is a bit shaky. Please try again in a moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Stop recognition logic would go here
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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0B7A3B] to-[#169C4A] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-white leading-tight">Mazi Kalu</h3>
            <p className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              City AI Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: 'History cleared. How can I help you now?' }])}
            className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-emerald-50 dark:bg-emerald-950/30'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-500" /> : <Bot className="w-4 h-4 text-[#0B7A3B]" />}
                </div>
                <div className={`px-5 py-3 rounded-[2rem] text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0B7A3B] text-white rounded-tr-none shadow-lg shadow-emerald-500/10'
                    : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-800 shadow-sm font-medium'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#0B7A3B]" />
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-3 flex gap-1 items-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#0B7A3B] rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#0B7A3B] rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#0B7A3B] rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button className="p-2.5 text-zinc-400 hover:text-[#0B7A3B] transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input || ''}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Mazi Kalu anything about Aba..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0B7A3B] transition-all font-medium"
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleRecording}
            className={`p-4 rounded-2xl transition-all ${
              isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              !input.trim() || isLoading 
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-300' 
                : 'bg-[#0B7A3B] text-white shadow-emerald-500/20'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {['Find cheap hotels', 'Market closing time', 'Best leather artisans', 'Book a keke'].map((s) => (
            <button 
              key={s}
              onClick={() => setInput(s)}
              className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 hover:border-[#0B7A3B] hover:text-[#0B7A3B] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
