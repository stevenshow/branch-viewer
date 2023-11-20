import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CircularLoader = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 360); // Increment rotation
    }, 500); // Match this duration to the spinTransition duration

    return () => clearInterval(interval);
  }, []);

  const spinTransition = {
    loop: Infinity,
    ease: 'linear',
    duration: 0.5,
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        className="h-20 w-20 rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-blue-500"
        animate={{ rotate: rotation }}
        transition={spinTransition}
      />
    </div>
  );
};

export default CircularLoader;
