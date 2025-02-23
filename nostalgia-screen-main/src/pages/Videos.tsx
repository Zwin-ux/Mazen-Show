import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, Play, X } from "lucide-react";
import { Link } from "react-router-dom";

const videos = [
  {
    id: 1,
    title: "Digital Art Process",
    description: "A time-lapse recording of a digital art creation process.",
    date: "2024",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    videoUrl: "#",
  },
  {
    id: 2,
    title: "Studio Tour",
    description: "A virtual tour through the artist's creative space.",
    date: "2023",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

// Animation variants
const cardVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle closing modal with escape key or outside click
  const handleClose = useCallback(() => setSelectedVideo(null), []);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black px-4 py-8 md:px-8">
      {/* Header */}
      <header className="mb-12 container mx-auto">
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-white hover:text-purple-300 transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-8 h-8" />
          </Link>
          <motion.h1 
            className="text-white font-serif text-4xl md:text-5xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Video Gallery
          </motion.h1>
        </div>
      </header>

      {/* Video Grid */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="relative group bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-2xl cursor-pointer shadow-lg overflow-hidden"
            onClick={() => setSelectedVideo(video)}
            role="button"
            tabIndex={0}
            aria-label={`Play ${video.title}`}
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-white text-xl font-semibold line-clamp-1">{video.title}</h2>
              <p className="text-gray-300 text-sm line-clamp-2">{video.description}</p>
              <p className="text-gray-400 text-sm">{video.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={handleModalClick}
          >
            <motion.div
              ref={modalRef}
              className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{selectedVideo.title}</h2>
              <p className="mb-4 text-gray-700">{selectedVideo.description}</p>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  autoPlay
                  src={selectedVideo.videoUrl}
                  className="w-full h-full"
                  poster={selectedVideo.thumbnail}
                  onError={(e) => console.error("Video loading error:", e)}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}