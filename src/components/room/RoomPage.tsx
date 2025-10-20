import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWebRTC } from '../../hooks/useWebRTC';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Send, Upload, Users, Copy, Check,
  MessageSquare, FileIcon, Download
} from 'lucide-react';

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [roomName, setRoomName] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    peers,
    messages,
    fileTransfers,
    connected,
    sendChatMessage,
    sendFile,
  } = useWebRTC(roomId!, user!.id, profile!.username);

  useEffect(() => {
    const loadRoom = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('name')
        .eq('id', roomId)
        .maybeSingle();

      if (data) {
        setRoomName(data.name);
      }
    };

    loadRoom();
  }, [roomId]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId!);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      sendChatMessage(chatMessage);
      setChatMessage('');
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file) => {
        sendFile(file);
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (transfer: any) => {
    if (!transfer.data) {
      console.error('File data not available for download');
      return;
    }

    try {
      // Create a blob from the file data
      const blob = new Blob([transfer.data]);
      const url = URL.createObjectURL(blob);
      
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = transfer.name;
      link.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);
      
      console.log(`Successfully downloaded ${transfer.name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{roomName}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded-lg">{roomId?.slice(0, 8)}...</span>
                <button
                  onClick={copyRoomId}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  {copiedId ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">{peers.length + 1}</span>
            </div>
            {connected ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100/80 backdrop-blur-sm text-green-700 rounded-xl border border-green-200/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100/80 backdrop-blur-sm text-yellow-700 rounded-xl border border-yellow-200/50">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Waiting for peers...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 flex flex-col">
          <div
            className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${dragActive ? 'bg-blue-50/80 backdrop-blur-sm' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {dragActive && (
              <div className="h-full border-4 border-dashed border-blue-400 rounded-3xl flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-12 h-12 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-2">Drop files to share</p>
                  <p className="text-gray-600">Release to start the transfer</p>
                </div>
              </div>
            )}

            {!dragActive && (
              <div className="space-y-6">
                {messages.length === 0 && fileTransfers.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Room is ready
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                      Share the room ID with others to start chatting and sharing files
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Upload File
                    </button>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.userId === user!.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-6 py-4 rounded-3xl shadow-lg ${
                            msg.userId === user!.id
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'bg-white/80 backdrop-blur-sm border border-white/20 text-gray-900'
                          }`}
                        >
                          <p className="text-xs font-semibold mb-2 opacity-75">
                            {msg.username}
                          </p>
                          <p className="leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    ))}

                    {fileTransfers.map((transfer) => (
                      <div key={transfer.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-2xl">
                              <FileIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">{transfer.name}</p>
                              <p className="text-sm text-gray-600">
                                {formatFileSize(transfer.size)} • from {transfer.fromUsername}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {transfer.status === 'completed' && transfer.fromUserId !== user!.id && (
                              <button 
                                onClick={() => handleDownload(transfer)}
                                className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-200 hover:scale-110"
                                title="Download file"
                              >
                                <Download className="w-6 h-6" />
                              </button>
                            )}
                            {transfer.status === 'completed' && transfer.fromUserId === user!.id && (
                              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-xl">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium">Sent</span>
                              </div>
                            )}
                            {transfer.status === 'transferring' && (
                              <div className="text-lg font-semibold text-blue-600">
                                {transfer.progress}%
                              </div>
                            )}
                          </div>
                        </div>
                        {transfer.status === 'transferring' && (
                          <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 ease-out"
                              style={{ width: `${transfer.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-white/20 bg-white/80 backdrop-blur-sm p-6">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Upload className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>

        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-white/20 p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            Active Users ({peers.length + 1})
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {profile?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{profile?.username}</p>
                <p className="text-sm text-blue-600 font-medium">You</p>
              </div>
            </div>
            {peers.map((peer) => (
              <div key={peer.id} className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-200">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {peer.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{peer.username}</p>
                  <p className="text-sm text-green-600 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
