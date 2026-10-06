const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://aicoach-backend-project.onrender.com';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export const api = {
  /**
   * Start new mock interview session (with optional Resume & JD tailoring)
   */
  async startInterview({ role, seniority, techStack, totalQuestions, userId, resumeText, jobDescription }) {
    const res = await fetch(`${API_BASE_URL}/api/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, seniority, techStack, totalQuestions, userId, resumeText, jobDescription }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start interview');
    return data.data;
  },

  /**
   * Submit an answer for evaluation
   */
  async submitAnswer({ sessionId, questionIndex, userAnswer, answerType, timeSpentSeconds }) {
    const res = await fetch(`${API_BASE_URL}/api/interview/submit-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionIndex, userAnswer, answerType, timeSpentSeconds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit answer');
    return data.data;
  },

  /**
   * Submit candidate counter-defense for live follow-up probe
   */
  async submitProbeAnswer({ sessionId, questionIndex, probeAnswer }) {
    const res = await fetch(`${API_BASE_URL}/api/interview/submit-probe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionIndex, probeAnswer }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit probe response');
    return data.data;
  },

  /**
   * Finalize interview and generate final scorecard
   */
  async finishInterview({ sessionId }) {
    const res = await fetch(`${API_BASE_URL}/api/interview/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate final report');
    return data.data;
  },

  /**
   * Get specific session details
   */
  async getSession(sessionId) {
    const res = await fetch(`${API_BASE_URL}/api/interview/${sessionId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load session');
    return data.data;
  },

  /**
   * List past interview history (filtered by userId if registered)
   */
  async getHistory(limit = 10, userId = null) {
    const url = userId 
      ? `${API_BASE_URL}/api/interview/history/list?limit=${limit}&userId=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/api/interview/history/list?limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load history');
    return data.data;
  },

  /**
   * Auth: Step 1 Send Registration OTP
   */
  async requestOtp({ name, email, password }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return data.data;
  },

  /**
   * Auth: Resend OTP
   */
  async resendOtp({ email, name, password }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to resend OTP');
    return data.data;
  },

  /**
   * Auth: Step 2 Verify OTP & Register
   */
  async verifyOtp({ email, otp }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid OTP');
    return data.data;
  },

  /**
   * Auth: Login with Email & Password
   */
  async login({ email, password }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data.data;
  },
};

