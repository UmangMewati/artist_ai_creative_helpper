import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, RotateCcw, Maximize2, ArrowLeftRight } from 'lucide-react';

interface SketchCanvasProps {
  imageUrl: string;
  beforeImageUrl?: string;
  showComparison?: boolean;
  overlays?: React.ReactNode;
}

export default function SketchCanvas({ imageUrl, beforeImageUrl, showComparison, overlays }: SketchCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [comparisonSlider, setComparisonSlider] = useState(50);
  const [isComparing, setIsComparing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
      <div
        ref={canvasRef}
        className="relative w-full h-full overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {isComparing && beforeImageUrl ? (
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={beforeImageUrl}
                  alt="Before"
                  className="max-w-full max-h-[70vh] object-contain"
                  draggable={false}
                />
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden"
                  style={{ width: `${comparisonSlider}%` }}
                >
                  <img
                    src={imageUrl}
                    alt="After"
                    className="max-w-full max-h-[70vh] object-contain"
                    draggable={false}
                  />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${comparisonSlider}%` }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    const handleSliderMove = (moveEvent: MouseEvent) => {
                      if (canvasRef.current) {
                        const rect = canvasRef.current.getBoundingClientRect();
                        const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                        setComparisonSlider(Math.max(0, Math.min(100, x)));
                      }
                    };
                    const handleSliderUp = () => {
                      document.removeEventListener('mousemove', handleSliderMove);
                      document.removeEventListener('mouseup', handleSliderUp);
                    };
                    document.addEventListener('mousemove', handleSliderMove);
                    document.addEventListener('mouseup', handleSliderUp);
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                    <ArrowLeftRight className="w-4 h-4 text-gray-900" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-medium">
                  Before
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-medium">
                  After
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Sketch"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                draggable={false}
              />
              {overlays && (
                <div className="absolute inset-0 pointer-events-none">
                  {overlays}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-gray-800/90 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-gray-700">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>

        <div className="px-4 py-2 bg-gray-700 rounded-xl">
          <span className="text-white font-medium">{Math.round(zoom * 100)}%</span>
        </div>

        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>

        <div className="w-px h-8 bg-gray-600"></div>

        <button
          onClick={handleReset}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>

        {beforeImageUrl && (
          <>
            <div className="w-px h-8 bg-gray-600"></div>
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`p-2 rounded-xl transition-colors ${
                isComparing
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Compare Before/After"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      <div className="absolute top-6 right-6 bg-gray-800/90 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-gray-700">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Move className="w-4 h-4" />
          <span>Drag to pan • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
