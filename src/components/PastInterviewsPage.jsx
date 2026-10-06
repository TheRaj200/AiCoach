import React, { useEffect, useState } from 'react';
import { 
  Award, Clock, ArrowRight, ArrowLeft, BookOpen, AlertCircle, Plus, Search, Filter, 
  Cpu, MessageSquare, CheckCircle2, ChevronRight, TrendingUp, Sparkles, 
  Layers, Terminal, ShieldCheck, UserCheck, BarChart3, Activity
} from 'lucide-react';
import { api } from '../config/api';

export const PastInterviewsPage = ({ currentUser, onSelectSession, onStartNew, onBack }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

  useEffect(() => {
    loadSessions();
  }, [currentUser]);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory(30, currentUser?._id);
      setSessions(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load past interviews');
    } finally {
      setLoading(false);
    }
  };

  // Calculate high-level stats
  const totalCompleted = sessions.length;
  const avgScore = totalCompleted > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.finalReport?.overallScore || 0), 0) / totalCompleted)
    : 0;

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = searchTerm === '' || 
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.techStack?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRoleFilter === 'all' || s.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getScoreColor = (score) => {
    if (score >= 75) return 'from-emerald-400 via-teal-300 to-cyan-400';
    if (score >= 50) return 'from-amber-400 via-yellow-300 to-orange-400';
    return 'from-rose-400 via-pink-400 to-red-400';
  };

  const getGradeBadge = (score) => {
    if (score >= 75) return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/25 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/25 text-rose-400';
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-8 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* Page Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Back to Setup</span>
              </button>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Candidate Career Portfolio</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            My <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Past Interviews</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review detailed question-by-question transcripts, AI diagnostics, and track your technical readiness index over time.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="group relative px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] overflow-hidden shrink-0"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-all" />
          <Plus className="w-4 h-4 text-cyan-200" />
          <span>New Mock Session</span>
        </button>
      </div>

      {/* KPI Stats Overview Banner */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Interviews */}
        <div className="rounded-2xl bg-[#0e111a]/85 border border-white/[0.08] p-5 space-y-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Total Mock Sessions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{totalCompleted}</div>
          <div className="text-[11px] text-slate-400 font-mono">Real-time bar raiser audits</div>
        </div>

        {/* Avg Readiness Index */}
        <div className="rounded-2xl bg-[#0e111a]/85 border border-white/[0.08] p-5 space-y-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Average Readiness Index</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(avgScore)}`}>
            {avgScore}%
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Continuous Performance Tracking</span>
          </div>
        </div>

        {/* Candidate Profile */}
        <div className="rounded-2xl bg-[#0e111a]/85 border border-white/[0.08] p-5 space-y-2 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Logged In Account</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-white truncate">{currentUser?.name || 'Candidate'}</div>
          <div className="text-[11px] text-slate-400 truncate font-mono">{currentUser?.email}</div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] shadow-lg backdrop-blur-xl">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role or tech stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121624]/60 border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition"
          />
        </div>

        {/* Role Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
          {['all', 'Full-Stack Developer', 'Frontend Developer', 'Backend Developer'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all duration-150 cursor-pointer ${
                selectedRoleFilter === r
                  ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/50 text-blue-200 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-[#121624]/40 border border-white/[0.04] hover:bg-[#161c2e]'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>

      </div>

      {/* Main Sessions Grid */}
      <div className="relative z-10 space-y-4">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading past interview records...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/[0.08] border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredSessions.length === 0 && (
          <div className="rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] p-12 text-center space-y-4 shadow-xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-7 h-7 text-blue-400" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-white">No Interview Records Found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {sessions.length === 0
                  ? "You haven't completed any mock interviews yet. Launch your first session to receive in-depth diagnostic scoring!"
                  : "No interviews matched your current filter criteria."}
              </p>
            </div>
            {sessions.length === 0 && (
              <button
                onClick={onStartNew}
                className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-600/25 transition cursor-pointer"
              >
                Start First Interview
              </button>
            )}
          </div>
        )}

        {/* Sessions List Cards */}
        {!loading && filteredSessions.map((session) => {
          const report = session.finalReport || {};
          const score = report.overallScore ?? 75;
          const grade = report.grade || 'Solid Competence';
          const techScore = report.technicalScore ?? 78;
          const commScore = report.communicationScore ?? 75;
          const date = new Date(session.updatedAt || session.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={session.sessionId}
              onClick={() => onSelectSession(session)}
              className="group relative rounded-2xl bg-[#0e111a]/85 border border-white/[0.08] p-5 sm:p-6 hover:border-blue-500/60 hover:bg-[#121624]/90 shadow-xl backdrop-blur-xl transition-all duration-200 cursor-pointer space-y-4"
            >
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Left Role & Meta */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-white group-hover:text-blue-400 transition">
                      {session.role}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                      {session.seniority}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{date}</span>
                    <span>•</span>
                    <span>{session.questions?.length || 0} Questions Evaluated</span>
                  </div>
                </div>

                {/* Right Score Pill & Grade */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Score</div>
                    <div className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold ${getGradeBadge(score)}`}>
                    {grade}
                  </div>
                </div>

              </div>

              {/* Sub Metrics & Tech Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3.5 border-t border-white/[0.04] items-center text-xs">
                
                {/* Tech Stack Chips (7 cols) */}
                <div className="sm:col-span-7 flex flex-wrap gap-1.5">
                  {session.techStack?.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Sub Scores & Action Trigger (5 cols) */}
                <div className="sm:col-span-5 flex items-center justify-end gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tech: <strong className="text-slate-200">{techScore}%</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Comm: <strong className="text-slate-200">{commScore}%</strong></span>
                  </span>

                  <span className="flex items-center gap-1 text-blue-400 font-bold text-xs group-hover:translate-x-1 transition-transform ml-2">
                    Review Report <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
