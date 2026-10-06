import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ChamberSetup } from './components/ChamberSetup';
import { InterviewChamber } from './components/InterviewChamber';
import { FeedbackModal } from './components/FeedbackModal';
import { ScorecardReport } from './components/ScorecardReport';
import { PastInterviewsPage } from './components/PastInterviewsPage';
import { AuthModal } from './components/AuthModal';
import { api } from './config/api';

export function App() {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aicoach_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Main Views: 'landing' | 'setup' | 'chamber' | 'scorecard' | 'history'
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('aicoach_user');
    return saved ? 'setup' : 'landing';
  });

  const [session, setSession] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle Auth Success
  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('aicoach_user', JSON.stringify(user));
      localStorage.setItem('aicoach_token', token);
    } catch (e) {}
    setView('setup');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('aicoach_user');
      localStorage.removeItem('aicoach_token');
    } catch (e) {}
    setSession(null);
    setView('landing');
  };

  // Open Auth Modal
  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  // Start new interview
  const handleStartInterview = async (config) => {
    setIsStarting(true);
    setErrorMessage(null);
    try {
      const payload = {
        ...config,
        userId: currentUser ? currentUser._id : 'guest',
      };
      const newSession = await api.startInterview(payload);
      setSession(newSession);
      setView('chamber');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to initialize session');
    } finally {
      setIsStarting(false);
    }
  };

  // Submit answer for current question
  const handleSubmitAnswer = async (payload) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await api.submitAnswer(payload);
      setSession(result.session);
      setIsLastQuestion(result.isLastQuestion);
      // If there is no followUpProbe, immediately show feedback modal
      if (!result.feedback?.followUpProbe) {
        setCurrentFeedback(result.feedback);
      }
      return result;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit answer');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit probe answer
  const handleSubmitProbe = async ({ sessionId, questionIndex, probeAnswer, pendingFeedback, isLastQuestion: lastQ, skip }) => {
    setErrorMessage(null);
    try {
      if (skip || !probeAnswer) {
        setCurrentFeedback(pendingFeedback);
        setIsLastQuestion(lastQ);
      } else {
        const result = await api.submitProbeAnswer({ sessionId, questionIndex, probeAnswer });
        if (result?.session) setSession(result.session);
        setCurrentFeedback(result?.feedback || pendingFeedback);
        setIsLastQuestion(lastQ);
      }
    } catch (err) {
      console.warn('Probe answer error fallback:', err);
      setCurrentFeedback(pendingFeedback);
      setIsLastQuestion(lastQ);
    }
  };

  // Finish early handler
  const handleFinishEarly = async () => {
    if (!session) return;
    setIsFinishing(true);
    try {
      const completedSession = await api.finishInterview({ sessionId: session.sessionId });
      setSession(completedSession);
      setCurrentFeedback(null);
      setView('scorecard');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to finalize scorecard');
    } finally {
      setIsFinishing(false);
    }
  };

  // Move to next question or finalize
  const handleNextOrFinish = async () => {
    if (isLastQuestion) {
      handleFinishEarly();
    } else {
      setCurrentFeedback(null);
    }
  };

  // Reset / Return to setup or landing
  const handleReset = () => {
    setSession(null);
    setCurrentFeedback(null);
    setErrorMessage(null);
    setView(currentUser ? 'setup' : 'landing');
  };

  // Track previous view for seamless back navigation
  const [previousView, setPreviousView] = useState('setup');

  // Load past session from history page
  const handleSelectHistorySession = (selectedSession) => {
    setPreviousView('history');
    setSession(selectedSession);
    setView('scorecard');
  };

  // Back from scorecard
  const handleBackFromScorecard = () => {
    if (previousView === 'history') {
      setView('history');
    } else {
      setView(currentUser ? 'setup' : 'landing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Floating Pill Navbar */}
      <Header
        currentUser={currentUser}
        activeSession={session && view !== 'setup' && view !== 'landing' && view !== 'history'}
        currentView={view}
        onReset={handleReset}
        onNavigateHistory={() => {
          setPreviousView(view);
          setView('history');
        }}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-3.5 rounded-lg bg-rose-500/[0.08] border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="font-semibold underline ml-4">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main App Views */}
      <main className="flex-1">
        {view === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onContinueGuest={() => setView('setup')}
          />
        )}

        {view === 'setup' && (
          <ChamberSetup
            onStart={handleStartInterview}
            isStarting={isStarting}
          />
        )}

        {view === 'chamber' && session && (
          <InterviewChamber
            session={session}
            onSubmitAnswer={handleSubmitAnswer}
            onSubmitProbe={handleSubmitProbe}
            onFinishEarly={handleFinishEarly}
            isSubmitting={isSubmitting}
            isFinishing={isFinishing}
          />
        )}

        {view === 'scorecard' && session && (
          <ScorecardReport
            session={session}
            onRestart={() => setView('setup')}
            onBack={handleBackFromScorecard}
            backLabel={previousView === 'history' ? 'Back to Past Interviews' : 'Back to Dashboard'}
          />
        )}

        {view === 'history' && (
          <PastInterviewsPage
            currentUser={currentUser}
            onSelectSession={handleSelectHistorySession}
            onStartNew={() => setView('setup')}
            onBack={() => setView(currentUser ? 'setup' : 'landing')}
          />
        )}
      </main>

      {/* Step Micro-Feedback Modal */}
      {currentFeedback && (
        <FeedbackModal
          feedback={currentFeedback}
          isLastQuestion={isLastQuestion}
          onNext={handleNextOrFinish}
          isFinishing={isFinishing}
        />
      )}

      {/* Authentication Modal (Login / Register with OTP) */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authTab}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500">
        <p>AiCoach • AI Technical Mock Interview Coach • Built for Hackathons & Hiring Prep</p>
      </footer>

    </div>
  );
}

export default App;
