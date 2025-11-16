import React from 'react';
import { Grid2x2 as Grid, Zap, Eye, Layers } from 'lucide-react';
import { CompositionGuide } from '../types';

interface CompositionHelperProps {
  guides: CompositionGuide[];
  onToggleGuide: (type: CompositionGuide['type']) => void;
  onOpacityChange: (type: CompositionGuide['type'], opacity: number) => void;
  className?: string;
}

export default function CompositionHelper({ 
  guides, 
  onToggleGuide, 
  onOpacityChange, 
  className = '' 
}: CompositionHelperProps) {
  const guideTypes: { 
    type: CompositionGuide['type']; 
    label: string; 
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[] = [
    { 
      type: 'rule-of-thirds', 
      label: 'Rule of Thirds', 
      icon: Grid,
      description: 'Classic composition grid'
    },
    { 
      type: 'golden-ratio', 
      label: 'Golden Ratio', 
      icon: Zap,
      description: 'Natural spiral guide'
    },
    { 
      type: 'dynamic-arc', 
      label: 'Dynamic Arc', 
      icon: Eye,
      description: 'Movement and flow lines'
    },
    { 
      type: 'depth-guide', 
      label: 'Depth Guide', 
      icon: Layers,
      description: 'Foreground/background layers'
    },
  ];

  const getGuide = (type: CompositionGuide['type']) => {
    return guides.find(g => g.type === type) || { type, enabled: false, opacity: 0.5 };
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Grid className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Composition Guides</h3>
      </div>

      <div className="space-y-4">
        {guideTypes.map(({ type, label, icon: Icon, description }) => {
          const guide = getGuide(type);
          
          return (
            <div key={type} className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <div>
                    <h4 className="text-sm font-medium text-white">{label}</h4>
                    <p className="text-xs text-gray-400">{description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => onToggleGuide(type)}
                  className={`
                    relative w-10 h-6 rounded-full transition-colors
                    ${guide.enabled ? 'bg-blue-600' : 'bg-gray-600'}
                  `}
                >
                  <div className={`
                    absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                    ${guide.enabled ? 'left-5' : 'left-1'}
                  `} />
                </button>
              </div>
              
              {guide.enabled && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">
                    Opacity: {Math.round(guide.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={guide.opacity}
                    onChange={(e) => onOpacityChange(type, parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 <strong className="text-gray-300">Tip:</strong> Use composition guides to improve the visual balance and flow of your artwork. Enable multiple guides to experiment with different approaches.
        </p>
      </div>
    </div>
  );
}