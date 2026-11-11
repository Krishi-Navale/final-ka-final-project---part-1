import React, { useState, useEffect } from 'react';
import { ArrowUpRight, User, ShieldCheck, ShieldAlert, Bell, Database } from 'lucide-react';
import { UserProfile } from '../types';
import { checkServerStatus } from '../data/apiClient';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenReportDrawer: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenReportDrawer,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  const [backendStatus, setBackendStatus] = useState<{ status: string; database: string; smtp: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const status = await checkServerStatus();
      if (isMounted) setBackendStatus(status);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      {/* Top Notice Marquee Banner matching the black thin bar in the image */}
      <div className="bg-slate-950 text-white text-[11px] font-mono-code py-1.5 px-4 overflow-hidden border-b border-slate-800">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-medium">
          <span className="flex items-center gap-2 text-amber-300">
            <span>⚡ 14,000+ VERIFIED EVIDENCE HASHES</span>
            <span>·</span>
            <span>WRITE-ONCE-READ-MANY PROTOCOL ACTIVE</span>
            <span>·</span>
            <span className="text-white">NATIONAL FINANCIAL HELPLINE: DIAL 1930</span>
            <span>·</span>
            <span className="text-rose-400">SECTION 65B INDIAN EVIDENCE ACT COMPLIANT</span>
          </span>
          <span className="flex items-center gap-2 text-amber-300">
            <span>⚡ 14,000+ VERIFIED EVIDENCE HASHES</span>
            <span>·</span>
            <span>WRITE-ONCE-READ-MANY PROTOCOL ACTIVE</span>
            <span>·</span>
            <span className="text-white">NATIONAL FINANCIAL HELPLINE: DIAL 1930</span>
            <span>·</span>
            <span className="text-rose-400">SECTION 65B INDIAN EVIDENCE ACT COMPLIANT</span>
          </span>
        </div>
      </div>

      {/* Main Nav Row */}
      <div className="max-w-[1760px] 2xl:max-w-[1880px] mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        
        {/* Brand Name: "fip." (Forensic Investigation Platform) matching "relab" */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
            fip<span className="text-[#FF5A1F]">.</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Forensic Investigation Platform
          </span>
        </button>

        {/* Clean Menu Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors py-1 ${
              currentTab === 'home' ? 'text-slate-950 font-bold' : 'hover:text-slate-950'
            }`}
          >
            Home
          </button>
          {/* On Home page, Personal Dashboard button is hidden per user request */}
          {currentTab !== 'home' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'dashboard' ? 'text-slate-950 font-bold' : 'hover:text-slate-950'
              }`}
            >
              <span>Personal Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            </button>
          )}
          <button
            onClick={() => onNavigate('incidents')}
            className={`transition-colors py-1 ${
              currentTab === 'incidents' ? 'text-slate-950 font-bold' : 'hover:text-slate-950'
            }`}
          >
            Custody Vault
          </button>
          <button
            onClick={() => onNavigate('learning')}
            className={`transition-colors py-1 ${
              currentTab === 'learning' ? 'text-slate-950 font-bold' : 'hover:text-slate-950'
            }`}
          >
            Awareness Hub
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`transition-colors py-1 ${
              currentTab === 'how-it-works' ? 'text-slate-950 font-bold' : 'hover:text-slate-950'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('portals')}
            className={`transition-colors py-1 ${
              currentTab === 'portals' ? 'text-slate-950 font-bold' : 'hover:text-slate-950'
            }`}
          >
            Global Portals
          </button>
          {/* On Home page, Workstation button is hidden per user request */}
          {currentTab !== 'home' && currentUser.role === 'senior_investigator' && (
            <button
              onClick={() => onNavigate('investigator')}
              className={`transition-colors py-1 px-2.5 rounded-full bg-slate-900 text-amber-300 font-bold flex items-center gap-1 text-[11px] shadow-xs ${
                currentTab === 'investigator' ? 'ring-2 ring-amber-400' : 'hover:bg-slate-800'
              }`}
            >
              <span>Workstation ⚡</span>
            </button>
          )}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Live Backend Connection Indicator */}
          <div 
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-code transition-all shadow-xs border ${
              backendStatus?.database === 'CONNECTED'
                ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                : backendStatus?.status === 'ONLINE'
                ? 'bg-amber-50/90 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={`Backend Status: ${backendStatus?.status || 'INITIALIZING'} | Database: ${backendStatus?.database || 'CONNECTING'} | Mail: ${backendStatus?.smtp || 'READY'}`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                backendStatus?.database === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                backendStatus?.database === 'CONNECTED' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <Database className="w-3 h-3 opacity-70" />
            <span className="font-semibold">
              {backendStatus?.database === 'CONNECTED' ? 'MongoDB Atlas Live' : 'Backend Online'}
            </span>
          </div>
          {/* Notification Bell Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all focus:outline-none ring-1 ring-slate-200"
              title="Live Forensic Notifications Feed"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5A1F] text-white text-[10px] font-black animate-pulse shadow">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Only Switch Button Visible */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95"
            title="Switch Account / Role"
          >
            <User className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Switch</span>
          </button>
        </div>

      </div>
    </header>
  );
};

