import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle, Droplets, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CropCardProps {
  name: string;
  match: number;
  image: string;
  duration?: string;
  waterNeeds?: string;
}

const SmartCropCard: React.FC<CropCardProps> = ({ name, match, image, duration = "4 months", waterNeeds = "Moderate" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div 
        layoutId={`card-${name}`}
        onClick={() => setIsOpen(true)}
        className="relative min-w-[200px] h-64 rounded-2xl overflow-hidden cursor-pointer group bg-agri-card border border-white/5 hover:border-agri-green/50 transition-colors"
      >
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-agri-dark via-agri-dark/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="flex justify-between items-end mb-1">
            <h3 className="text-xl font-bold text-white group-hover:text-agri-green transition-colors">{name}</h3>
            <div className={`text-sm font-bold px-2 py-1 rounded-full ${match > 80 ? 'bg-agri-green text-black' : 'bg-agri-yellow text-black'}`}>
              {match}%
            </div>
          </div>
          <p className="text-xs text-gray-400">Tap for AI analysis</p>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              layoutId={`card-${name}`}
              className="relative w-full max-w-md bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-50"
            >
              <div className="relative h-48">
                <img src={image} alt={name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-white/20"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-3xl font-bold text-white">{name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-agri-green text-sm font-bold">{match}% Match</span>
                    <span className="text-gray-400 text-xs">• Recommended</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                 {/* Match Factors */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <CheckCircle size={16} className="text-agri-green" /> Why this crop?
                  </h4>
                  <div className="bg-white/5 rounded-xl p-3 space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Soil pH Compatibility</span>
                      <span className="text-white">Perfect (6.5)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Climate Suitability</span>
                      <span className="text-white">High</span>
                    </div>
                  </div>
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Clock className="text-agri-yellow" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-medium text-white">{duration}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Droplets className="text-blue-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-400">Water</p>
                      <p className="text-sm font-medium text-white">{waterNeeds}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Warning (if not 100%) */}
                {match < 90 && (
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex gap-3">
                    <AlertTriangle className="text-red-400 shrink-0" size={18} />
                    <p className="text-xs text-red-200">
                      <strong>Risk Note:</strong> Slight pest risk detected due to high humidity. Monitor closely during early growth.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartCropCard;
