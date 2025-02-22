]import { useState } from "react";
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
    videoUrl: "#",
  },
];

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [stack, setStack] = useState(videos);

  const handlePick = (video) => {
    setStack((prev) => prev.filter((v) => v.id !== video.id));
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center">
      <header className="mb-8 flex items-center w-full max-w-3xl">
        <Link to="/" className="text-white hover:opacity-80">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-4 text-white text-3xl font-light">Video Library</h1>
      </header>
      
      <div className="relative w-full max-w-3xl h-[400px] flex justify-center items-center">
        <AnimatePresence>
          {stack.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ rotateZ: 0, y: index * -10 }}
              animate={{ rotateZ: -5 + Math.random() * 10, y: index * -10 }}
              exit={{ y: -400, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-72 h-48 bg-gray-800 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handlePick(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedVideo && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/90 z-50 p-4"
        >
          <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg">
            <button
              onClick={() => setSelectedVideo(null)}
              className="text-white hover:text-gray-300 mb-4"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-white text-2xl">{selectedVideo.title}</h2>
            <p className="text-gray-400">{selectedVideo.date}</p>
            <div className="mt-4 aspect-video bg-black rounded-lg flex items-center justify-center">
              <Play className="w-16 h-16 text-white opacity-50" />
            </div>
            <p className="text-white mt-4">{selectedVideo.description}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
