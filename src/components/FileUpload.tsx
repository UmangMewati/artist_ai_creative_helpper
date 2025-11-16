import React, { useCallback, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export default function FileUpload({ 
  onFileUpload, 
  accept = 'image/*', 
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.size <= maxSize) {
      handleFileSelect(file);
    }
  }, [maxSize]);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize) {
      alert('File size too large');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    onFileUpload(file);
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-75 text-white rounded-full hover:bg-opacity-90 transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${isDragging 
              ? 'border-purple-400 bg-purple-50 bg-opacity-10' 
              : 'border-gray-600 hover:border-gray-500'
            }
          `}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-purple-100 bg-opacity-20' : 'bg-gray-700'}`}>
              {isDragging ? (
                <Image className="w-8 h-8 text-purple-400" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-300 mb-1">
                {isDragging ? 'Drop your image here' : 'Upload your artwork'}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to select
              </p>
            </div>

            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}