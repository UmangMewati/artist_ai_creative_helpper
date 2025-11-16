import React, { useState } from 'react';
import { Maximize2, Download, Wand2, RotateCcw } from 'lucide-react';
import FileUpload from './FileUpload';
import { ProjectVersion, CompositionGuide } from '../types';

interface MainCanvasProps {
  currentVersion?: ProjectVersion;
  compositionGuides: CompositionGuide[];
  onFileUpload: (file: File) => void;
  onEnhanceSketch: () => void;
  className?: string;
}

export default function MainCanvas({ 
  currentVersion, 
  compositionGuides, 
  onFileUpload, 
  onEnhanceSketch, 
  className = '' 
}: MainCanvasProps) {
  const [showGuides, setShowGuides] = useState(true);

  const downloadImage = () => {
    if (currentVersion) {
      const link = document.createElement('a');
      link.href = currentVersion.imageUrl;
      link.download = `${currentVersion.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderCompositionOverlays = () => {
    if (!showGuides) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {compositionGuides.map(guide => {
          if (!guide.enabled) return null;

          const style = { opacity: guide.opacity };

          switch (guide.type) {
            case 'rule-of-thirds':
              return (
                <div key={guide.type} className="absolute inset-0" style={style}>
                  {/* Vertical lines */}
                  <div className="absolute left-1/3 top-0 w-px h-full bg-blue-400"></div>
                  <div className="absolute left-2/3 top-0 w-px h-full bg-blue-400"></div>
                  {/* Horizontal lines */}
                  <div className="absolute top-1/3 left-0 h-px w-full bg-blue-400"></div>
                  <div className="absolute top-2/3 left-0 h-px w-full bg-blue-400"></div>
                </div>
              );
            
            case 'golden-ratio':
              return (
                <div key={guide.type} className="absolute inset-0" style={style}>
                  <svg className="w-full h-full">
                    <path
                      d="M 0,0 Q 100,100 200,0"
                      stroke="rgb(251, 191, 36)"
                      strokeWidth="1"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              );
            
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Canvas Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">
          {currentVersion ? currentVersion.title : 'Canvas'}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`p-2 rounded-lg transition-colors ${
              showGuides ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Toggle composition guides"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          {currentVersion && (
            <>
              <button
                onClick={onEnhanceSketch}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                <span>Enhance</span>
              </button>
              
              <button
                onClick={downloadImage}
                className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
        {currentVersion ? (
          <>
            <img
              src={currentVersion.imageUrl}
              alt={currentVersion.title}
              className="max-w-full max-h-full object-contain"
            />
            {renderCompositionOverlays()}
          </>
        ) : (
          <div className="p-8 max-w-md">
            <FileUpload
              onFileUpload={onFileUpload}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Canvas Footer */}
      {currentVersion && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              {currentVersion.description || 'No description'}
            </div>
            <div className="text-gray-500">
              {currentVersion.createdAt.toLocaleString()}
            </div>
          </div>
          
          {currentVersion.enhancements.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {currentVersion.enhancements.map((enhancement, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                >
                  <span>{enhancement.type.replace('-', ' ')}</span>
                  {enhancement.applied && <span>✓</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}