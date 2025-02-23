import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MessageSquare, X, Image, Video, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load components for better performance
const PublicChat = lazy(() => import("@/components/PublicChat"));
const MiniGame = lazy(() => import("@/components/MiniGame"));

// Define types
interface GalleryItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

// Constants
const GALLERY_ITEMS: GalleryItem[] = [
  { to: "/photos", icon: Image, label: "Photography", color: "bg-blue-600" },
  { to: "/videos", icon: Video, label: "Cinema", color: "bg-red-600" },
  { to: "/audio", icon: Music, label: "Soundscape", color: "bg-green-600" },
];

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Memoized handlers
  const handleToggleChat = useCallback(() => setShowChat(prev => !prev), []);
  const handleToggleGame = useCallback((e: KeyboardEvent) => {
    if (e.key === 'g' && e.ctrlKey) {
      setShowGame(prev => !prev);
    }
  }, []);

  // Authentication effect
  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
      return;
    }

    document.body.style.backgroundColor = '#F1F0FB';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [username, navigate]);

  // Keyboard shortcut effect
  useEffect(() => {
    window.addEventListener('keydown', handleToggleGame);
    return () => window.removeEventListener('keydown', handleToggleGame);
  }, [handleToggleGame]);

  // Tile component
  const GalleryTile = ({ item, isButton = false }: { item: GalleryItem; isButton?: boolean }) => {
    const content = (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${item.color} text-white p-8 rounded-lg flex flex-col items-center justify-center gap-4 shadow-lg transition-all duration-300`}
      >
        <item.icon className="w-12 h-12" />
        <span className="font-segoe text-lg">{item.label}</span>
      </motion.div>
    );

    return isButton ? (
      <button onClick={handleToggleChat} className="aspect-square">
        {content}
      </button>
    ) : (
      <Link to={item.to} className="aspect-square">
        {content}
      </Link>
    );
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-8">
      <header className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-5xl font-light font-segoe bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gallery Overview
          </h1>
          <div className="flex items-center gap-3 text-gray-700">
            <User className="w-6 h-6" />
            <span className="font-segoe text-sm">Welcome, {username}</span>
          </div>
        </motion.div>

        <AnimatePresence>
          {showGame && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <Suspense fallback={<div>Loading game...</div>}>
                <MiniGame />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            >
              <div className="w-full max-w-2xl bg-white rounded-lg relative p-4">
                <button
                  onClick={handleToggleChat}
                  className="absolute right-4 top-4 text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-6 h-6" />
                </button>
                <Suspense fallback={<div>Loading chat...</div>}>
                  <PublicChat />
                </Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <GalleryTile key={item.to} item={item} />
          ))}
          <GalleryTile 
            item={{ to: "", icon: MessageSquare, label: "Visitor Chat", color: "bg-purple-600" }}
            isButton={true}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;