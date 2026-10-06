import React from 'react';
import { Terminal, Plus, LogIn, LogOut, User, Sparkles, ChevronDown, Award, LayoutDashboard, History } from 'lucide-react';

export const Header = ({ onNavigateHistory, onReset, activeSession, currentUser, onOpenAuth, onLogout, currentView }) => {
  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none mb-2">
      <div className="pointer-events-auto max-w-5xl w-full h-14 px-4 sm:px-5 rounded-full border border-white/[0.1] bg-[#0d0f17]/85 backdrop-blur-2xl shadow-2xl shadow-black/60 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#0d0f17] rounded-[7px] flex items-center justify-center transition-colors group-hover:bg-[#131726]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center">
              Ai<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Coach</span>
            </span>

          
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* "New Session" button (when interview in progress) */}
          {activeSession && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-full border border-white/[0.08] transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}

          {/* User Logged In State with Dropdown Menu */}
          {currentUser ? (
            <div className="relative group pl-1">
              
              {/* Profile Pill Trigger */}
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 text-xs text-slate-200 transition duration-200"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-bold uppercase shadow-sm">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <span className="max-w-[90px] truncate font-medium">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Hover Dropdown Card */}
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-60 p-2 rounded-2xl bg-[#0e111a] border border-white/[0.1] shadow-2xl shadow-black/80 backdrop-blur-2xl space-y-1">
                  
                  {/* User Details Header */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold uppercase">
                        {currentUser.name ? currentUser.name[0] : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{currentUser.email || 'Candidate'}</div>
                      </div>
                    </div>
                  </div>

                  {/* My Past Interviews Page Action */}
                  <button
                    onClick={onNavigateHistory}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                  >
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Past Interviews</span>
                  </button>

                  <div className="h-[1px] bg-white/[0.06] my-1" />

                  {/* Logout Action */}
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>

                </div>
              </div>
            </div>
          ) : (
            /* Logged Out / Visitor State */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition"
              >
                Sign In
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:opacity-95 shadow-sm shadow-cyan-500/20 transition"
              >
                Get Started
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
