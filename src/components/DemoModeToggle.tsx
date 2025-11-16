import React from 'react';
import { Play, Pause } from 'lucide-react';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: () => void;
  className?: string;
}

export default function DemoModeToggle({ isDemoMode, onToggle, className = '' }: DemoModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
        ${isDemoMode 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }
        ${className}
      `}
    >
      {isDemoMode ? (
        <>
          <Pause className="w-4 h-4" />
          <span>Demo Mode ON</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span>Demo Mode</span>
        </>
      )}
    </button>
  );
}