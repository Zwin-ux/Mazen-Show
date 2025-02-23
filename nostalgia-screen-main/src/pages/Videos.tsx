import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play } from "lucide-react";
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

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<{ 
    id: number; 
    title: string; 
    description: string; 
    date: string; 
    thumbnail: string; 
    videoUrl: string;
  } | null>(null);
  

  return (
    <div className="min-h-screen w-full bg-black px-4 py-8 md:px-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-serif text-4xl">Video Gallery</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative group bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-2xl cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => setSelectedVideo(video)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-4">
              <h2 className="text-white text-xl font-semibold">{video.title}</h2>
              <p className="text-gray-400">{video.description}</p>
              <p className="text-gray-400">{video.date}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedVideo.title}</h2>
              <p className="mb-4">{selectedVideo.description}</p>
              <video controls src={selectedVideo.videoUrl} className="w-full h-auto" />
              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
