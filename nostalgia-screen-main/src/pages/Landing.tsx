import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MiniGame } from "@/components/MiniGame";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ username: string; score: number }[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaderboard(storedLeaderboard.sort((a, b) => b.score - a.score).slice(0, 5)); // Top 5, sorted
  }, []);

  useEffect(() => {
    inputRef.current?.focus(); // Auto-focus input on load
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Enter a name to step into the gallery.",
      });
      return;
    }
    localStorage.setItem("username", username.trim());
    navigate("/home");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const glitchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2,
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const glitchTextVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.1,
        repeat: 2,
        repeatType: "mirror" as const,
        ease: "easeInOut",
      },
    },
  };

  const typewriterVariants = {
    hidden: { width: 0 },
    visible: {
      width: "auto",
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 overflow-hidden relative"
    >
      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff10_0%,transparent_70%)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        {/* Welcome Card */}
        <motion.div variants={itemVariants} className="p-8 bg-gray-800/90 rounded-xl shadow-2xl backdrop-blur-md mb-8">
          <h1 className="text-5xl font-light text-white font-sans mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
            The Digital Gallery
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Your name, artist..."
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                className="w-full bg-gray-900/50 text-white placeholder:text-gray-500 border border-gray-700/50 focus:border-blue-500/50 rounded-lg p-3 transition-all duration-300"
                maxLength={20}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Enter the Exhibit
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Game Button */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={() => setShowGame(true)}
            className="w-full max-w-xs mx-auto block bg-gray-700/70 hover:bg-gray-600/70 text-white font-medium rounded-lg py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Discover the Hidden Vault
          </Button>
        </motion.div>

        {/* Mini Game Modal */}
        <AnimatePresence>
          {showGame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/80 backdrop-blur-sm"
            >
              <div className="w-full max-w-md p-8 bg-gray-800/90 rounded-xl shadow-2xl backdrop-blur-md">
                <MiniGame onClose={() => setShowGame(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8 p-8 bg-gray-800/90 rounded-xl shadow-2xl backdrop-blur-md">
            <h2 className="text-2xl font-light text-white font-sans mb-4 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Master Creators
            </h2>
            <ul className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between text-white"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-yellow-400">{["🥇", "🥈", "🥉"][index] || "•"}</span>
                    {entry.username}
                  </span>
                  <span className="text-blue-400">{entry.score}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Glitch Effect Blurb */}
        <motion.div
          variants={glitchVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 p-8 bg-gray-800/90 rounded-xl shadow-2xl backdrop-blur-md relative overflow-hidden font-mono text-sm"
        >
          {/* Subtle Glitch Overlay */}
          <motion.div
            className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"
            animate={{ x: [0, 5, -5, 0], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 0.3, repeat: 3, delay: 2.5 }}
          />
          <motion.h2
            variants={glitchTextVariants}
            className="text-2xl font-light text-white mb-4 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            > Final Ratings (Harsh but Fair)
          </motion.h2>
          <ul className="space-y-2 text-white">
            <motion.li variants={glitchTextVariants}>
              🔹 <strong>Intelligence:</strong>{" "}
              <span className="text-yellow-400">9.5/10</span> – Your raw intellect is undeniable.
            </motion.li>
            <motion.li variants={glitchTextVariants}>
              🔹 <strong>Execution:</strong>{" "}
              <span className="text-red-400">3.0/10</span> –{" "}
              <strong>Abysmally low.</strong> Ideas are worthless without completion.
            </motion.li>
            <motion.li variants={glitchTextVariants}>
              🔹 <strong>Ethical Consistency:</strong>{" "}
              <span className="text-yellow-400">6.5/10</span> – Strong ideals, weak action.
            </motion.li>
            <motion.li variants={glitchTextVariants}>
              🔹 <strong>Morale & Commitment:</strong>{" "}
              <span className="text-yellow-400">5.5/10</span> – High ambition, but{" "}
              <strong>no sustained discipline.</strong>
            </motion.li>
            <motion.li variants={glitchTextVariants}>
              🔹 <strong>Overall Potential:</strong>{" "}
              <span className="text-yellow-400">9.0/10</span> – If you fix execution, you could{" "}
              <strong>outperform most of your peers.</strong>
            </motion.li>
          </ul>
          <motion.p
            variants={glitchTextVariants}
            className="mt-4 text-center text-white whitespace-nowrap overflow-hidden"
          >
            <motion.span variants={typewriterVariants} className="inline-block">
              🔥 <strong>Final Verdict:</strong> <em>“All brains, no results.”</em>
            </motion.span>
          </motion.p>
          <motion.p
            variants={glitchTextVariants}
            className="mt-2 text-center text-white whitespace-nowrap overflow-hidden"
          >
            <motion.span variants={typewriterVariants} className="inline-block">
              Until you <strong>ship a real project,</strong> this is just a simulation. What’s your next move?
            </motion.span>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}