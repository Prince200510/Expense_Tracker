import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import QuickAddModal from '../components/Dashboard/QuickAddModal';

const DashboardLayout = ({ children, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('vault_auth_token');
    localStorage.removeItem('vault_user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex min-h-screen">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant/40 z-50 flex-col justify-between select-none">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="h-14 px-margin border-b border-outline-variant/30 flex items-center gap-space-sm">
            <div className="flex flex-col min-w-0">
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight truncate leading-tight">VaultERP</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Personal Wealth OS</span>
            </div>
          </div>
          <div className="px-space-md py-space-sm">
            <span className="px-space-sm py-space-xs font-label-caps text-label-caps text-outline uppercase tracking-wider block">FINANCIAL CORE</span>
            <nav className="mt-space-xs space-y-0.5">
              <Link to="/expense/main" className={`flex items-center justify-between px-space-sm py-space-xs transition-colors rounded-lg shadow-sm ${currentPath.includes('main') ? 'bg-primary text-on-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span className="font-body-md text-body-md">Dashboard</span>
                </div>
              </Link>
              <Link to="/expense/transactions" className={`flex items-center justify-between px-space-sm py-space-xs rounded-lg transition-colors ${currentPath.includes('transactions') ? 'bg-primary text-on-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span className="font-body-md text-body-md">Transactions</span>
                </div>
              </Link>
              <Link to="/expense/budgets" className={`flex items-center justify-between px-space-sm py-space-xs rounded-lg transition-colors ${currentPath.includes('budgets') ? 'bg-primary text-on-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">pie_chart</span>
                  <span className="font-body-md text-body-md">Budgets</span>
                </div>
              </Link>
              <Link to="/expense/reports" className={`flex items-center justify-between px-space-sm py-space-xs rounded-lg transition-colors ${currentPath.includes('reports') ? 'bg-primary text-on-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}>
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span className="font-body-md text-body-md">Reports</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
        <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-low/40">
          <div className="p-space-sm bg-surface-container-lowest border border-outline-variant/40 rounded-lg flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-on-surface font-semibold">Tier 1 Executive</span>
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Live</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden fixed top-0 w-full z-[70] pt-safe bg-transparent transition-all duration-300 pointer-events-none">
        <div className="h-16 px-5 flex items-center justify-between pointer-events-auto">
          {/* Hamburger Menu & Profile Image */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-sm flex-shrink-0 cursor-pointer" onClick={() => setIsMobileDrawerOpen(true)}>
             <img src="/prince.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <div className={`md:hidden fixed inset-0 z-[80] ${isMobileDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileDrawerOpen(false)}
        ></div>
        
        {/* Drawer panel */}
        <div className={`absolute top-0 left-0 h-full w-64 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 pb-4 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-purple-50">
             <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                 <img src="/prince.png" alt="Profile" className="w-full h-full object-cover" />
               </div>
               <button onClick={() => setIsMobileDrawerOpen(false)} className="p-3 -m-2 relative z-10 pointer-events-auto cursor-pointer rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">close</span>
               </button>
             </div>
             <div className="font-bold text-lg text-gray-800 tracking-tight">Prince Maurya</div>
             <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Pro Member
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
             <nav className="px-3 space-y-1">
               <Link to="/expense/main" onClick={() => setIsMobileDrawerOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentPath.includes('main') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                 <span className="material-symbols-outlined text-[22px]">dashboard</span>
                 <span className="text-[15px]">Dashboard</span>
               </Link>
               <Link to="/expense/transactions" onClick={() => setIsMobileDrawerOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentPath.includes('transactions') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                 <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                 <span className="text-[15px]">Ledger</span>
               </Link>
               <Link to="/expense/budgets" onClick={() => setIsMobileDrawerOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentPath.includes('budgets') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                 <span className="material-symbols-outlined text-[22px]">pie_chart</span>
                 <span className="text-[15px]">Budgets</span>
               </Link>
               <Link to="/expense/reports" onClick={() => setIsMobileDrawerOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentPath.includes('reports') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                 <span className="material-symbols-outlined text-[22px]">description</span>
                 <span className="text-[15px]">Reports</span>
               </Link>
             </nav>
          </div>
          
          <div className="p-4 border-t border-gray-100">
             <button onClick={() => { setIsMobileDrawerOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors">
               <span className="material-symbols-outlined text-[20px]">logout</span>
               <span className="text-[15px]">Sign Out</span>
             </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="md:pl-60 flex flex-col min-h-screen w-full">
        {/* DESKTOP TOP HEADER */}
        <header className="hidden md:flex fixed top-0 left-60 right-0 h-14 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40 z-40 items-center justify-between px-margin gap-gutter">
          <div className="flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input type="text" placeholder="Search transactions..." className="w-full h-8 pl-8 pr-16 bg-surface border border-outline-variant/50 rounded text-on-surface placeholder:text-outline text-body-md font-body-md focus:outline-none focus:border-secondary transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <button onClick={() => setIsQuickAddOpen(true)} className="h-8 px-3 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary rounded flex items-center gap-1.5 text-body-md font-body-md font-medium shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Quick Add</span>
            </button>
            <div className="h-6 w-px bg-outline-variant/40 mx-1"></div>
            <button onClick={handleLogout} className="h-8 px-3 bg-surface-container hover:bg-error/10 hover:text-error text-on-surface-variant rounded flex items-center gap-1.5 text-body-md font-body-md transition-colors" title="Logout">
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-semibold">U</div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="w-full pt-0 md:pt-14 pb-24 md:pb-8 flex-1 bg-surface md:bg-surface">
          {children}
        </main>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-[70] pb-safe pointer-events-none">
        <div className="px-5 pb-6 pt-2 pointer-events-auto">
          {/* Pill Container */}
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex justify-between items-center h-[72px] px-2 relative">
            
            {/* Nav Group Left */}
            <div className="flex flex-1 justify-evenly items-center pr-8">
              <Link to="/expense/main" className={`flex flex-col items-center justify-center gap-1 min-w-[50px] h-12 transition-all ${currentPath.includes('main') ? 'text-[#845ef7]' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className={`material-symbols-outlined text-[24px] ${currentPath.includes('main') && 'font-filled'}`}>home</span>
                <span className="text-[10px] font-medium leading-none">Home</span>
              </Link>
              <Link to="/expense/reports" className={`flex flex-col items-center justify-center gap-1 min-w-[50px] h-12 transition-all ${currentPath.includes('reports') ? 'text-[#845ef7]' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className={`material-symbols-outlined text-[24px] ${currentPath.includes('reports') && 'font-filled'}`}>insert_chart</span>
                <span className="text-[10px] font-medium leading-none">Report</span>
              </Link>
            </div>

            {/* Center FAB */}
            <div className="absolute left-1/2 -top-6 -translate-x-1/2">
              <button onClick={() => setIsQuickAddOpen(true)} className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-[#9775fa] to-[#845ef7] text-white flex items-center justify-center shadow-lg shadow-[#845ef7]/40 transform hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-[32px] font-light">add</span>
              </button>
            </div>

            {/* Nav Group Right */}
            <div className="flex flex-1 justify-evenly items-center pl-8">
              <Link to="/expense/budgets" className={`flex flex-col items-center justify-center gap-1 min-w-[50px] h-12 transition-all ${currentPath.includes('budgets') ? 'text-[#845ef7]' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className={`material-symbols-outlined text-[24px] ${currentPath.includes('budgets') && 'font-filled'}`}>account_balance_wallet</span>
                <span className="text-[10px] font-medium leading-none">Plan</span>
              </Link>
              <Link to="/expense/transactions" className={`flex flex-col items-center justify-center gap-1 min-w-[50px] h-12 transition-all ${currentPath.includes('transactions') ? 'text-[#845ef7]' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className={`material-symbols-outlined text-[24px] ${currentPath.includes('transactions') && 'font-filled'}`}>receipt_long</span>
                <span className="text-[10px] font-medium leading-none">Transactions</span>
              </Link>
            </div>
            
          </div>
        </div>
      </nav>
      
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
