
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Landing() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-screen flex items-center justify-center bg-museum-bg">
      <div className="w-full max-w-md p-8 bg-museum-tile rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95">
        <h1 className="text-4xl font-light text-white font-segoe mb-8">Welcome to the Gallery</h1>
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
    </div>
  );
}
