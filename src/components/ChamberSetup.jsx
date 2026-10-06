import React, { useState } from 'react';
import { 
  Code, Server, Layers, Cpu, Database, Smartphone, ArrowRight, Check, Sparkles, 
  Shield, Clock, Award, Zap, Flame, Crown, CheckCircle2, Terminal, Sliders, ChevronRight
} from 'lucide-react';

const ROLES = [
  { 
    id: 'Full-Stack Developer', 
    label: 'Full-Stack Engineer', 
    icon: Layers, 
    badge: 'Popular',
    accent: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    summary: 'React, Node.js, DBs, REST/GraphQL & System Design' 
  },
  { 
    id: 'Frontend Developer', 
    label: 'Frontend Developer', 
    icon: Code, 
    badge: 'UI/UX',
    accent: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    summary: 'React, TypeScript, CSS architecture & Web Performance' 
  },
  { 
    id: 'Backend Developer', 
    label: 'Backend Engineer', 
    icon: Server, 
    badge: 'High Scale',
    accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    summary: 'Node.js, Distributed Systems, Microservices & SQL/NoSQL' 
  },
  { 
    id: 'AI / ML Engineer', 
    label: 'AI & Gemma Engineer', 
    icon: Cpu, 
    badge: 'Trending',
    accent: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    summary: 'LLM Agents, Vector DBs, Fine-tuning & Python APIs' 
  },
  { 
    id: 'DevOps Engineer', 
    label: 'DevOps / Cloud', 
    icon: Database, 
    badge: 'Infra',
    accent: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    summary: 'Docker, CI/CD pipelines, Kubernetes & Cloud Security' 
  },
  { 
    id: 'Mobile Developer', 
    label: 'Mobile Engineer', 
    icon: Smartphone, 
    badge: 'Cross-platform',
    accent: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
    summary: 'React Native, Flutter, Native Modules & State' 
  },
];

const POPULAR_TAGS = [
  'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express.js',
  'MongoDB', 'PostgreSQL', 'System Design', 'Docker', 'Redis',
  'REST APIs', 'GraphQL', 'Next.js', 'Python', 'Security & Auth'
];

export const ChamberSetup = ({ onStart, isStarting }) => {
  const [selectedRole, setSelectedRole] = useState('Full-Stack Developer');
  const [seniority, setSeniority] = useState('Junior');
  const [selectedTags, setSelectedTags] = useState(['JavaScript (ES6+)', 'React.js', 'Node.js', 'MongoDB']);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showTailorAccordion, setShowTailorAccordion] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({
      role: selectedRole,
      seniority,
      techStack: selectedTags,
      totalQuestions: Number(totalQuestions),
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
    });
  };

  const activeRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* Top Header Title */}
      <div className="relative mb-8 text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
          Tailor Your <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">AI Mock Session</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Calibrate your target role, stack competencies, and seniority. The AI Principal Bar Raiser will formulate real-time adaptive technical challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left: Configuration Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* 1. Target Role */}
          <div className="relative rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] p-5 sm:p-6 shadow-xl backdrop-blur-xl transition hover:border-white/[0.12]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>1. Target Role</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                Choose primary discipline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`group relative flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-950/60 to-slate-900/80 border-blue-500/70 shadow-[0_0_20px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/40'
                        : 'bg-[#121624]/60 border-white/[0.06] hover:bg-[#161c2e] hover:border-white/[0.14] hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isSelected 
                        ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30' 
                        : 'bg-white/[0.04] text-slate-400 group-hover:text-slate-200 group-hover:bg-white/[0.08]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {r.label}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        ) : (
                          <span className="text-[9px] font-medium text-slate-500 px-1.5 py-0.2 rounded bg-white/[0.04]">
                            {r.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 leading-snug">
                        {r.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Seniority Level */}
          <div className="relative rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] p-5 sm:p-6 shadow-xl backdrop-blur-xl transition hover:border-white/[0.12]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>2. Target Seniority</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                Calibrates question depth & rigor
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Junior', label: 'Junior', desc: '0–2 yrs', icon: Zap, color: 'text-cyan-400' },
                { id: 'Mid-Level', label: 'Mid-Level', desc: '2–5 yrs', icon: Flame, color: 'text-indigo-400' },
                { id: 'Senior', label: 'Senior', desc: '5+ yrs', icon: Crown, color: 'text-amber-400' },
              ].map((lvl) => {
                const isSelected = seniority === lvl.id;
                const LvlIcon = lvl.icon;
                return (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setSeniority(lvl.id)}
                    className={`relative p-3.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-950/70 to-slate-900/90 border-blue-500/70 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/40'
                        : 'bg-[#121624]/60 border-white/[0.06] text-slate-400 hover:bg-[#161c2e] hover:border-white/[0.14] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <LvlIcon className={`w-3.5 h-3.5 ${lvl.color}`} />
                      <span className="text-xs font-bold">{lvl.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{lvl.desc}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 block animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Tech Stack Chips */}
          <div className="relative rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] p-5 sm:p-6 shadow-xl backdrop-blur-xl transition hover:border-white/[0.12]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>3. Key Topics & Tech Stack</span>
              </label>
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                {selectedTags.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600/25 via-indigo-600/25 to-cyan-600/25 border-blue-500/50 text-blue-200 shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/30'
                        : 'bg-[#121624]/60 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-[#161c2e] hover:border-white/[0.14]'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3 h-3 text-cyan-400 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors" />
                    )}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Optional Resume & Job Description Tailoring */}
          <div className="relative rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] p-5 sm:p-6 shadow-xl backdrop-blur-xl transition hover:border-white/[0.12]">
            <div 
              onClick={() => setShowTailorAccordion(!showTailorAccordion)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  4. Tailor with Resume / Job Description (Optional)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                {resumeText || jobDescription ? '✓ Customized' : showTailorAccordion ? 'Hide Options' : '+ Expand'}
              </span>
            </div>

            {showTailorAccordion && (
              <div className="pt-4 space-y-3.5 border-t border-white/[0.06] mt-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Target Job Description (JD)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste target company JD (e.g., Senior React Engineer at Swiggy. Requirements: High-scale distributed systems, micro-frontends, state optimization...)"
                    rows={3}
                    className="w-full rounded-xl bg-[#121624]/60 border border-white/[0.08] p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Your Resume Highlights & Key Projects
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume highlights or project claims (e.g., Built Redis caching cluster reducing DB latency by 70%, led React 18 concurrent features rollout...)"
                    rows={3}
                    className="w-full rounded-xl bg-[#121624]/60 border border-white/[0.08] p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Question Count & Duration */}
          <div className="relative rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] p-5 sm:p-6 shadow-xl backdrop-blur-xl transition hover:border-white/[0.12]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>5. Session Duration & Questions</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                Choose limit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { count: 3, title: '3 Questions', desc: '~5 mins', tag: 'Fast Blitz' },
                { count: 5, title: '5 Questions', desc: '~12 mins', tag: 'Recommended' },
                { count: 10, title: '10 Questions', desc: '~25 mins', tag: 'Deep Dive' },
              ].map((opt) => {
                const isSelected = totalQuestions === opt.count;
                return (
                  <button
                    type="button"
                    key={opt.count}
                    onClick={() => setTotalQuestions(opt.count)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-950/70 to-slate-900/90 border-blue-500/70 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/40'
                        : 'bg-[#121624]/60 border-white/[0.06] text-slate-400 hover:bg-[#161c2e] hover:border-white/[0.14] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {opt.title}
                      </span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-blue-500/25 text-blue-300' : 'bg-white/[0.04] text-slate-500'
                      }`}>
                        {opt.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Launch Action Button */}
          <button
            type="submit"
            disabled={isStarting}
            className="group relative w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 active:scale-[0.99] shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/30 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-all" />

            {isStarting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="tracking-wide">Initializing Interview Chamber...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span className="tracking-wide text-base">Start Mock Interview</span>
                <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>

        {/* Right: Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#0e111a]/90 border border-white/[0.08] p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Session Blueprint</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Ready to Deploy
              </span>
            </div>

            {/* Spec Details Cards */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121624]/60 border border-white/[0.04]">
                <span className="text-slate-400 font-medium">Target Role</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {activeRoleObj.label}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121624]/60 border border-white/[0.04]">
                <span className="text-slate-400 font-medium">Seniority Calibration</span>
                <span className="font-bold text-indigo-400 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                  {seniority} Level
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121624]/60 border border-white/[0.04]">
                <span className="text-slate-400 font-medium">Question Protocol</span>
                <span className="font-bold text-slate-200">
                  {totalQuestions} Diagnostic Questions
                </span>
              </div>

              {(resumeText || jobDescription) && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <span className="text-purple-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Custom Resume/JD Mode Active
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Questions will cross-examine your submitted project claims & target JD skills.
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-[#121624]/60 border border-white/[0.04] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Stack Competency Focus</span>
                  <span className="text-[11px] text-slate-400 font-mono">{selectedTags.length} tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedTags.map((t) => (
                    <span key={t} className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluation Bar Raiser Highlights */}
            <div className="rounded-xl bg-gradient-to-br from-blue-950/30 to-indigo-950/20 border border-blue-500/20 p-4 space-y-2.5 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>AI Bar Raiser Criteria:</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Execution depth, internal runtime & accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-world edge cases & production trade-offs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Seniority-level articulation & clarity</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
