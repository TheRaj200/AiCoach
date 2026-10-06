import React, { useEffect, useState } from 'react';
import { X, Award, ArrowRight, BookOpen, AlertCircle, History, Lock, UserPlus } from 'lucide-react';
import { api } from '../config/api';

export const HistoryDrawer = ({ isOpen, onClose, onSelectSession, currentUser, onOpenAuth }) => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadHistory();
    }
  }, [isOpen, currentUser]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getHistory(15, currentUser?._id);
      setHistoryList(list || []);
    } catch (err) {
      setError('Could not load past sessions. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0d0f17] border-l border-white/[0.08] p-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-sm text-white">Interview History</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* If Guest User */}
          {!currentUser ? (
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-4 my-8">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Guest Session Mode</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  You are currently in Guest Mode. To save your interview scorecards, track skill growth, and access past transcripts, create a free account.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth('register');
                }}
                className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account / Sign In</span>
              </button>
            </div>
          ) : (
            /* Logged in User History List */
            <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
              {loading && (
                <div className="flex items-center justify-center py-12 text-slate-400 text-xs gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading records...</span>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-lg bg-rose-500/[0.08] border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!loading && !error && historyList.length === 0 && (
                <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                  <BookOpen className="w-7 h-7 mx-auto text-slate-600 mb-1" />
                  <p>No completed interviews saved yet.</p>
                  <p className="text-[11px] text-slate-600">Complete an interview session to review past scorecards here.</p>
                </div>
              )}

              {!loading && historyList.map((item) => {
                const score = item.finalReport?.overallScore ?? 75;
                const date = new Date(item.updatedAt || item.createdAt).toLocaleDateString();

                return (
                  <div
                    key={item.sessionId}
                    onClick={() => {
                      onSelectSession(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/40 hover:bg-white/[0.04] cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs text-slate-200 group-hover:text-blue-400 transition truncate">
                        {item.seniority} {item.role}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 ml-2">
                        {score}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate mb-2">
                      {item.techStack?.join(', ')}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
                      <span>{date} • {item.questions?.length || 0} Questions</span>
                      <span className="flex items-center gap-1 text-blue-400 font-medium group-hover:translate-x-0.5 transition">
                        View Report <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
