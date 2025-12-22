'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Send, Search, MoreVertical, Paperclip, Smile, 
  Phone, Video, CheckCheck, Check, Image as ImageIcon,
  Zap, Clock, ArrowLeft
} from 'lucide-react';

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
  isTyping?: boolean;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chats: Chat[] = [
    { id: '1', name: 'TechFlow Startup', avatar: '', initial: 'TS', color: 'from-blue-500 to-indigo-600', lastMessage: 'Deadline sekitar 2 bulan lagi...', timestamp: '10:40', unread: 2, online: true, isTyping: true },
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  const handleSendMessage = (textOverride?: string) => {
    const finalMsg = textOverride || messageText;
    if (finalMsg.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: finalMsg,
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

  const quickReplies = ["Siap, saya kosong!", "Bisa kita meeting?", "Oke, setuju.", "Berapa ratenya?"];

  return (
    <DashboardLayout role="freelancer">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden h-[calc(100vh-140px)] flex relative">
        
        {/* --- LEFT: CONTACT LIST --- */}
        <aside className={`${selectedChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-96 border-r border-slate-100 flex-col bg-slate-50/40 backdrop-blur-sm`}>
          <div className="p-8 pb-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                <Zap size={18} className="fill-current" />
              </div>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 mt-4">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Recent Chats</p>
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full text-left p-4 rounded-[1.5rem] transition-all duration-300 flex items-center gap-4 group ${
                  selectedChat === chat.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-[1.02]' 
                    : 'hover:bg-white hover:shadow-lg text-slate-600'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 bg-gradient-to-br ${chat.color} rounded-[1.25rem] flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-white/20 transform transition-transform group-hover:rotate-6`}>
                    {chat.initial}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black truncate ${selectedChat === chat.id ? 'text-white' : 'text-slate-900'}`}>{chat.name}</span>
                    <span className={`text-[10px] font-bold ${selectedChat === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>{chat.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate font-medium ${selectedChat === chat.id ? 'text-blue-50' : 'text-slate-500'}`}>
                      {chat.isTyping ? <span className="italic animate-pulse">Typing...</span> : chat.lastMessage}
                    </p>
                    {chat.unread > 0 && selectedChat !== chat.id && (
                      <span className="bg-rose-500 text-white text-[10px] font-black rounded-lg px-2 py-1 min-w-[20px] text-center shadow-lg shadow-rose-200">
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
            <header className="h-24 px-8 border-b border-slate-50 flex items-center justify-between bg-white/90 backdrop-blur-xl sticky top-0 z-20">
              <div className="flex items-center gap-5">
                <button onClick={() => setSelectedChat(null)} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedChatData?.color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 transform -rotate-3`}>
                  {selectedChatData?.initial}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">{selectedChatData?.name}</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"><Phone size={18} /></button>
                  <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"><Video size={18} /></button>
                </div>
                <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical size={20} /></button>
              </div>
            </header>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FDFDFF] scroll-smooth"
            >
              <div className="flex justify-center">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-sm">Today</span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <div className={`group relative px-6 py-4 text-sm font-medium leading-relaxed shadow-xl transition-all hover:shadow-2xl ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white rounded-[2rem] rounded-tr-none shadow-blue-100'
                        : 'bg-white text-slate-700 border border-slate-50 rounded-[2rem] rounded-tl-none shadow-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-3 px-2">
                      <span className="text-[10px] font-bold text-slate-300 uppercase">{msg.timestamp}</span>
                      {msg.sender === 'me' && (
                        msg.read ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {selectedChatData?.isTyping && (
                <div className="flex justify-start animate-in fade-in duration-500">
                  <div className="bg-white border border-slate-100 px-6 py-4 rounded-[2rem] rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK REPLIES BAR */}
            <div className="px-8 py-3 flex gap-2 overflow-x-auto bg-white no-scrollbar">
              {quickReplies.map((reply, i) => (
                <button 
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <footer className="p-8 bg-white pt-2">
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[2rem] border border-slate-200 focus-within:bg-white focus-within:ring-[12px] focus-within:ring-blue-500/5 focus-within:border-blue-500 transition-all duration-500">
                <div className="flex items-center pl-2">
                  <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                  <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors"><ImageIcon size={20} /></button>
                </div>
                
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 font-bold"
                />
                
                <button className="p-3 text-slate-400 hover:text-amber-500 transition-colors"><Smile size={20} /></button>
                
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!messageText.trim()}
                  className={`w-14 h-14 rounded-[1.25rem] transition-all shadow-xl flex items-center justify-center
                    ${messageText.trim() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:rotate-12 active:scale-90 shadow-blue-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send size={22} className={messageText.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </button>
              </div>
            </footer>
          </main>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/40">
            <div className="relative">
               <div className="w-40 h-40 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center rotate-6 relative z-10">
                  <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center -rotate-6">
                    <Send className="w-10 h-10 text-blue-600" />
                  </div>
               </div>
               <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-3xl opacity-10 -z-10 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-12 mb-3 tracking-tight">Select a Discussion</h2>
            <p className="text-slate-500 text-sm max-w-[280px] text-center font-bold leading-loose">
              Pick a client from the list on the left to start collaborating on your next big project.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}