'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { 
  Search, MoreVertical, Send, Paperclip, Smile, 
  CheckCheck, ChevronLeft, Phone, Video, Info, 
  Image as ImageIcon, FileText, User, link, Link
} from 'lucide-react';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [chats] = useState([
    { id: 1, name: "Budi Store", lastMsg: "Bagaimana progres desainnya?", time: "10:30", unread: 2, online: true, avatar: "BS" },
    { id: 2, name: "HealthGo Startup", lastMsg: "Oke, saya tunggu update selanjutnya.", time: "Kemarin", unread: 0, online: false, avatar: "HG" },
    { id: 3, name: "TechFlow Solutions", lastMsg: "Bisa kirim invoice-nya?", time: "2 hari lalu", unread: 0, online: true, avatar: "TF" },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Halo, selamat pagi Budi! Saya sedang mengerjakan revisi landing page Anda.", sender: "me", time: "09:00", status: 'read' },
    { id: 2, text: "Pagi juga! Oh syukurlah. Apakah ada kendala di bagian integrasi payment?", sender: "them", time: "09:05", status: 'read' },
    { id: 3, text: "Sejauh ini aman, hanya perlu penyesuaian API sedikit saja.", sender: "me", time: "09:10", status: 'read' },
    { id: 4, text: "Bagaimana progres desainnya?", sender: "them", time: "10:30", status: 'delivered' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMsgObj]);
    setNewMessage('');
    
    // Simulasi balasan otomatis (typing effect)
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChat, isTyping]);

  return (
    <DashboardLayout role="freelancer">
      <div className="h-[calc(100vh-140px)] bg-slate-50/50 md:bg-white border border-slate-200 rounded-none md:rounded-[32px] overflow-hidden flex shadow-2xl relative">
        
        {/* SIDEBAR LEFT: CONTACTS */}
        <div className={`w-full md:w-[350px] border-r border-slate-100 flex flex-col bg-white z-20 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Obrolan</h1>
              <div className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 cursor-pointer transition-all">
                <EditIcon />
              </div>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari klien atau proyek..." 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className={`p-4 flex items-center gap-4 cursor-pointer rounded-[24px] transition-all ${selectedChat?.id === chat.id ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'hover:bg-slate-50'}`}
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${selectedChat?.id === chat.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {chat.avatar}
                  </div>
                  {chat.online && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-sm truncate ${selectedChat?.id === chat.id ? 'text-white' : 'text-slate-900'}`}>{chat.name}</h3>
                    <span className={`text-[10px] font-bold uppercase ${selectedChat?.id === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${selectedChat?.id === chat.id ? 'text-blue-50' : 'text-slate-500'}`}>{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && selectedChat?.id !== chat.id && (
                  <div className="w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: CHAT INTERFACE */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-white relative">
            {/* Header Chat */}
            <div className="p-4 md:px-8 md:py-5 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 bg-slate-50 rounded-xl text-slate-400"><ChevronLeft /></button>
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">
                  {selectedChat.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-none mb-1.5">{selectedChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Aktif Sekarang</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-3">
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"><Phone size={20}/></button>
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"><Video size={20}/></button>
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className={`p-2.5 rounded-xl transition-all ${showInfo ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <Info size={20}/>
                </button>
              </div>
            </div>

            {/* Bubble Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
              <div className="flex justify-center my-8">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Hari Ini</span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`max-w-[80%] md:max-w-[60%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`p-4 rounded-[24px] text-sm font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'me' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-600/10' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                      {msg.sender === 'me' && (
                        <CheckCheck size={14} className={msg.status === 'read' ? 'text-blue-500' : 'text-slate-300'} />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 md:p-8 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-5xl mx-auto bg-slate-50 p-2 rounded-[28px] border border-slate-100 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-8 focus-within:ring-blue-500/5 transition-all">
                <div className="flex items-center">
                  <button type="button" className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-all">
                    <Paperclip size={22} />
                  </button>
                </div>
                <textarea 
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Tulis pesan untuk klien..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 py-3 max-h-32 resize-none"
                />
                <div className="flex items-center gap-1 pr-1 pb-1">
                  <button type="button" className="hidden sm:block p-3 text-slate-400 hover:text-amber-500 transition-all">
                    <Smile size={22} />
                  </button>
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`p-3.5 rounded-2xl transition-all shadow-xl ${
                      newMessage.trim() 
                      ? 'bg-blue-600 text-white shadow-blue-600/30 hover:scale-105 active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={20} className={newMessage.trim() ? 'fill-white' : ''} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50/50 flex-col text-slate-400 p-8 text-center">
            <div className="w-32 h-32 bg-white rounded-[48px] shadow-sm flex items-center justify-center mb-8 animate-pulse">
              <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center">
                <Send size={40} className="rotate-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-slate-900 font-black text-2xl mb-3">Pusat Pesan</h2>
            <p className="font-medium text-slate-500 max-w-sm leading-relaxed">Hubungkan diri Anda dengan klien. Semua negosiasi dan file proyek dikelola dengan aman di sini.</p>
          </div>
        )}

        {/* RIGHT SIDEBAR: MEDIA & INFO (TAHAP 4) */}
        {selectedChat && showInfo && (
          <div className="hidden lg:flex w-80 border-l border-slate-100 bg-white animate-in slide-in-from-right duration-300 flex-col">
            <div className="p-8 text-center border-b border-slate-50">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-[32px] flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-inner">
                {selectedChat.avatar}
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-1">{selectedChat.name}</h3>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Klien Premium</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Media Dibagikan</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer overflow-hidden">
                      <img src={`https://picsum.photos/200?random=${i}`} className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi Cepat</h4>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 transition-all">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Link size={16}/></div>
                  Lihat Kontrak
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 transition-all">
                  <div className="p-2 bg-slate-50 text-slate-500 rounded-lg"><FileText size={16}/></div>
                  Invoice Proyek
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

// Helper Ikon Edit
function EditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}