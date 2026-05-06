import React, { useState } from 'react';
import { Music, Gift, MapPin, ChevronUp, ChevronDown, Volume2, VolumeX, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FABDockProps {
    isPlaying: boolean;
    scrollProgress: number;
    onToggleMusic: () => void;
    onOpenGift: () => void;
    onOpenMap?: () => void;
    onOpenRSVP: () => void;
}

export const FABDock: React.FC<FABDockProps> = ({ isPlaying, scrollProgress, onToggleMusic, onOpenGift, onOpenMap, onOpenRSVP }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col items-end gap-3 mb-2"
                    >
                        {/* Audio Toggle */}
                        <button
                            onClick={onToggleMusic}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${isPlaying ? 'bg-white text-[#6d0208]' : 'bg-gray-800 text-white'}`}
                        >
                            <div className={isPlaying ? 'animate-spin-slow' : ''}>
                                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </div>
                        </button>

                        {/* Gift Button */}
                        <button
                            onClick={onOpenGift}
                            className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all"
                        >
                            <Gift size={20} />
                        </button>

                        {/* Map Button */}
                        {onOpenMap && (
                            <button
                                onClick={onOpenMap}
                                className="w-12 h-12 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all"
                            >
                                <MapPin size={20} />
                            </button>
                        )}

                        {/* RSVP Button */}
                        <button
                            onClick={onOpenRSVP}
                            className="w-12 h-12 bg-[#6d0208] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#8d1017] transition-all"
                        >
                            <Heart size={20} fill="currentColor" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button with Scroll Progress */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all relative overflow-hidden ${isOpen ? 'bg-[#6d0208] text-white' : 'bg-white text-[#6d0208] border border-gray-100'}`}
            >
                {/* Scroll Progress Ring (SVG) */}
                {!isOpen && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle
                            cx="28" cy="28" r="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="163.36"
                            strokeDashoffset={163.36 * (1 - scrollProgress)}
                            className="opacity-20"
                        />
                    </svg>
                )}

                {/* Vinyl Disk Background Effect when playing */}
                {isPlaying && (
                    <div className="absolute inset-0 bg-stone-900/10 animate-spin-slow rounded-full border-[6px] border-dashed border-stone-400/20" />
                )}
                
                <div className={`relative z-10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    {isOpen ? <ChevronDown size={24} /> : <Music size={24} />}
                </div>

                {!isOpen && !isPlaying && (
                    <span className="absolute inset-0 rounded-full bg-[#6d0208]/20 animate-ping" />
                )}
            </button>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>

        </div>
    );
};
