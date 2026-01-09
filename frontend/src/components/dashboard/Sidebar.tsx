import React from 'react';
import { Home, Sprout, CloudRain, Settings, Activity, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Sprout, label: 'Crop Recommend', path: '/recommend' },
    { icon: CloudRain, label: 'Weather', path: '/weather' },
    { icon: Activity, label: 'Scan Disease', path: '/scan' },
    { icon: Settings, label: 'History', path: '/history' },
  ];

  return (
    <div className={clsx(
      "h-screen bg-agri-card border-r border-white/5 flex flex-col transition-all duration-300 relative z-20",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-agri-green to-emerald-400 bg-clip-text text-transparent">
            AgriAI
          </h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-agri-green text-black font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={clsx(isActive ? "text-black" : "group-hover:text-agri-green")} />
              
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={clsx(
          "bg-gradient-to-br from-agri-green/10 to-transparent p-4 rounded-xl border border-agri-green/20",
          collapsed ? "hidden" : "block"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-agri-green flex items-center justify-center text-black font-bold text-xs">
              MK
            </div>
            <div>
              <p className="text-sm font-medium text-white">Manoj Kumar</p>
              <p className="text-xs text-agri-green">Premium Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
