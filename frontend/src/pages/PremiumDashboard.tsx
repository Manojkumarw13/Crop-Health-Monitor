import DashboardLayout from '../components/dashboard/DashboardLayout';
import SmartCropCard from '../components/dashboard/SmartCropCard';
import SoilTrendTable from '../components/dashboard/SoilTrendTable';
import HealthBar from '../components/dashboard/HealthBar';
import ParameterMonitor from '../components/dashboard/ParameterMonitor';
import InputPanel from '../components/dashboard/InputPanel';
import ChatWidget from '../components/dashboard/ChatWidget';

const PremiumDashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-6 pb-20">
        {/* Left Column: Inputs (3 cols) */}
        <div className="col-span-12 lg:col-span-3">
          <InputPanel />
          
          <div className="mt-6 glass-panel p-6 bg-gradient-to-br from-agri-green/20 to-transparent border-agri-green/30">
             <h4 className="text-white font-bold mb-2">Pro Tip</h4>
             <p className="text-xs text-gray-300 leading-relaxed">
               Lowering irrigation by 10% this week can improve root aeration given the current soil porosity levels.
             </p>
          </div>
        </div>

        {/* Center Column: Main Diagnostics (5 cols) - Reducing size to make room for right panel if needed, but 12 grid is standard. Let's keep 6 for center. */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
           {/* Section Header */}
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Suitable Crops</h2>
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Top 3 matches</span>
           </div>

           {/* Crop Cards Carousel */}
           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-agri-green/20">
              <SmartCropCard 
                name="Sugarcane" 
                match={94} 
                image="https://images.unsplash.com/photo-1596436662453-65972323cc62?auto=format&fit=crop&w=500"
                duration="10-12 months"
                waterNeeds="High"
              />
              <SmartCropCard 
                name="Wheat" 
                match={87} 
                image="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500"
                duration="4-5 months"
                waterNeeds="Moderate"
              />
              <SmartCropCard 
                name="Maize" 
                match={78} 
                image="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500"
                duration="3-4 months"
                waterNeeds="Moderate"
              />
           </div>

           {/* Soil Trends */}
           <SoilTrendTable />
        </div>

        {/* Right Column: Summaries (3 cols) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
           <HealthBar />
           <ParameterMonitor />
        </div>
      </div>
      
      {/* Floating Chat */}
      <ChatWidget />
    </DashboardLayout>
  );
};

export default PremiumDashboard;
