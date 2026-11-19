import React, { useState } from 'react';
import { Bell, Search, ArrowRight, Menu, X } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenReportDrawer: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'incidents', label: 'Crime Stories' },
  { id: 'learning', label: 'Suspense Stories' },
  { id: 'how-it-works', label: 'About Us' },
  { id: 'portals', label: 'Global Links' },
  { id: 'dashboard', label: 'Citizen Dossier' },
  { id: 'investigator', label: 'Workstation · AI', highlight: true },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenReportDrawer,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = currentTab === 'home';

  const userIdentityStr = `${currentUser?.name || ''} ${currentUser?.email || ''}`.toLowerCase();
  const activeAvatarUrl = userIdentityStr.includes('krishi')
    ? '/assets/aistudio/image_526c1ede.png'
    : userIdentityStr.includes('balchandra')
    ? '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg'
    : userIdentityStr.includes('zohara')
    ? '/assets/aistudio/image_acc490cb.png'
    : userIdentityStr.includes('afsheen')
    ? '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg'
    : null;

  const isSeniorInvestigator = currentUser?.role === 'senior_investigator';
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => item.id !== 'investigator' || isSeniorInvestigator
  );

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-200 ${
        isHome
          ? 'bg-[#0B0B0E]/95 border-white/10 text-white'
          : 'bg-[#F5F5F7]/95 border-black/10 text-[#0D0D10]'
      }`}
    >
      {/* Main Top Bar (Fits 100% Laptop Screen Ratio & Mobile Viewport) */}
      <div className="w-full h-14 flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-8 lg:px-12">
        {/* Zone 1: Condensed Noir Brand Wordmark — F.I.P (Forensic Investigation Platform) */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-noir-display text-xl sm:text-2xl font-bold uppercase tracking-tight focus:outline-none whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          title="F.I.P — Forensic Investigation Platform"
        >
          <span>
            <span className={isHome ? 'text-white' : 'text-[#0D0D10]'}>F.I.</span>
            <span className="text-[#E5192A]">P</span>
          </span>
          <span
            className={`hidden xl:inline-block text-[10px] font-mono-code font-medium tracking-wider uppercase border-l pl-2 ${
              isHome ? 'text-zinc-400 border-white/15' : 'text-zinc-500 border-black/15'
            }`}
          >
            Forensic Investigation Platform
          </span>
        </button>

        {/* Zone 2: Laptop / Desktop Navigation Links */}
        <nav
          className={`hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-medium ${
            isHome ? 'text-zinc-200' : 'text-zinc-600'
          }`}
        >
          {visibleNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#E5192A] font-semibold underline decoration-[#E5192A] decoration-2 underline-offset-4'
                    : item.highlight
                    ? 'text-[#E5192A] hover:opacity-80 font-semibold'
                    : isHome
                    ? 'hover:text-white'
                    : 'hover:text-[#0D0D10]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Right Search Icon, Notifications, Role Switcher & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('incidents')}
            className={`p-2 rounded-full transition-colors focus:outline-none cursor-pointer ${
              isHome
                ? 'text-zinc-200 hover:text-white hover:bg-white/10'
                : 'text-[#0D0D10] hover:bg-zinc-100'
            }`}
            title="Search Crime & Evidence Dockets"
          >
            <Search className="w-4 h-4" />
          </button>

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className={`relative p-2 rounded-full transition-colors focus:outline-none border cursor-pointer ${
                isHome
                  ? 'bg-white/5 hover:bg-white/15 text-white border-white/10'
                  : 'bg-white hover:bg-zinc-100 text-[#0D0D10] border-black/10'
              }`}
              title="Forensic Notifications Feed"
            >
              <Bell className={`w-4 h-4 ${isHome ? 'text-zinc-200' : 'text-[#0D0D10]'}`} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#E5192A] text-white text-[10px] font-bold tabular-nums shadow">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenAuth}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isHome
                ? 'bg-[#E5192A] hover:bg-[#c81222] text-white shadow-lg shadow-[#E5192A]/25'
                : 'bg-[#0D0D10] hover:bg-[#E5192A] text-white'
            }`}
            title="Switch Account / Role"
          >
            {activeAvatarUrl && (
              <img
                src={activeAvatarUrl}
                alt={currentUser.name || 'User'}
                className="w-5 h-5 rounded-full object-cover object-top border border-white/60 shrink-0"
              />
            )}
            <span>
              {currentUser?.name
                ? `${currentUser.name.split(' ')[0]} · Switch`
                : 'Switch Account'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile & Tablet Menu Button (< lg) */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
              isHome
                ? 'bg-white/5 border-white/15 text-white hover:bg-white/15'
                : 'bg-white border-black/15 text-[#0D0D10] hover:bg-zinc-100'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Expandable Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-3 ${
            isHome
              ? 'bg-[#0B0B0E]/98 border-white/10 text-white'
              : 'bg-[#F5F5F7]/98 border-black/10 text-[#0D0D10]'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {visibleNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#E5192A] text-white shadow'
                      : isHome
                      ? 'bg-white/5 text-zinc-200 hover:bg-white/10'
                      : 'bg-white text-[#0D0D10] border border-black/10'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-70" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#E5192A] text-white text-xs font-bold text-center"
            >
              Switch Account / Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportDrawer();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-center border ${
                isHome
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-[#0D0D10] border-[#0D0D10] text-white'
              }`}
            >
              File Evidence
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
