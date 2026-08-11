import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Settings,
  Scale,
  X
} from 'lucide-react';
import { ViewMode } from '../types/faraid';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator' as ViewMode, label: 'Perhitungan Baru', icon: Calculator },
    { id: 'history' as ViewMode, label: 'Riwayat', icon: History },
    { id: 'education' as ViewMode, label: 'Edukasi Faraid', icon: BookOpen },
    { id: 'simulation' as ViewMode, label: 'Simulasi Kasus', icon: Sparkles },
    { id: 'help' as ViewMode, label: 'Bantuan & Konsultasi', icon: HelpCircle },
    { id: 'settings' as ViewMode, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F766E] text-slate-100 flex flex-col shadow-xl border-r border-teal-800/40 transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-teal-800/60 bg-[#0B5A54]">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { onSelectView('landing'); onCloseMobile(); }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-emerald-950 shadow-md group-hover:scale-105 transition-transform font-bold">
              <Scale className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-white tracking-tight flex items-center gap-1.5 uppercase">
                Waris Cerdas
              </h1>
              <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase bg-[#134E4A] px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                Faraid & KHI
              </span>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-[#134E4A] text-[#D4AF37] shadow-md border border-[#D4AF37]/20 font-bold' 
                    : 'text-emerald-50 hover:bg-[#134E4A]/80 hover:text-white'}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#D4AF37]' : 'text-emerald-200/70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Islamic Luxury Footer Badge */}
        <div className="p-4 m-3 rounded-2xl bg-[#134E4A] border border-emerald-800/50 text-xs text-slate-200 shadow-inner">
          <div className="flex items-center space-x-2 text-[#D4AF37] font-semibold mb-1">
            <span className="text-sm font-arabic">بسم الله الرحمن الرحيم</span>
          </div>
          <p className="text-[11px] leading-relaxed text-emerald-100">
            Kalkulator Waris Berdasarkan Al-Qur'an, Hadis, & Kompilasi Hukum Islam.
          </p>
          <button 
            onClick={() => { onSelectView('help'); onCloseMobile(); }}
            className="mt-3 w-full py-2 bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Konsultasi Hukum
          </button>
        </div>
      </aside>
    </>
  );
};
