import { useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Photos = () => {
  const [photos, setPhotos] = useState([
    "/images/photo1.png",
    "/images/photo2.png",
    "/images/photo3.png",
    "/images/photo4.png",
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const shufflePhotos = () => {
    setPhotos((prev) => [...prev.sort(() => Math.random() - 0.5)]);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-900">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} intensity={1} />
        <PhotoBoxModel />
      </Canvas>

      <motion.div
        className="absolute bottom-10 flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button onClick={shufflePhotos} className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600">
          Shuffle Photos
        </Button>
      </motion.div>

      <div className="absolute top-10 flex space-x-4 overflow-hidden">
        {photos.map((photo, index) => (
          <motion.img
            key={index}
            src={photo}
            alt="Photo"
            className="w-32 h-24 rounded-lg shadow-md cursor-pointer"
            whileTap={{ scale: 1.1 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

      {selectedPhoto && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <Card className="relative w-96 p-4 bg-white rounded-lg shadow-lg">
            <CardContent>
              <img src={selectedPhoto} alt="Selected" className="w-full h-auto rounded-lg" />
              <Button className="mt-4 w-full" onClick={() => setSelectedPhoto(null)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const PhotoBoxModel = () => {
  const { scene } = useGLTF("/models/photo_box.glb");
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
};

export default Photos;
