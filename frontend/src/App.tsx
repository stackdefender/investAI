import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { FloatingChatbot } from './components/FloatingChatbot';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { OnboardingQuestionnaire } from './pages/OnboardingQuestionnaire';
import { Dashboard } from './pages/Dashboard';
import { AIPersonalPlanner } from './pages/AIPersonalPlanner';
import { StockExplorer } from './pages/StockExplorer';
import { StockDetail } from './pages/StockDetail';
import { MutualFundExplorer } from './pages/MutualFundExplorer';
import { CompareFunds } from './pages/CompareFunds';
import { WorldNews } from './pages/WorldNews';
import { PortfolioTracker } from './pages/PortfolioTracker';
import { GoalPlanner } from './pages/GoalPlanner';
import { RetirementPlanner } from './pages/RetirementPlanner';
import { Calculators } from './pages/Calculators';
import { Watchlist } from './pages/Watchlist';
import { Profile } from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/onboarding'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  if (isAuthPage) {
    return <main className="min-h-screen bg-[#0B0F17]">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <Navbar />
      <div className="flex-1 flex">
        {!isLandingPage && <Sidebar />}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Footer />
      <FloatingChatbot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingQuestionnaire />
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/ai-planner" element={
                <ProtectedRoute>
                  <AIPersonalPlanner />
                </ProtectedRoute>
              } />

              <Route path="/stocks" element={<StockExplorer />} />
              <Route path="/stocks/:symbol" element={<StockDetail />} />
              <Route path="/mutual-funds" element={<MutualFundExplorer />} />
              <Route path="/mutual-funds/compare" element={<CompareFunds />} />
              <Route path="/news" element={<WorldNews />} />
              
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <PortfolioTracker />
                </ProtectedRoute>
              } />

              <Route path="/goals" element={
                <ProtectedRoute>
                  <GoalPlanner />
                </ProtectedRoute>
              } />

              <Route path="/retirement" element={<RetirementPlanner />} />
              <Route path="/calculators" element={<Calculators />} />

              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
