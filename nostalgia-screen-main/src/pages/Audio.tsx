import { ChevronLeft, Play, Pause, Volume2, Disc, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "../../hooks/useAudioPlayer"; // Update the import path

type AudioItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
  waveform?: number[];
};

const mockAudios: AudioItem[] = [
  {
    id: 1,
    title: "Artist Statement",
    description: "A personal narrative about the artistic journey and creative process.",
    date: "2024",
    duration: "3:45",
    audioUrl: "#",
    waveform: [20, 40, 30, 50, 35, 45, 30, 60, 40],
  },
  // Add more mock data...
];

const AudioGallery = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioItem | null>(null);
  const { isPlaying, togglePlay, progress, currentTime } = useAudioPlayer(selectedAudio?.audioUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-black px-4 py-8 md:px-8"
    >
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-serif text-4xl">Sonic Gallery</h1>
        </div>
      </header>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8"
      >
        {mockAudios.map((audio) => (
          <motion.div
            key={audio.id}
            layoutId={audio.id.toString()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative group bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-2xl cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => setSelectedAudio(audio)}
          >
            <div className="absolute inset-0 bg-noise opacity-20 rounded-2xl" />
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <Disc className="w-12 h-12 text-white/30 animate-spin-slow" />
                  <Volume2 className="absolute w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-medium">{audio.title}</h3>
                  <p className="text-gray-400">{audio.duration}</p>
                </div>
              </motion.div>
              <div className="h-24 overflow-hidden">
                <p className="text-gray-300 line-clamp-3">{audio.description}</p>
              </div>
              <div className="mt-4 h-12 bg-black/30 rounded-lg p-2">
                <div className="flex gap-1 h-full items-end">
                  {audio.waveform?.map((height, index) => (
                    <motion.div
                      key={index}
                      className="w-2 bg-purple-400 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedAudio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAudio(null)}
          >
            <motion.div
              layoutId={selectedAudio.id.toString()}
              className="max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl text-white font-serif">
                      {selectedAudio.title}
                    </h2>
                    <p className="text-gray-400">{selectedAudio.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAudio(null)}
                    className="text-white hover:text-gray-300"
                    aria-label="Close"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                </div>

                <div className="relative h-48 bg-black/30 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Waves className="w-24 h-24 text-white/10" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/20"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8 pl-1" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-1 bg-white/10 rounded-full">
                    <motion.div
                      className="h-full bg-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{selectedAudio.duration}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg">
                  {selectedAudio.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to format time
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default AudioGallery;