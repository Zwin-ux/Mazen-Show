import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Photos from "./pages/Photos";
import Videos from "./pages/Videos";
import Audio from "./pages/Audio";
import NotFound from "./pages/NotFound";
import DarkModeToggle from "@/components/DarkModeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DarkModeToggle />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Index />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
