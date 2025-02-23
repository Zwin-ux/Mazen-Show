import { ChevronLeft, Play, Pause, Volume2, Disc, Waves, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

// Types
interface AudioItem {
  id: number;
  title: string;
  artist: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
  waveform: number[];
  ambianceColor: string;
}

// Enhanced mock data
const mockAudios: AudioItem[] = [
  {
    id: 1,
    title: "Whispers of Canvas",
    artist: "Elena Voss",
    description: "A sonic exploration of paint meeting canvas in sacred silence.",
    date: "2024",
    duration: "3:45",
    audioUrl: "#",
    waveform: [20, 40, 30, 50, 35, 45, 30, 60, 40],
    ambianceColor: "from-indigo-900/70 to-purple-900/70",
  },
  {
    id: 2,
    title: "Metallic Reverie",
    artist: "Jonah Kael",
    description: "Sculptural resonance captured in an abandoned foundry.",
    date: "2023",
    duration: "5:20",
    audioUrl: "#",
    waveform: [10, 30, 20, 40, 25, 35, 20, 50, 30],
    ambianceColor: "from-gray-900/70 to-blue-900/70",
  },
];

const AudioGallery = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioItem | null>(null);
  const { 
    isPlaying, 
    togglePlay, 
    progress, 
    currentTime, 
    duration, 
    volume, 
    setVolume,
    seek,
    isLoading,
    error 
  } = useAudioPlayer(selectedAudio?.audioUrl);
  const controls = useAnimation();

  const handleSelectAudio = useCallback((audio: AudioItem) => {
    setSelectedAudio(audio);
    controls.start({ opacity: 1, scale: 1 });
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-black font-sans text-white overflow-hidden"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 px-8 py-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="group flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <h1 className="text-3xl font-light tracking-wider">Aural Exhibits</h1>
          </Link>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="pt-24 pb-16 px-8 max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {mockAudios.map((audio) => (
            <motion.div
              key={audio.id}
              layoutId={`audio-${audio.id}`}
              whileHover={{ y: -10 }}
              className={`relative group bg-gradient-to-br ${audio.ambianceColor} p-6 rounded-xl cursor-pointer overflow-hidden`}
              onClick={() => handleSelectAudio(audio)}
            >
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={selectedAudio?.id === audio.id && isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                    className="w-12 h-12 flex items-center justify-center"
                  >
                    <Disc className="w-10 h-10 text-white/40" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-medium tracking-tight">{audio.title}</h3>
                    <p className="text-sm text-white/70">{audio.artist}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm line-clamp-2">{audio.description}</p>
                <motion.div className="h-10 flex gap-1 items-end">
                  {audio.waveform.map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-white/60 rounded-t-full"
                      animate={{ height: selectedAudio?.id === audio.id && isPlaying ? [height, height * 1.5, height] : height }}
                      transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0, delay: i * 0.05 }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Audio Player Modal */}
      <AnimatePresence>
        {selectedAudio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-8"
          >
            <motion.div
              layoutId={`audio-${selectedAudio.id}`}
              className={`w-full max-w-4xl bg-gradient-to-br ${selectedAudio.ambianceColor} rounded-2xl shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl font-light tracking-wide"
                    >
                      {selectedAudio.title}
                    </motion.h2>
                    <p className="text-white/70">{selectedAudio.artist} • {selectedAudio.date}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAudio(null)}
                    className="p-2 hover:bg-white/10 rounded-full"
                    aria-label="Close player"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Player Controls */}
                <div className="space-y-6">
                  <div className="relative h-40 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0"
                      animate={{ opacity: isPlaying ? 0.2 : 0.1 }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Waves className="w-full h-full text-white/10" />
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 pl-1" />}
                    </motion.button>
                  </div>

                  {/* Progress and Volume */}
                  <div className="space-y-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-white/70">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-20 accent-white"
                        />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/90 text-lg leading-relaxed"
                  >
                    {selectedAudio.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Time formatting utility
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default AudioGallery;