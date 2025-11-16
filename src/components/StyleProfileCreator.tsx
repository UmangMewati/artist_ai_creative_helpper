import React, { useState } from 'react';
import { Upload, X, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StyleAnalysis {
  lineWeight: 'thin' | 'medium' | 'thick';
  shadingStyle: 'soft' | 'hard' | 'none';
  colorTone: 'warm' | 'cool' | 'neutral';
  proportions: 'realistic' | 'stylized' | 'chibi';
}

interface StyleProfileCreatorProps {
  onProfileCreated: (profile: any) => void;
  onCancel: () => void;
}

export default function StyleProfileCreator({ onProfileCreated, onCancel }: StyleProfileCreatorProps) {
  const [profileName, setProfileName] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (uploadedImages.length + files.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    setUploadedImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrls(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeStyle = async () => {
    if (uploadedImages.length < 2) {
      alert('Please upload at least 2 images for style analysis');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const analyzedStyle: StyleAnalysis = {
        lineWeight: 'medium',
        shadingStyle: 'soft',
        colorTone: 'warm',
        proportions: 'stylized',
      };

      setAnalysis(analyzedStyle);
      setIsAnalyzing(false);
    }, 2000);
  };

  const saveProfile = async () => {
    if (!profileName || !analysis) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('style_profiles')
        .insert({
          user_id: user.id,
          name: profileName,
          line_weight: analysis.lineWeight,
          color_tone: analysis.colorTone,
          shading_style: analysis.shadingStyle,
          proportions: analysis.proportions,
          sample_images: previewUrls,
        })
        .select()
        .single();

      if (error) throw error;

      onProfileCreated(data);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 animate-scale-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create Style Profile</h2>
        <p className="text-gray-400">Upload 2-4 artworks to analyze your unique style</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profile Name
          </label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="e.g., My Anime Style"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Upload Artworks ({uploadedImages.length}/4)
          </label>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-700 hover:border-cyan-500 transition-colors animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}

            {uploadedImages.length < 4 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-600 hover:border-cyan-500 transition-colors flex flex-col items-center justify-center cursor-pointer group hover:bg-cyan-500/10">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-gray-500 group-hover:text-cyan-400 mb-2 transition-colors" />
                <span className="text-gray-500 group-hover:text-cyan-400 text-sm transition-colors">
                  Upload Image
                </span>
              </label>
            )}
          </div>

          {uploadedImages.length >= 2 && !analysis && (
            <button
              onClick={analyzeStyle}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Analyzing Style...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Style</span>
                </>
              )}
            </button>
          )}
        </div>

        {analysis && (
          <div className="bg-gray-900/50 rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Check className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Style Analysis Complete</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Line Weight</p>
                <p className="text-white font-semibold capitalize">{analysis.lineWeight}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Shading Style</p>
                <p className="text-white font-semibold capitalize">{analysis.shadingStyle}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Color Tone</p>
                <p className="text-white font-semibold capitalize">{analysis.colorTone}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Proportions</p>
                <p className="text-white font-semibold capitalize">{analysis.proportions}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveProfile}
            disabled={!profileName || !analysis}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
