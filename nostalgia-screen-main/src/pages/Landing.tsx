import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaderboard(storedLeaderboard);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        variant: "destructive",
        title: "Username required",
        description: "Please enter a username to continue",
      });
      return;
    }
    localStorage.setItem("username", username.trim());
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-museum-bg px-4">
      <div className="w-full max-w-md p-8 bg-museum-tile rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95 mb-8">
        <h1 className="text-4xl font-light text-white font-segoe mb-8 text-center">Welcome to the Gallery</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Enter your name to begin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 text-white placeholder:text-gray-400 border-none"
              maxLength={20}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300"
          >
            Start the Exhibition
          </Button>
        </form>
      </div>

      <Button 
        onClick={() => setShowGame(true)}
        className="bg-white/20 hover:bg-white/30 text-white transition-all duration-300 mb-8"
      >
        Play Hidden Game
      </Button>

      {showGame && (
        <div className="w-full max-w-md p-8 bg-museum-tile rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95">
          <MiniGame onClose={() => setShowGame(false)} />
        </div>
      )}

      <div className="w-full max-w-md p-8 bg-museum-tile rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95">
        <h2 className="text-2xl font-light text-white font-segoe mb-4 text-center">Leaderboard</h2>
        <ul className="space-y-2">
          {leaderboard.map((entry, index) => (
            <li key={index} className="text-white text-center">
              {index + 1}. {entry.username} - {entry.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
