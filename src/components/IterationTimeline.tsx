import React from 'react';
import { History, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { ProjectVersion } from '../types';

interface IterationTimelineProps {
  versions: ProjectVersion[];
  currentVersionId: string;
  onSelectVersion: (versionId: string) => void;
  className?: string;
}

export default function IterationTimeline({ 
  versions, 
  currentVersionId, 
  onSelectVersion, 
  className = '' 
}: IterationTimelineProps) {
  const currentIndex = versions.findIndex(v => v.id === currentVersionId);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onSelectVersion(versions[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < versions.length - 1) {
      onSelectVersion(versions[currentIndex + 1].id);
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Timeline</h3>
        </div>
        
        {versions.length > 1 && (
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex <= 0}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= versions.length - 1}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {versions.map((version, index) => (
          <button
            key={version.id}
            onClick={() => onSelectVersion(version.id)}
            className={`
              w-full text-left p-3 rounded-lg transition-all
              ${version.id === currentVersionId
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <img
                src={version.imageUrl}
                alt={version.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{version.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 opacity-70" />
                  <span className="text-xs opacity-70">
                    {version.createdAt.toLocaleString()}
                  </span>
                </div>
                {version.description && (
                  <p className="text-xs opacity-70 mt-1 truncate">
                    {version.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs font-mono bg-gray-600 px-2 py-1 rounded">
                  v{versions.length - index}
                </span>
                {version.enhancements.length > 0 && (
                  <span className="text-xs text-blue-400">
                    {version.enhancements.length} enhancements
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
        
        {versions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No versions yet</p>
            <p className="text-sm">Upload your first artwork to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}