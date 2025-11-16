import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Download } from 'lucide-react';

interface BeforeAfterItem {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  enhancements: string[];
}

interface BeforeAfterGalleryProps {
  items: BeforeAfterItem[];
  className?: string;
}

export default function BeforeAfterGallery({ items, className = '' }: BeforeAfterGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  if (items.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500">
          <Maximize2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No comparisons yet</p>
          <p className="text-sm">Upload and enhance artwork to see before/after results</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : items.length - 1);
    setShowAfter(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev < items.length - 1 ? prev + 1 : 0);
    setShowAfter(false);
  };

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-700">
        <h3 className="text-lg font-semibold text-white">Before/After Gallery</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {currentIndex + 1} of {items.length}
          </span>
          <button
            onClick={goToPrevious}
            className="p-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Comparison */}
      <div className="relative aspect-video bg-gray-900">
        <div className="absolute inset-0 flex">
          {/* Before Image */}
          <div className={`transition-all duration-500 ${showAfter ? 'w-1/2' : 'w-full'}`}>
            <img
              src={currentItem.beforeImage}
              alt="Before"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Before
            </div>
          </div>

          {/* After Image */}
          {showAfter && (
            <div className="w-1/2 transition-all duration-500">
              <img
                src={currentItem.afterImage}
                alt="After"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                After
              </div>
            </div>
          )}
        </div>

        {/* Divider Line */}
        {showAfter && (
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white opacity-50 transform -translate-x-1/2"></div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowAfter(!showAfter)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          {showAfter ? 'Hide After' : 'Show After'}
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <h4 className="text-lg font-semibold text-white mb-2">{currentItem.title}</h4>
        
        {currentItem.enhancements.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Enhancements Applied:</p>
            <div className="flex flex-wrap gap-2">
              {currentItem.enhancements.map((enhancement, index) => (
                <span
                  key={index}
                  className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  {enhancement}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Tap "Show After" to see the AI enhancement
          </div>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}