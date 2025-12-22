'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { Send, Search, MoreVertical, Paperclip, Smile, Phone, Video, CheckCheck, Check } from 'lucide-react';

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
  initial: string;
  color: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chats: Chat[] = [
    { id: '1', name: 'TechFlow Startup', avatar: '', initial: 'TS', color: 'from-blue-500 to-indigo-600', lastMessage: 'Deadline sekitar 2 bulan lagi...', timestamp: '10:40', unread: 2, online: true },
    { id: '2', name: 'CodeFront Indonesia', avatar: '', initial: 'CI', color: 'from-emerald-500 to-teal-600', lastMessage: 'Kapan bisa mulai mengerjakan?', timestamp: '08:15', unread: 0, online: false },
    { id: '3', name: 'Digital Agency', avatar: '', initial: 'DA', color: 'from-purple-500 to-pink-600', lastMessage: 'Portfolio Anda menarik', timestamp: 'Kemarin', unread: 0, online: true }
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Halo, saya tertarik dengan profil Anda untuk proyek dashboard kami.', sender: 'other', timestamp: '10:30', read: true },
    { id: '2', text: 'Terima kasih! Ada yang bisa saya bantu secara spesifik?', sender: 'me', timestamp: '10:32', read: true },
    { id: '3', text: 'Kami sedang mencari Frontend Developer untuk proyek Next.js dengan Tailwind.', sender: 'other', timestamp: '10:35', read: true },
    { id: '4', text: 'Wah kebetulan sekali, itu adalah tech stack utama saya. Bisa dijelaskan deadline-nya?', sender: 'me', timestamp: '10:37', read: true },
    { id: '5', text: 'Deadline sekitar 2 bulan lagi. Apakah schedule Anda kosong?', sender: 'other', timestamp: '10:40', read: false }
  ]);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="freelancer">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-[calc(100vh-160px)] flex">
        
        {/* --- LEFT: CONTACT LIST --- */}
        <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-6">
            <h1 className="text-2xl font-black text-slate-900 mb-5 tracking-tight">Obrolan</h1>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Cari kontak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-4 ${
                  selectedChat === chat.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]' 
                    : 'hover:bg-white hover:shadow-md text-slate-600'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${chat.color} rounded-2xl flex items-center justify-center text-white font-bold shadow-inner border-2 border-white/20`}>
                    {chat.initial}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-bold truncate ${selectedChat === chat.id ? 'text-white' : 'text-slate-900'}`}>{chat.name}</span>
                    <span className={`text-[10px] ${selectedChat === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>{chat.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${selectedChat === chat.id ? 'text-blue-50' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                    {chat.unread > 0 && selectedChat !== chat.id && (
                      <span className="bg-red-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* --- RIGHT: CHAT AREA --- */}
        {selectedChat ? (
          <main className="flex-1 flex flex-col bg-white relative">
            {/* Header Area */}
            <header className="h-20 px-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${selectedChatData?.color} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg`}>
                  {selectedChatData?.initial}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedChatData?.name}</h2>
                  <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Messages Content */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
            >
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[65%]`}>
                    <div className={`px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white rounded-[1.5rem] rounded-tr-none shadow-blue-200/50'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-[1.5rem] rounded-tl-none shadow-slate-200/50'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 px-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.timestamp}</span>
                      {msg.sender === 'me' && (
                        msg.read ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <footer className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-[1.5rem] border border-slate-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500 transition-all">
                <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  placeholder="Ketik pesan anda di sini..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 font-medium"
                />
                
                <button className="p-3 text-slate-400 hover:text-amber-500 hover:bg-white rounded-xl transition-all shadow-sm">
                  <Smile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`p-3 rounded-xl transition-all shadow-lg flex items-center justify-center
                    ${messageText.trim() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 shadow-blue-300' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </footer>
          </main>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 rotate-12">
                <Send className="w-12 h-12 text-blue-500 -rotate-12" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Pilih Obrolan</h2>
            <p className="text-slate-500 text-sm max-w-[240px] text-center font-medium leading-relaxed">
              Silakan pilih salah satu pesan di samping untuk mulai berdiskusi.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}