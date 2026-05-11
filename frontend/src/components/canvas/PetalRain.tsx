"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const PetalRain = () => {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
      size: 10 + Math.random() * 20,
      rotation: Math.random() * 360,
      type: i % 2
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: 0, opacity: 0, rotate: p.rotation }}
          animate={{ 
            y: "110vh", 
            x: [0, 50, -50, 20],
            opacity: [0, 0.7, 0.7, 0],
            rotate: p.rotation + 360 
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: "absolute",
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.type === 0 ? "#30530F" : "#C19B76",
            opacity: 0.2,
            borderRadius: "50% 0 50% 0",
            filter: "blur(1px)"
          }}
        />
      ))}
    </div>
  );
};
