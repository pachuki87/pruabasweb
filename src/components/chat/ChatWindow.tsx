import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

type ChatWindowProps = {
  studentId: string;
  teacherId: string;
  onClose: () => void;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ studentId, teacherId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [studentId, teacherId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`sender_id.eq.${studentId},receiver_id.eq.${studentId}`)
        .or(`sender_id.eq.${teacherId},receiver_id.eq.${teacherId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('chats')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chats',
        filter: `sender_id=eq.${studentId},receiver_id=eq.${teacherId}`
      }, payload => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chats')
        .insert({
          sender_id: studentId,
          receiver_id: teacherId,
          message: newMessage.trim()
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Chat</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender_id === studentId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender_id === studentId
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <span className="text-xs opacity-75">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;