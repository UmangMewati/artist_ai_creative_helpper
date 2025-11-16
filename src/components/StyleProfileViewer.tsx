import React from 'react';
import { Brush, Eye, Settings } from 'lucide-react';
import { StyleProfile } from '../types';

interface StyleProfileViewerProps {
  profile?: StyleProfile;
  onCreateProfile: () => void;
  className?: string;
}

export default function StyleProfileViewer({ profile, onCreateProfile, className = '' }: StyleProfileViewerProps) {
  const getProfileAttribute = (attr: string, value: string) => {
    const badges: Record<string, Record<string, { color: string; label: string }>> = {
      lineWeight: {
        thin: { color: 'bg-blue-600', label: 'Thin Lines' },
        medium: { color: 'bg-green-600', label: 'Medium Lines' },
        thick: { color: 'bg-orange-600', label: 'Thick Lines' },
      },
      colorTone: {
        warm: { color: 'bg-red-600', label: 'Warm Tones' },
        cool: { color: 'bg-blue-600', label: 'Cool Tones' },
        neutral: { color: 'bg-gray-600', label: 'Neutral Tones' },
      },
      shadingStyle: {
        soft: { color: 'bg-purple-600', label: 'Soft Shading' },
        hard: { color: 'bg-yellow-600', label: 'Hard Shading' },
        mixed: { color: 'bg-pink-600', label: 'Mixed Shading' },
      },
      proportions: {
        realistic: { color: 'bg-green-600', label: 'Realistic' },
        stylized: { color: 'bg-purple-600', label: 'Stylized' },
        cartoon: { color: 'bg-orange-600', label: 'Cartoon' },
      },
    };

    return badges[attr]?.[value] || { color: 'bg-gray-600', label: value };
  };

  if (!profile) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 text-center ${className}`}>
        <div className="bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Brush className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Create Your Style Profile</h3>
        <p className="text-gray-400 mb-4">
          Upload 2-3 of your artworks to create a personalized style profile that will guide all AI enhancements.
        </p>
        <button
          onClick={onCreateProfile}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Style Profile
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Style Profile</h3>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Profile Name */}
        <div>
          <h4 className="font-semibold text-white mb-1">{profile.name}</h4>
          <p className="text-sm text-gray-400">
            Created {profile.createdAt.toLocaleDateString()}
          </p>
        </div>

        {/* Sample Images */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reference Artworks
          </label>
          <div className="grid grid-cols-3 gap-2">
            {profile.sampleImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Sample ${index + 1}`}
                className="w-full h-16 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Style Attributes */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Style Characteristics
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'lineWeight', label: 'Line Weight', value: profile.lineWeight },
              { key: 'colorTone', label: 'Color Tone', value: profile.colorTone },
              { key: 'shadingStyle', label: 'Shading', value: profile.shadingStyle },
              { key: 'proportions', label: 'Proportions', value: profile.proportions },
            ].map(({ key, label, value }) => {
              const badge = getProfileAttribute(key, value);
              return (
                <div key={key}>
                  <span className="text-xs text-gray-400 block mb-1">{label}</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-gray-700 rounded-lg p-3">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Profile Usage</h5>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Enhancements Applied:</span>
            <span className="text-white font-medium">0</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Projects Created:</span>
            <span className="text-white font-medium">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}