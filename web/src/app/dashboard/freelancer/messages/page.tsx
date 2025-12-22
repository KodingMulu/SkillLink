'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, MoreVertical, Send, Paperclip, Smile, CheckCheck, ChevronLeft } from 'lucide-react';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [chats] = useState([
    { id: 1, name: "Budi Store", lastMsg: "Bagaimana progres desainnya?", time: "10:30", unread: 2, online: true },
    { id: 2, name: "HealthGo Startup", lastMsg: "Oke, saya tunggu update selanjutnya.", time: "Kemarin", unread: 0, online: false },
    { id: 3, name: "TechFlow Solutions", lastMsg: "Bisa kirim invoice-nya?", time: "2 hari lalu", unread: 0, online: true },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Halo, selamat pagi!", sender: "me", time: "09:00" },
    { id: 2, text: "Pagi juga! Ada update untuk desain landing page?", sender: "them", time: "09:05" },
    { id: 3, text: "Sudah masuk tahap finishing, sore ini saya kirim ya.", sender: "me", time: "09:10" },
    { id: 4, text: "Mantap, ditunggu!", sender: "them", time: "09:12" },
  ]);

  // Fungsi kirim pesan
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsgObj]);
    setNewMessage('');
  };

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  return (
    <DashboardLayout role="freelancer">
      <div className="h-[calc(100vh-180px)] bg-white border border-slate-200 rounded-[32px] overflow-hidden flex shadow-sm relative">
        
        {/* SIDEBAR DAFTAR CHAT */}
        <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-50">
            <h1 className="text-xl font-black text-slate-900 mb-4">Pesan</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari percakapan..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-slate-50/50 ${selectedChat?.id === chat.id ? 'bg-blue-50/50 border-r-4 border-r-blue-600' : 'hover:bg-slate-50'}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{chat.name}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AREA CHAT AKTIF */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-slate-50/30">
            {/* Header Chat */}
            <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2 text-slate-400"><ChevronLeft /></button>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20">
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedChat.name}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"><MoreVertical size={20}/></button>
            </div>

            {/* Bubble Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                    msg.sender === 'me' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                      {msg.time}
                      {msg.sender === 'me' && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AREA INPUT PESAN (TAHAP 3) */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-4 bg-slate-50 p-2 pl-4 rounded-[20px] border border-slate-100 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                <button type="button" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan Anda di sini..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 py-2"
                />
                <button type="button" className="hidden sm:block text-slate-400 hover:text-amber-500 transition-colors">
                  <Smile size={20} />
                </button>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-2.5 rounded-xl transition-all shadow-lg ${
                    newMessage.trim() 
                    ? 'bg-blue-600 text-white shadow-blue-600/20 hover:scale-105 active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* State Kosong */
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50/50 flex-col text-slate-400 p-8">
            <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm flex items-center justify-center mb-6 animate-bounce duration-[3000ms]">
              <Send size={32} className="rotate-12 text-blue-600/20" />
            </div>
            <h2 className="text-slate-900 font-black text-lg mb-2">Pilih Percakapan</h2>
            <p className="font-medium text-sm max-w-xs text-center leading-relaxed">Pilih salah satu kontak di samping untuk mulai berdiskusi tentang proyek Anda.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}