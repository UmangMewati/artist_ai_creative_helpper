import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspacePage from './pages/WorkspacePage';
import ColorsPage from './pages/ColorsPage';
import GuidesPage from './pages/GuidesPage';
import StylePage from './pages/StylePage';
import TimelinePage from './pages/TimelinePage';
import AssistantPage from './pages/AssistantPage';
import { Home, Palette, Grid, Eye, History, MessageCircle, LogOut, Menu, X } from 'lucide-react';

type Page = 'workspace' | 'colors' | 'guides' | 'style' | 'timeline' | 'assistant';

function MainApp() {
  const { user, signOut, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('workspace');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePageChange = (page: Page) => {
    setIsTransitioning(true);
    setMenuOpen(false);
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white mt-6 text-lg font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="transition-opacity duration-500">
        {authMode === 'login' ? (
          <LoginPage onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  const navItems = [
    { id: 'workspace' as Page, label: 'Workspace', icon: Home, color: 'blue' },
    { id: 'colors' as Page, label: 'Colors', icon: Palette, color: 'pink' },
    { id: 'guides' as Page, label: 'Guides', icon: Grid, color: 'emerald' },
    { id: 'style' as Page, label: 'Style', icon: Eye, color: 'orange' },
    { id: 'timeline' as Page, label: 'Timeline', icon: History, color: 'cyan' },
    { id: 'assistant' as Page, label: 'Assistant', icon: MessageCircle, color: 'violet' },
  ];

  const currentNav = navItems.find(item => item.id === currentPage);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`bg-gradient-to-br from-${currentNav?.color}-500 to-${currentNav?.color}-600 p-2 rounded-xl transition-all duration-500`}>
                {currentNav && <currentNav.icon className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h1 className="text-xl font-bold">ArtAssist</h1>
                <p className="text-sm text-gray-400">{currentNav?.label}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    currentPage === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={signOut}
                className="ml-2 px-4 py-2 rounded-xl font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-out ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden bg-gray-900/95 backdrop-blur-xl`}
        >
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                  currentPage === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={signOut}
              className="w-full px-4 py-3 rounded-xl font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center space-x-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`pt-24 min-h-screen transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {currentPage === 'workspace' && <WorkspacePage />}
        {currentPage === 'colors' && <ColorsPage />}
        {currentPage === 'guides' && <GuidesPage />}
        {currentPage === 'style' && <StylePage />}
        {currentPage === 'timeline' && <TimelinePage />}
        {currentPage === 'assistant' && <AssistantPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
