import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Constants
const PHOTO_INITIAL_STATE = [
  "/images/photo1.png",
  "/images/photo2.png",
  "/images/photo3.png",
  "/images/photo4.png",
];

const photoVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

const Photos = () => {
  const [photos, setPhotos] = useState(PHOTO_INITIAL_STATE);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Memoized shuffle function
  const shufflePhotos = useCallback(() => {
    setIsShuffling(true);
    setPhotos((prev) => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      return shuffled;
    });
    setTimeout(() => setIsShuffling(false), 500);
  }, []);

  // Memoized photo elements
  const photoElements = useMemo(() => photos.map((photo, index) => (
    <motion.img
      key={`${photo}-${index}`}
      src={photo}
      alt={`Photo ${index + 1}`}
      className="w-32 h-24 rounded-lg shadow-md cursor-pointer object-cover hover:shadow-xl transition-shadow"
      variants={photoVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileTap={{ scale: 1.1 }}
      whileHover={{ scale: 1.05 }}
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      onClick={() => setSelectedPhoto(photo)}
      layout
    />
  )), [photos]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 60 }}
        className="absolute inset-0"
      >
        <OrbitControls 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow 
        />
        <PhotoBoxModel />
      </Canvas>

      {/* Controls */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={shufflePhotos}
          disabled={isShuffling}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-60"
        >
          {isShuffling ? "Shuffling..." : "Shuffle Photos"}
        </Button>
      </motion.div>

      {/* Photo Gallery */}
      <motion.div 
        className="absolute top-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10"
        layout
      >
        <AnimatePresence>
          {photoElements}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <Card 
              className="relative w-96 max-h-[80vh] bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent className="p-4">
                <motion.img
                  src={selectedPhoto}
                  alt="Selected photo"
                  className="w-full h-auto rounded-lg max-h-[60vh] object-contain"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <Button
                  className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white"
                  onClick={() => setSelectedPhoto(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PhotoBoxModel = () => {
  const { scene } = useGLTF("/models/photo_box.glb");
  return (
    <motion.primitive
      object={scene}
      scale={2}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
      whileHover={{ rotateY: 360 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  );
};

export default Photos;