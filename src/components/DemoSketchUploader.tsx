import React, { useState } from 'react';
import { Upload, Wand2, Sparkles } from 'lucide-react';

interface DemoSketchUploaderProps {
  onDemoUpload: (sketchType: 'messy' | 'anatomy' | 'perspective') => void;
  className?: string;
}

export default function DemoSketchUploader({ onDemoUpload, className = '' }: DemoSketchUploaderProps) {
  const [selectedDemo, setSelectedDemo] = useState<'messy' | 'anatomy' | 'perspective' | null>(null);

  const demoSketches = [
    {
      type: 'messy' as const,
      title: 'Messy Lines Demo',
      description: 'Rough sketch with uneven lines',
      preview: 'https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=300',
      issues: ['Rough lines', 'Inconsistent strokes', 'Needs cleanup']
    },
    {
      type: 'anatomy' as const,
      title: 'Anatomy Fix Demo',
      description: 'Character with proportion issues',
      preview: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300',
      issues: ['Uneven shoulders', 'Proportion issues', 'Perspective problems']
    },
    {
      type: 'perspective' as const,
      title: 'Perspective Demo',
      description: 'Scene with perspective challenges',
      preview: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300',
      issues: ['Vanishing points', 'Depth issues', 'Composition balance']
    }
  ];

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="bg-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Demo Mode</h3>
        <p className="text-gray-400">
          Choose a demo sketch to see ArtAssist in action
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {demoSketches.map((sketch) => (
          <button
            key={sketch.type}
            onClick={() => setSelectedDemo(sketch.type)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${selectedDemo === sketch.type
                ? 'border-purple-500 bg-purple-600 bg-opacity-20'
                : 'border-gray-600 hover:border-gray-500 bg-gray-700'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <img
                src={sketch.preview}
                alt={sketch.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{sketch.title}</h4>
                <p className="text-sm text-gray-400 mb-2">{sketch.description}</p>
                <div className="flex flex-wrap gap-1">
                  {sketch.issues.map((issue, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-600 bg-opacity-20 text-red-400 px-2 py-1 rounded text-xs"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedDemo && (
        <div className="text-center">
          <button
            onClick={() => onDemoUpload(selectedDemo)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            <Upload className="w-5 h-5" />
            <span>Load Demo Sketch</span>
          </button>
          <p className="text-sm text-gray-400 mt-2">
            This will simulate uploading a {selectedDemo} sketch
          </p>
        </div>
      )}
    </div>
  );
}