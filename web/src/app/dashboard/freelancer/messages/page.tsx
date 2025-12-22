'use client';

import { useState } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Search, MoreVertical, Send, Paperclip, Smile, CheckCheck } from 'lucide-react';

export default function MessagesPage() {
  const [chats] = useState([
    { id: 1, name: "Budi Store", lastMsg: "Bagaimana progres desainnya?", time: "10:30", unread: 2, online: true },
    { id: 2, name: "HealthGo Startup", lastMsg: "Oke, saya tunggu update selanjutnya.", time: "Kemarin", unread: 0, online: false },
    { id: 3, name: "TechFlow Solutions", lastMsg: "Bisa kirim invoice-nya?", time: "2 hari lalu", unread: 0, online: true },
  ]);

  return (
    <DashboardLayout role="freelancer">
      <div className="h-[calc(100vh-180px)] bg-white border border-slate-200 rounded-[32px] overflow-hidden flex shadow-sm">
        
        {/* SIDEBAR DAFTAR CHAT */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
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

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div key={chat.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-all border-b border-slate-50/50">
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
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AREA CHAT KOSONG (Akan diisi di Tahap 2) */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50/50 flex-col text-slate-400 p-8">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4">
            <Send size={24} className="rotate-12 text-slate-200" />
          </div>
          <p className="font-bold text-sm">Pilih percakapan untuk memulai chat</p>
        </div>

      </div>
    </DashboardLayout>
  );
}