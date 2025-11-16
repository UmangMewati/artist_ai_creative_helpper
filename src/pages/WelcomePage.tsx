import React from 'react';
import { Brush, ArrowRight } from 'lucide-react';

interface WelcomePageProps {
  onComplete: () => void;
}

export default function WelcomePage({ onComplete }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl inline-block mb-6">
          <Brush className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to ArtAssist</h1>
        <p className="text-xl text-gray-300 mb-8">Your AI-powered creative companion</p>
        <button
          onClick={onComplete}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors inline-flex items-center space-x-2"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
