'use client';

import { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';

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
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Data dummy untuk daftar chat
  const chats: Chat[] = [
    {
      id: '1',
      name: 'TechFlow Startup',
      avatar: '🏢',
      lastMessage: 'Terima kasih atas lamarannya',
      timestamp: '2 jam yang lalu',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Kopi Senja',
      avatar: '☕',
      lastMessage: 'Kapan bisa mulai mengerjakan?',
      timestamp: '5 jam yang lalu',
      unread: 0,
      online: false
    },
    {
      id: '3',
      name: 'Digital Agency',
      avatar: '🎨',
      lastMessage: 'Portfolio Anda menarik',
      timestamp: '1 hari yang lalu',
      unread: 1,
      online: true
    }
  ];

  // Data dummy untuk pesan
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo, saya tertarik dengan profil Anda',
      sender: 'other',
      timestamp: '10:30',
      read: true
    },
    {
      id: '2',
      text: 'Terima kasih! Ada yang bisa saya bantu?',
      sender: 'me',
      timestamp: '10:32',
      read: true
    },
    {
      id: '3',
      text: 'Kami sedang mencari Frontend Developer untuk proyek Next.js',
      sender: 'other',
      timestamp: '10:35',
      read: true
    },
    {
      id: '4',
      text: 'Saya sangat tertarik. Bisa dijelaskan lebih detail tentang proyeknya?',
      sender: 'me',
      timestamp: '10:37',
      read: true
    },
    {
      id: '5',
      text: 'Tentu, ini adalah aplikasi e-commerce dengan Next.js 14, TypeScript, dan Tailwind CSS',
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
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar - Daftar Chat */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pesan</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Daftar Chat */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                selectedChat === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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

      {/* Area Chat */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Header Chat */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                  {selectedChatData?.avatar}
                </div>
                {selectedChatData?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedChatData?.name}</h2>
                <p className="text-sm text-gray-500">
                  {selectedChatData?.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Pesan */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pilih Percakapan</h2>
            <p className="text-gray-600">Pilih chat dari daftar untuk mulai berkirim pesan</p>
          </div>
        </div>
      )}
    </div>
  );
}