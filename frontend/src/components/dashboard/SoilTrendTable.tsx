import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface SoilNutrient {
  name: string; // e.g. Nitrogen
  value: number; // Current value
  unit: string; // ppm, kg/ha
  status: 'Good' | 'Average' | 'Poor';
  history: number[]; // Last 7 values
  idealRange: string;
}

// Dummy data generator if no history
const generateHistory = (current: number) => {
  return Array(7).fill(0).map((_, i) => current + (Math.random() * 10 - 5));
};

const SoilTrendTable = () => {
  const nutrients: SoilNutrient[] = [
    { name: 'Nitrogen', value: 140, unit: 'kg/ha', status: 'Good', history: generateHistory(140), idealRange: '100-200' },
    { name: 'Phosphorus', value: 18, unit: 'kg/ha', status: 'Average', history: generateHistory(18), idealRange: '20-50' },
    { name: 'Potassium', value: 210, unit: 'kg/ha', status: 'Good', history: generateHistory(210), idealRange: '150-300' },
    { name: 'pH Level', value: 5.8, unit: '', status: 'Poor', history: generateHistory(5.8), idealRange: '6.0-7.5' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Good': return 'text-agri-green bg-agri-green/10 border-agri-green/20';
      case 'Average': return 'text-agri-yellow bg-agri-yellow/10 border-agri-yellow/20';
      case 'Poor': return 'text-agri-red bg-agri-red/10 border-agri-red/20';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (history: number[]) => {
    const first = history[0];
    const last = history[history.length - 1];
    if (last > first * 1.05) return <TrendingUp size={14} className="text-agri-green" />;
    if (last < first * 0.95) return <TrendingDown size={14} className="text-agri-red" />;
    return <Minus size={14} className="text-gray-500" />;
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Soil Health Trends</h3>
        <button className="text-xs text-agri-green hover:underline">Full Analysis →</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
              <th className="pb-3 pl-2">Nutrient</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">7-Day Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {nutrients.map((item) => (
              <tr key={item.name} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-200">{item.name}</span>
                    <div className="group/info relative">
                      <Info size={14} className="text-gray-600 hover:text-agri-green cursor-pointer" />
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 bg-black/90 p-2 rounded-lg border border-white/10 text-xs text-gray-300 opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-50">
                        Ideal Range: {item.idealRange} {item.unit}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-mono text-sm">
                  {item.value.toFixed(1)} <span className="text-gray-500 text-xs">{item.unit}</span>
                </td>
                <td className="py-4">
                  <span className={clsx("px-2 py-1 rounded-full text-xs font-bold border", getStatusColor(item.status))}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 w-32 h-12">
                   <div className="flex items-center gap-2">
                     {getTrendIcon(item.history)}
                     <div className="h-8 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={item.history.map((v, i) => ({ v }))}>
                            <Line 
                              type="monotone" 
                              dataKey="v" 
                              stroke={item.status === 'Poor' ? '#EF4444' : '#10B981'} 
                              strokeWidth={2} 
                              dot={false} 
                            />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                          </LineChart>
                        </ResponsiveContainer>
                     </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoilTrendTable;
