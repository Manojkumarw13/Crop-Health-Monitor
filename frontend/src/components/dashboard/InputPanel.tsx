import React from 'react';
import { Sliders } from 'lucide-react';

const InputPanel = () => {
  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center gap-2 text-agri-green mb-2">
        <Sliders size={20} />
        <h3 className="font-bold text-lg">Input Parameters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Region / Soil Type</label>
          <select className="bg-[#121212] border border-white/10 rounded-lg p-2.5 w-full text-white text-sm focus:border-agri-green focus:ring-1 focus:ring-agri-green">
             <option>Alluvial Soil (North)</option>
             <option>Black Soil (Deccan)</option>
             <option>Red Soil (South)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Crop Duration</label>
          <select className="bg-[#121212] border border-white/10 rounded-lg p-2.5 w-full text-white text-sm">
             <option>Short Term (3-4 months)</option>
             <option>Long Term (6+ months)</option>
          </select>
        </div>

        <div>
           <div className="flex justify-between text-sm mb-1">
             <span className="text-gray-400">Farm Size</span>
             <span className="text-agri-green">5 Acres</span>
           </div>
           <input type="range" className="w-full accent-agri-green h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div>
           <div className="flex justify-between text-sm mb-1">
             <span className="text-gray-400">Investment Cap</span>
             <span className="text-agri-green">₹50k</span>
           </div>
           <input type="range" className="w-full accent-agri-green h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>

        <button className="w-full btn-primary bg-agri-green text-black font-bold py-3 mt-4">
          Update Analysis
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
