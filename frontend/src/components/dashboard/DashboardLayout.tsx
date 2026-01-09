import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-agri-dark text-white overflow-hidden font-sans selection:bg-agri-green selection:text-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-agri-green/5 to-transparent pointer-events-none" />

        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 relative z-10 backdrop-blur-sm bg-agri-dark/50">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Overview</span>
            <span>/</span>
            <span className="text-white">Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-agri-green transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-agri-green/50 focus:bg-white/10 w-64 transition-all"
              />
            </div>
            
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={20} className="text-gray-400 hover:text-white" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-agri-red rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-agri-green/50">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
