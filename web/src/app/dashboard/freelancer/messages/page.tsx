'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, MoreVertical, Send, Paperclip, Smile, CheckCheck, ChevronLeft } from 'lucide-react';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  
  const [chats] = useState([
    { id: 1, name: "Budi Store", lastMsg: "Bagaimana progres desainnya?", time: "10:30", unread: 2, online: true },
    { id: 2, name: "HealthGo Startup", lastMsg: "Oke, saya tunggu update selanjutnya.", time: "Kemarin", unread: 0, online: false },
    { id: 3, name: "TechFlow Solutions", lastMsg: "Bisa kirim invoice-nya?", time: "2 hari lalu", unread: 0, online: true },
  ]);

  const [messages] = useState([
    { id: 1, text: "Halo, selamat pagi!", sender: "me", time: "09:00" },
    { id: 2, text: "Pagi juga! Ada update untuk desain landing page?", sender: "them", time: "09:05" },
    { id: 3, text: "Sudah masuk tahap finishing, sore ini saya kirim ya.", sender: "me", time: "09:10" },
    { id: 4, text: "Mantap, ditunggu!", sender: "them", time: "09:12" },
  ]);

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
                  <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AREA CHAT AKTIF (TAHAP 2) */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-slate-50/30">
            {/* Header Chat */}
            <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2 text-slate-400"><ChevronLeft /></button>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedChat.name}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreVertical size={20}/></button>
            </div>

            {/* Bubble Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
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

            {/* Input Placeholder (Akan diaktifkan di Tahap 3) */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-100">
               <div className="h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-4 text-slate-400 text-sm italic">
                  Menunggu komponen input pesan...
               </div>
            </div>
          </div>
        ) : (
          /* State Kosong */
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50/50 flex-col text-slate-400 p-8">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4">
              <Send size={24} className="rotate-12 text-slate-200" />
            </div>
            <p className="font-bold text-sm">Pilih percakapan untuk memulai chat</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}