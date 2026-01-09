import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const HealthBar = () => {
  const pieData = [
    { name: 'Healthy', value: 82, color: '#10B981' }, // Green
    { name: 'Risk', value: 18, color: '#EF4444' },   // Red
  ];

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex justify-between items-start">
         <h3 className="text-xl font-bold text-gray-200">Result Analysis :</h3>
         <button className="text-xs text-gray-500 hover:text-white transition-colors">See all &gt;</button>
      </div>

      <div className="flex items-center gap-4">
         {/* Mini Pie Chart Icon */}
         <div className="w-12 h-12 relative flex-shrink-0">
            <PieChart width={48} height={48}>
              <Pie
                data={pieData}
                cx={22}
                cy={22}
                innerRadius={14}
                outerRadius={22}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
         </div>

         <div>
           <h4 className="text-gray-400 text-sm">Overall Status</h4>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-bold text-agri-green">82%</span>
             <span className="text-xl text-white">Healthy</span>
           </div>
         </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-agri-green to-[#34D399] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
          style={{ width: '82%' }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
         <span>0%</span>
         <span>100%</span>
      </div>
    </div>
  );
};

export default HealthBar;
