'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChat, HiOutlineX, HiOutlinePaperAirplane, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useAuth } from '@/components/auth/AuthProvider';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
};

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // الاستماع لحدث فتح المحادثة من خارج المكون
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-live-chat', handleOpenChat);
    return () => window.removeEventListener('open-live-chat', handleOpenChat);
  }, []);

  // التمرير التلقائي لأسفل عند وصول رسالة جديدة
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // رسالة ترحيبية عند فتح المحادثة لأول مرة
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            text: `مرحباً بك ${user?.user_metadata?.full_name || ''} في مركز الدعم التقني لرافد. كيف يمكنني مساعدتك اليوم؟`,
            sender: 'agent',
            timestamp: new Date(),
          }
        ]);
      }, 500);
    }
  }, [isOpen, messages.length, user]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // محاكاة رد الوكيل البشري (الآلي مؤقتاً)
    setTimeout(() => {
      setIsTyping(false);
      const agentReply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لتواصلك. جاري مراجعة طلبك، سنقوم بالرد عليك في غضون لحظات. (هذه رسالة محاكاة للواجهة فقط)',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentReply]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* زر فتح المحادثة (الفقاعة العائمة) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-colors"
            aria-label="فتح المحادثة الحية"
          >
            <HiOutlineChat className="text-3xl" />
            {/* مؤشر متصل */}
            <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 border-2 border-dark-base rounded-full" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* نافذة المحادثة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[380px] h-[550px] max-h-[85vh] bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                    و
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-500 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">وكيل الدعم التقني</h3>
                  <p className="text-blue-100 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    متصل الآن
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-dark-base/50 space-y-4">
              <div className="text-center text-xs text-slate-500 dark:text-white/40 mb-6">
                المحادثات مشفرة ومحفوظة لضمان جودة الخدمة
              </div>

              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-dark-surface border border-slate-800 text-white rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-white/40 mt-1 mx-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start"
                >
                  <div className="bg-dark-surface border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-dark-surface border-t border-slate-100 dark:border-white/10 z-10">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 max-h-32 min-h-[44px] h-[44px] bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/40 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all scrollbar-hide"
                  dir="auto"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-11 h-11 flex-shrink-0 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-white/10 text-white disabled:text-slate-400 dark:disabled:text-white/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <HiOutlinePaperAirplane className="text-xl rotate-180" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-400 dark:text-white/30">
                  Powered by Rafed Support
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
