
import { useState } from 'react';

type Message = {
  id: number;
  text: string;
  timestamp: string;
  username: string;
};

export const PublicChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [hasSetUsername, setHasSetUsername] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
      username: username,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  if (!hasSetUsername) {
    return (
      <div className="bg-win8-tile p-4 rounded-lg text-white">
        <h3 className="font-segoe text-xl mb-4">Enter your username to chat</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (username.trim()) setHasSetUsername(true);
        }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-white text-black mb-2"
            placeholder="Enter username..."
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Chatting
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-win8-tile p-4 rounded-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-segoe text-xl">Public Chat</h3>
        <span className="text-sm">Chatting as: {username}</span>
      </div>
      
      <div className="h-[300px] overflow-y-auto mb-4 space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="bg-black/20 p-2 rounded">
            <div className="flex justify-between text-sm text-gray-300">
              <span>{message.username}</span>
              <span>{message.timestamp}</span>
            </div>
            <p>{message.text}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-white text-black"
          placeholder="Type a message..."
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};
