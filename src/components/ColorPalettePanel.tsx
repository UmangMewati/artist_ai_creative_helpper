import React, { useState } from 'react';
import { Palette, Copy, Download, Sparkles } from 'lucide-react';
import { ColorPalette } from '../types';
import { generateColorPalette, hexToRgb } from '../utils/colorPalettes';

interface ColorPalettePanelProps {
  palettes: ColorPalette[];
  onGeneratePalette: (palette: ColorPalette) => void;
  className?: string;
}

export default function ColorPalettePanel({ palettes, onGeneratePalette, className = '' }: ColorPalettePanelProps) {
  const [selectedMood, setSelectedMood] = useState<ColorPalette['mood']>('warm');

  const moods: { value: ColorPalette['mood']; label: string; icon: string }[] = [
    { value: 'warm', label: 'Warm', icon: '🔥' },
    { value: 'cool', label: 'Cool', icon: '❄️' },
    { value: 'dramatic', label: 'Dramatic', icon: '🌟' },
    { value: 'sunset', label: 'Sunset', icon: '🌅' },
    { value: 'night', label: 'Night', icon: '🌙' },
    { value: 'natural', label: 'Natural', icon: '🌿' },
  ];

  const generateNewPalette = () => {
    const colors = generateColorPalette(selectedMood);
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Palette`,
      colors,
      mood: selectedMood,
      createdAt: new Date(),
    };
    onGeneratePalette(newPalette);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  const exportPalette = (palette: ColorPalette) => {
    const data = JSON.stringify(palette, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Palette className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Color Palettes</h3>
      </div>

      {/* Mood Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Mood
        </label>
        <div className="grid grid-cols-2 gap-2">
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`
                p-2 rounded-lg text-sm font-medium transition-all
                ${selectedMood === mood.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <span className="mr-2">{mood.icon}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateNewPalette}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium mb-4 transition-colors flex items-center justify-center space-x-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Generate Palette</span>
      </button>

      {/* Saved Palettes */}
      <div className="space-y-3">
        {palettes.map(palette => (
          <div key={palette.id} className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">{palette.name}</h4>
              <button
                onClick={() => exportPalette(palette)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex space-x-1 mb-2">
              {palette.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => copyColor(color)}
                  className="group relative flex-1 h-8 rounded transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  title={`${color} - Click to copy`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-3 h-3 text-white drop-shadow-lg" />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {palette.colors.map((color, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-400 font-mono cursor-pointer hover:text-white transition-colors"
                  onClick={() => copyColor(color)}
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {palettes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No palettes yet</p>
            <p className="text-sm">Generate your first palette above</p>
          </div>
        )}
      </div>
    </div>
  );
}