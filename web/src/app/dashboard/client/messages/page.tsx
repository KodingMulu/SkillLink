'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { Send, Search, Paperclip, MoreVertical, Phone, Video, Smile, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  role: string;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const chats: Chat[] = [
    {
      id: 1,
      name: 'saipul bahri',
      avatar: 'B',
      lastMessage: 'Baik, saya akan segera kirim revisi desainnya',
      time: '10:30',
      unread: 2,
      online: true,
      role: 'UI/UX Designer'
    },
    {
      id: 2,
      name: 'nazril afandi',
      avatar: 'S',
      lastMessage: 'Artikel sudah selesai, mohon dicek',
      time: '09:15',
      unread: 0,
      online: true,
      role: 'Content Writer'
    },
    {
      id: 3,
      name: 'deviter arya bima laka ',
      avatar: 'A',
      lastMessage: 'Kapan kita bisa meeting untuk discuss project?',
      time: 'Yesterday',
      unread: 1,
      online: false,
      role: 'Full Stack Developer'
    },
    {
      id: 4,
      name: 'egy',
      avatar: 'D',
      lastMessage: 'Campaign report sudah saya kirim via email',
      time: 'Yesterday',
      unread: 0,
      online: false,
      role: 'Digital Marketing'
    },
    {
      id: 5,
      name: 'fatoni',
      avatar: 'R',
      lastMessage: 'Terima kasih atas reviewnya!',
      time: '2 days ago',
      unread: 0,
      online: true,
      role: 'Mobile Developer'
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      text: 'Halo Budi, bagaimana progress redesign aplikasinya?',
      sender: 'me',
      time: '10:00',
      read: true
    },
    {
      id: 2,
      text: 'Halo! Progress sudah 80%, saya sedang finalisasi beberapa screen.',
      sender: 'other',
      time: '10:05',
      read: true
    },
    {
      id: 3,
      text: 'Untuk homepage, saya ada sedikit revisi. Bisa kita ubah color scheme-nya?',
      sender: 'me',
      time: '10:10',
      read: true
    },
    {
      id: 4,
      text: 'Tentu! Mau diubah ke warna apa? Bisa share reference-nya?',
      sender: 'other',
      time: '10:12',
      read: true
    },
    {
      id: 5,
      text: 'Saya prefer yang lebih modern, mungkin bisa pakai gradient biru-teal seperti trend sekarang',
      sender: 'me',
      time: '10:15',
      read: true
    },
    {
      id: 6,
      text: 'Baik, saya akan segera kirim revisi desainnya',
      sender: 'other',
      time: '10:30',
      read: false
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentChat = chats.find(chat => chat.id === selectedChat);

  return (
    <DashboardLayout role="client">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pesan</h1>
        <p className="text-slate-500 mt-1">Komunikasi dengan talenta Anda</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 240px)' }}>
        <div className="flex h-full">
          {/* Sidebar - Chat List */}
          <div className="w-80 border-r border-slate-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pesan..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition ${
                    selectedChat === chat.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{chat.name}</h3>
                          <p className="text-xs text-slate-500">{chat.role}</p>
                        </div>
                        <span className="text-xs text-slate-500">{chat.time}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 truncate flex-1">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
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

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {currentChat.avatar}
                      </div>
                      {currentChat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">{currentChat.name}</h2>
                      <p className="text-sm text-slate-500">
                        {currentChat.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Phone className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Video className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <MoreVertical className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl ${
                          message.sender === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          message.sender === 'me' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          <span className="text-xs">{message.time}</span>
                          {message.sender === 'me' && (
                            <span className="text-xs">
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white">
                  <div className="flex items-end gap-3">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Paperclip className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Smile className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={`p-3 rounded-xl transition shadow-lg ${
                        messageInput.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Pilih Chat
                  </h3>
                  <p className="text-slate-500">
                    Pilih percakapan dari daftar untuk mulai berkomunikasi
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}