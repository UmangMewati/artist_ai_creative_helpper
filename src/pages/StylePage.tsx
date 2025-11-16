import React, { useState } from 'react';
import { Eye, Upload, Sparkles } from 'lucide-react';

export default function StylePage() {
  const [profiles] = useState([
    { name: 'Anime Style', lineWeight: 'Medium', colorTone: 'Vibrant', shading: 'Cel', proportions: 'Stylized' },
    { name: 'Realistic', lineWeight: 'Varied', colorTone: 'Natural', shading: 'Soft', proportions: 'Anatomical' },
    { name: 'Comic Book', lineWeight: 'Bold', colorTone: 'High Contrast', shading: 'Hard', proportions: 'Dynamic' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-900 to-yellow-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl mb-6 shadow-2xl shadow-orange-500/50 animate-float">
            <Eye className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
            Style Profiles
          </h1>
          <p className="text-xl text-orange-200/80 max-w-2xl mx-auto mb-8">
            Train AI on your unique art style
          </p>
          <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto">
            <Upload className="w-5 h-5" />
            <span>Create New Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-orange-300/20 hover:border-orange-300/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-orange-100 mb-4">{profile.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-orange-200/70">Line Weight</span>
                  <span className="font-medium text-orange-100">{profile.lineWeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200/70">Color Tone</span>
                  <span className="font-medium text-orange-100">{profile.colorTone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200/70">Shading</span>
                  <span className="font-medium text-orange-100">{profile.shading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200/70">Proportions</span>
                  <span className="font-medium text-orange-100">{profile.proportions}</span>
                </div>
              </div>
              <button className="w-full mt-6 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl font-medium text-orange-200 transition-all duration-300 flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Apply Style</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
