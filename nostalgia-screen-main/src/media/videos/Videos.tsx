import { ChevronLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

type VideoItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  videoUrl: string;
};

const mockVideos: VideoItem[] = [
  {
    id: 1,
    title: "Creative Process",
    description: "A video showcasing the creative process.",
    date: "2024",
    videoUrl: "#",
  },
  // Add more mock data...
];

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

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
        {mockVideos.map((video) => (
          <div
            key={video.id}
            className="relative group bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-2xl cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="absolute inset-0 bg-noise opacity-20 rounded-2xl" />
            <div className="relative z-10">
              <h3 className="text-white text-xl font-medium">{video.title}</h3>
              <p className="text-gray-400">{video.date}</p>
              <div className="mt-4 aspect-video bg-black rounded-lg flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-50" />
              </div>
              <p className="text-gray-300 mt-4">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedVideo(null)}
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