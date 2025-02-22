
import { useEffect, useState } from "react";
import { PublicChat } from "@/components/PublicChat";
import { User, MessageSquare, X, Image, Video, Music } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MiniGame } from "@/components/MiniGame";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }
    
    document.body.style.backgroundColor = '#F1F0FB';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [username, navigate]);

  useEffect(() => {
    const handleSecretKey = (e: KeyboardEvent) => {
      if (e.key === 'g' && e.ctrlKey) {
        setShowGame(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleSecretKey);
    return () => window.removeEventListener('keydown', handleSecretKey);
  }, []);

  return (
    <div className="min-h-screen w-full bg-museum-bg px-4 py-8 md:px-8">
      <header className="mb-12">
        <div className="flex justify-between items-center">
          <h1 className="text-museum-text font-segoe text-5xl font-light">Gallery Overview</h1>
          <div className="flex items-center gap-3 text-museum-text">
            <User className="w-6 h-6" />
            <span className="font-segoe text-sm">Welcome, {username}</span>
          </div>
        </div>
        {showGame && (
          <div className="mt-6">
            <MiniGame />
          </div>
        )}
      </header>

      <main>
        {showChat ? (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-museum-tile rounded-lg relative">
              <button 
                onClick={() => setShowChat(false)}
                className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <PublicChat />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link 
            to="/photos"
            className="aspect-square bg-museum-tile text-white p-8 rounded-lg hover:animate-tile-hover flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Image className="w-12 h-12" />
            <span className="font-segoe text-lg">Photography</span>
          </Link>
          
          <Link 
            to="/videos"
            className="aspect-square bg-museum-tile text-white p-8 rounded-lg hover:animate-tile-hover flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Video className="w-12 h-12" />
            <span className="font-segoe text-lg">Cinema</span>
          </Link>

          <Link 
            to="/audio"
            className="aspect-square bg-museum-tile text-white p-8 rounded-lg hover:animate-tile-hover flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Music className="w-12 h-12" />
            <span className="font-segoe text-lg">Soundscape</span>
          </Link>

          <button 
            onClick={() => setShowChat(true)}
            className="aspect-square bg-museum-tile text-white p-8 rounded-lg hover:animate-tile-hover flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-12 h-12" />
            <span className="font-segoe text-lg">Visitor Chat</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
