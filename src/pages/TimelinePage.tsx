import React, { useState } from 'react';
import { History, Clock, Check } from 'lucide-react';

export default function TimelinePage() {
  const [versions] = useState([
    { id: 1, title: 'Initial Sketch', time: '2 hours ago', changes: 'Created base drawing' },
    { id: 2, title: 'Line Refinement', time: '1 hour ago', changes: 'Improved line weight and cleaned edges' },
    { id: 3, title: 'Color Base', time: '45 min ago', changes: 'Applied base colors and shadows' },
    { id: 4, title: 'AI Enhancement', time: '30 min ago', changes: 'Fixed anatomy and perspective' },
    { id: 5, title: 'Final Touches', time: '15 min ago', changes: 'Added highlights and details' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-blue-900 to-teal-950">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl mb-6 shadow-2xl shadow-cyan-500/50 animate-spin-slow">
            <History className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">
            Project Timeline
          </h1>
          <p className="text-xl text-cyan-200/80 max-w-2xl mx-auto">
            Track your artistic journey version by version
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-teal-500"></div>

          <div className="space-y-8">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="relative pl-20 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute left-5 top-6 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full border-4 border-cyan-950 flex items-center justify-center shadow-xl shadow-cyan-500/50">
                  {index === versions.length - 1 ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>

                <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-cyan-300/20 hover:border-cyan-300/40 transition-all duration-500 hover:scale-102 hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-cyan-100">{version.title}</h3>
                    <div className="flex items-center space-x-2 text-cyan-300/70">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{version.time}</span>
                    </div>
                  </div>
                  <p className="text-cyan-200/70">{version.changes}</p>
                  <div className="mt-4 flex space-x-3">
                    <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl text-sm font-medium text-cyan-200 transition-colors duration-200">
                      View Version
                    </button>
                    <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl text-sm font-medium text-cyan-200 transition-colors duration-200">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
