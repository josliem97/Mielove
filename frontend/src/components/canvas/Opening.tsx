import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Opening = ({
  guestName,
  groomName,
  brideName,
  onOpen
}: {
  guestName: string;
  groomName: string;
  brideName: string;
  onOpen: () => void;
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(onOpen, 1000); 
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-[1000] overflow-hidden pointer-events-auto flex justify-center items-center bg-[#f5f5f5] p-4">
      {/* Centered Envelope Container - Fully Responsive */}
      <div className="relative w-full max-w-[450px] aspect-[3/4] max-h-[85vh] flex justify-center items-center overflow-visible bg-white shadow-2xl rounded-sm">
        
        {/* Left Flap */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 transition-transform duration-1000 ease-in-out z-[1001] shadow-[2px_0_10px_rgba(0,0,0,0.05)] ${isOpening ? '-translate-x-full' : 'translate-x-0'}`}
          style={{
            backgroundColor: '#f9eada',
            borderRight: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          {/* Text Content on Left Flap */}
          {!isOpening && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full h-full p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl font-script text-[#5d3a1a]" style={{ fontFamily: 'OpeningScript' }}>Save our date</span>
                </div>
                
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#5d3a1a] leading-tight flex flex-col font-bold">
                        <span className="mb-1">{groomName || "Thanh Sơn"}</span>
                        <span className="text-xl my-1 opacity-70">&</span>
                        <span>{brideName || "Diệu Nhi"}</span>
                    </h1>
                </div>

                <div>
                  <button
                    onClick={handleOpen}
                    className="px-5 py-2 bg-[#f3e5d8] text-[#5d3a1a] rounded-full font-bold uppercase tracking-[0.2em] text-[9px] shadow-sm hover:shadow-md transition-all border border-[#5d3a1a]/20"
                  >
                    MỞ THIỆP
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-serif text-[#5d3a1a]/70 uppercase tracking-widest">Trân trọng kính mời</p>
                <p className="text-[14px] sm:text-[16px] font-serif italic text-[#5d3a1a] font-black">{guestName || "Quý khách"}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Flap */}
        <div
          className={`absolute inset-y-0 right-0 w-1/2 transition-transform duration-1000 ease-in-out z-[1001] shadow-[-2px_0_10px_rgba(0,0,0,0.05)] ${isOpening ? 'translate-x-full' : 'translate-x-0'}`}
          style={{
            backgroundColor: '#f9eada',
          }}
        >
          {/* Subtle Seam Shadow */}
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/5 to-transparent"></div>
        </div>

        {/* Wax Seal - Exactly on the seam */}
        {!isOpening && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 1.2 }}
            onClick={handleOpen}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1002] w-24 h-24 sm:w-32 sm:h-32 cursor-pointer group"
          >
            {/* Circular Clip Container to remove any square background */}
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/assets/images/luxury-seal-white.png" 
                alt="Wax Seal" 
                className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
              />
            </div>
            {/* Soft Glow/Blur behind the seal */}
            <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm -z-10 group-hover:bg-white/40 transition-colors"></div>
            <div className="absolute inset-4 rounded-full bg-black/10 blur-xl -z-20"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
