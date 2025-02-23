import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Message type with additional features
type Message = {
  id: number;
  text: string;
  timestamp: string;
  username: string;
  color: string;
  reactions: { [key: string]: number };
};

const colorOptions = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'
];

export const PublicChat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [userColor, setUserColor] = useState(colorOptions[0]);
  const [hasJoined, setHasJoined] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setHasJoined(true);
      inputRef.current?.focus();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      text: newMessage.trim().substring(0, 500), // Character limit
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      username,
      color: userColor,
      reactions: {},
    };

    setMessages((prev) => [...prev.slice(-100), message]); // Keep last 100 messages
    setNewMessage('');
    setTypingUsers((prev) => prev.filter((u) => u !== username));
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!typingUsers.includes(username)) {
      setTypingUsers((prev) => [...prev, username]);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    }, 2000);
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [emoji]: (msg.reactions[emoji] || 0) + 1,
              },
            }
          : msg
      )
    );
  };

  if (!hasJoined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-6 rounded-xl text-white shadow-lg max-w-md mx-auto"
      >
        <h3 className="font-sans text-2xl mb-4 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Join the Gallery Chat
        </h3>
        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 20))} // Max 20 chars
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Choose your alias..."
          />
          <div className="flex flex-wrap gap-2 justify-center">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setUserColor(color)}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: userColor === color ? '#FFFFFF' : 'transparent',
                }}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Enter the Fray
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white shadow-lg w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h3 className="font-sans text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Gallery Chatroom
        </h3>
        <span className="text-sm" style={{ color: userColor }}>
          {username}
        </span>
      </div>

      <div className="h-[400px] overflow-y-auto mb-4 bg-gray-800 p-4 rounded space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span style={{ color: message.color }}>{message.username}</span>
                <span>{message.timestamp}</span>
              </div>
              <p className="text-white break-words whitespace-pre-wrap">{message.text}</p>
              <div className="flex gap-2 mt-2">
                {Object.entries(message.reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    className="text-xs px-2 py-1 bg-gray-600 rounded-full hover:bg-gray-500"
                    onClick={() => addReaction(message.id, emoji)}
                  >
                    {emoji} {count}
                  </button>
                ))}
                <button
                  className="text-xs px-2 py-1 bg-gray-600 rounded-full hover:bg-gray-500"
                  onClick={() => addReaction(message.id, '👍')}
                >
                  👍
                </button>
                <button
                  className="text-xs px-2 py-1 bg-gray-600 rounded-full hover:bg-gray-500"
                  onClick={() => addReaction(message.id, '😂')}
                >
                  😂
                </button>
              </div>
            </motion.div>
          ))}
          {messages.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 pt-20"
            >
              The gallery is quiet... start the chaos!
            </motion.p>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="text-sm text-gray-400 mb-2 animate-pulse">
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={handleTyping}
          className="flex-1 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Drop your thoughts..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};