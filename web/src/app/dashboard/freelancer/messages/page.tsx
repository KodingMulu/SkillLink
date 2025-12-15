'use client';

import { useState } from 'react';
import DashboardLayout from '../../DashboardLayout'; // Sesuaikan path import
import { Send, Search, MoreVertical, Paperclip, Smile, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read?: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  initial: string; // Menambahkan inisial untuk fallback avatar
  color: string; // Untuk variasi warna avatar
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Data dummy yang disesuaikan styling-nya
  const chats: Chat[] = [
    {
      id: '1',
      name: 'TechFlow Startup',
      avatar: '', 
      initial: 'TS',
      color: 'from-blue-500 to-cyan-500',
      lastMessage: 'Terima kasih atas lamarannya',
      timestamp: '2 jam lalu',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'CodeFront Indonesia',
      avatar: '',
      initial: 'KS',
      color: 'from-orange-500 to-amber-500',
      lastMessage: 'Kapan bisa mulai mengerjakan?',
      timestamp: '5 jam lalu',
      unread: 0,
      online: false
    },
    {
      id: '3',
      name: 'Digital Agency',
      avatar: '',
      initial: 'DA',
      color: 'from-purple-500 to-pink-500',
      lastMessage: 'Portfolio Anda menarik',
      timestamp: '1 hari lalu',
      unread: 1,
      online: true
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo, saya tertarik dengan profil Anda untuk proyek dashboard kami.',
      sender: 'other',
      timestamp: '10:30',
      read: true
    },
    {
      id: '2',
      text: 'Terima kasih! Ada yang bisa saya bantu secara spesifik?',
      sender: 'me',
      timestamp: '10:32',
      read: true
    },
    {
      id: '3',
      text: 'Kami sedang mencari Frontend Developer untuk proyek Next.js dengan Tailwind.',
      sender: 'other',
      timestamp: '10:35',
      read: true
    },
    {
      id: '4',
      text: 'Wah kebetulan sekali, itu adalah tech stack utama saya. Bisa dijelaskan deadline-nya?',
      sender: 'me',
      timestamp: '10:37',
      read: true
    },
    {
      id: '5',
      text: 'Deadline sekitar 2 bulan lagi. Apakah schedule Anda kosong?',
      sender: 'other',
      timestamp: '10:40',
      read: false
    }
  ]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="freelancer">
      {/* Container utama dibuat rounded dan shadow agar menyatu dengan dashboard card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-8rem)] flex">
        
        {/* Sidebar - Daftar Chat */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
          {/* Header Sidebar */}
          <div className="p-4 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-800 mb-4">Pesan</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* List Chat */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors border-l-4 ${
                  selectedChat === chat.id 
                    ? 'bg-blue-50/50 border-blue-600' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    {/* Avatar Gradient Style */}
                    <div className={`w-10 h-10 bg-gradient-to-br ${chat.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {chat.initial}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`text-sm font-semibold truncate ${selectedChat === chat.id ? 'text-blue-700' : 'text-slate-800'}`}>
                        {chat.name}
                      </h3>
                      <span className="text-[10px] text-slate-400">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${selectedChat === chat.id ? 'text-blue-600/70' : 'text-slate-500'}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chat Utama */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-9 h-9 bg-gradient-to-br ${selectedChatData?.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                    {selectedChatData?.initial}
                  </div>
                  {selectedChatData?.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">{selectedChatData?.name}</h2>
                  <div className="flex items-center text-xs text-slate-500">
                    {selectedChatData?.online ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                        Online
                      </>
                    ) : 'Offline'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Video className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bubble Pesan */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <div
                      className={`px-5 py-3 text-sm shadow-sm ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                      }`}
                    >
                      {message.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {message.timestamp} • {message.sender === 'me' && (message.read ? 'Dibaca' : 'Terkirim')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2"
                />
                
                <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-white rounded-lg transition-all shadow-sm">
                  <Smile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`p-2 rounded-lg transition-all shadow-sm flex items-center justify-center
                    ${messageText.trim() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Search className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Pilih Percakapan</h2>
            <p className="text-slate-500 text-sm max-w-xs text-center">
              Pilih salah satu kontak di sebelah kiri untuk mulai berdiskusi mengenai proyek Anda.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}