import React, { useState } from 'react';
import { Palette, Sparkles, Copy, Check, Wand2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ColorPalette {
  name: string;
  colors: string[];
  mood: string;
}

export default function ColorsPage() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([
    {
      name: 'Sunset Dreams',
      colors: ['#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', '#A8E6CF'],
      mood: 'Warm and romantic'
    },
    {
      name: 'Ocean Breeze',
      colors: ['#4ECDC4', '#1A535C', '#FFE66D', '#FF6B6B', '#95E1D3'],
      mood: 'Fresh and calming'
    },
    {
      name: 'Purple Haze',
      colors: ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'],
      mood: 'Dreamy and soft'
    }
  ]);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGeneratePalette = async () => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-palette`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: 'random' }),
      });

      if (response.ok) {
        const newPalettes = await response.json();
        setPalettes(prev => [...newPalettes, ...prev].slice(0, 6));
      }
    } catch (error) {
      console.error('Error generating palette:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyColor = (color: string, paletteIndex: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(paletteIndex);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-rose-900 to-fuchsia-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl mb-6 shadow-2xl shadow-pink-500/50 animate-float">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-200 via-rose-200 to-fuchsia-200 bg-clip-text text-transparent">
            Color Palettes
          </h1>
          <p className="text-xl text-pink-200/80 max-w-2xl mx-auto mb-8">
            Discover beautiful color combinations powered by AI
          </p>
          <button
            onClick={handleGeneratePalette}
            disabled={generating}
            className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              {generating ? <Sparkles className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              <span>{generating ? 'Creating Magic...' : 'Generate New Palettes'}</span>
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {palettes.map((palette, paletteIndex) => (
            <div
              key={paletteIndex}
              className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-pink-300/20 hover:border-pink-300/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-pink-100">{palette.name}</h3>
                {copiedIndex === paletteIndex && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </div>
                )}
              </div>
              <p className="text-pink-200/70 mb-6 text-sm">{palette.mood}</p>

              <div className="space-y-3">
                {palette.colors.map((color, colorIndex) => (
                  <button
                    key={colorIndex}
                    onClick={() => copyColor(color, paletteIndex)}
                    className="w-full group/color"
                  >
                    <div className="flex items-center p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                      <div
                        className="w-16 h-16 rounded-xl shadow-lg transition-transform duration-300 group-hover/color:scale-110"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 ml-4 text-left">
                        <div className="font-mono font-bold text-white">{color}</div>
                        <div className="text-sm text-pink-200/60">Click to copy</div>
                      </div>
                      <Copy className="w-5 h-5 text-pink-300/50" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
