'use client';

import React from 'react';

export function LiveChatButton() {
  const handleOpenChat = () => {
    // Dispatch the custom event that LiveChatWidget is listening to
    window.dispatchEvent(new CustomEvent('open-live-chat'));
  };

  return (
    <button 
      onClick={handleOpenChat}
      className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold transition-all"
    >
      ابدأ المحادثة الآن
    </button>
  );
}
