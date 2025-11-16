import React, { useState } from 'react';
import { Grid, Layout, Box, Layers, Check } from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export default function GuidesPage() {
  const [activeGuides, setActiveGuides] = useState<string[]>([]);

  const guides: Guide[] = [
    { id: 'thirds', name: 'Rule of Thirds', description: 'Divide canvas into 9 equal parts for balanced composition', icon: Grid },
    { id: 'golden', name: 'Golden Ratio', description: 'Natural proportion for aesthetically pleasing layouts', icon: Layout },
    { id: 'symmetry', name: 'Symmetry Guide', description: 'Perfect symmetrical alignment for balanced designs', icon: Box },
    { id: 'depth', name: 'Depth Layers', description: 'Create visual depth with foreground, middle, background', icon: Layers },
  ];

  const toggleGuide = (id: string) => {
    setActiveGuides(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/50 animate-pulse-slow">
            <Grid className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 bg-clip-text text-transparent">
            Composition Guides
          </h1>
          <p className="text-xl text-emerald-200/80 max-w-2xl mx-auto mb-8">
            Professional composition tools to perfect your artwork layout
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {guides.map((guide, index) => {
            const isActive = activeGuides.includes(guide.id);
            return (
              <button
                key={guide.id}
                onClick={() => toggleGuide(guide.id)}
                className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
                  isActive
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30'
                    : 'bg-white/10 border-2 border-emerald-300/20 hover:border-emerald-300/40'
                } backdrop-blur-xl`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl transition-all duration-300 ${
                      isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-emerald-500/20'
                    }`}>
                      <guide.icon className={`w-8 h-8 transition-colors ${
                        isActive ? 'text-white' : 'text-emerald-300'
                      }`} />
                    </div>
                    {isActive && (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500 rounded-full animate-fade-in">
                        <Check className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white">Active</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-100 mb-2">{guide.name}</h3>
                  <p className="text-emerald-200/70">{guide.description}</p>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </button>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-emerald-300/20">
          <h2 className="text-3xl font-bold text-emerald-100 mb-6">Live Preview</h2>
          <div className="aspect-video bg-gray-900/50 rounded-2xl relative overflow-hidden">
            {activeGuides.includes('thirds') && (
              <div className="absolute inset-0">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-emerald-400/40"></div>
                  ))}
                </div>
              </div>
            )}
            {activeGuides.includes('symmetry') && (
              <div className="absolute inset-0">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-400/40"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/40"></div>
              </div>
            )}
            {activeGuides.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-emerald-300/50 text-lg">Select guides to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
