import React from 'react';

const ParameterMonitor = () => {
  const data = [
    { name: 'Temperature', good: 40, avg: 5.3, poor: 1.0 },
    { name: 'Humidity', good: 68, avg: 7.4, poor: 9.9 },
    { name: 'Soil PH', good: 69, avg: 4.8, poor: 0.9 },
    { name: 'Nitrogen', good: 55, avg: 5.3, poor: 0.8 },
  ];

  return (
    <div className="glass-panel p-6">
      <h3 className="text-sm font-semibold text-agri-green mb-4 uppercase tracking-wider">Parameter Breakdown</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-white/5">
              <th className="py-2 pl-2">Type</th>
              <th className="py-2 text-agri-green">Good</th>
              <th className="py-2 text-agri-yellow">Avg</th>
              <th className="py-2 text-agri-red">Poor</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((row) => (
              <tr key={row.name} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="py-4 pl-2 font-medium text-gray-300">{row.name}</td>
                <td className="py-4 font-mono text-agri-green">{row.good}%</td>
                <td className="py-4 font-mono text-agri-yellow">{row.avg}%</td>
                <td className="py-4 font-mono text-agri-red">{row.poor}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
          <div className="w-10 h-10 rounded-full bg-agri-green flex items-center justify-center text-black font-bold shadow-lg animate-bounce">
            A
          </div>
      </div>
    </div>
  );
};

export default ParameterMonitor;
