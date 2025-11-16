import React, { useState, useRef } from 'react';
import { Upload, Wand2, Palette, Grid, MessageCircle, Image as ImageIcon, Loader2, AlertCircle, Send } from 'lucide-react';
import SketchCanvas from '../components/SketchCanvas';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';

interface Enhancement {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  tips?: string[];
}

interface CompositionOverlay {
  type: 'rule-of-thirds' | 'golden-ratio' | 'leading-lines' | 'depth-layers';
  enabled: boolean;
}

export default function WorkspacePage() {
  const { showToast, ToastContainer } = useToast();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! Upload your sketch to get started. I can help you enhance it, generate color palettes, provide composition feedback, and answer any questions about your artwork.',
      suggestions: ['Upload sketch', 'Generate color palette', 'Show composition guides'],
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [overlays, setOverlays] = useState<CompositionOverlay[]>([
    { type: 'rule-of-thirds', enabled: false },
    { type: 'golden-ratio', enabled: false },
    { type: 'leading-lines', enabled: false },
    { type: 'depth-layers', enabled: false },
  ]);
  const [palettes, setPalettes] = useState<any[]>([]);
  const [isGeneratingPalettes, setIsGeneratingPalettes] = useState(false);
  const [activeTab, setActiveTab] = useState<'enhancements' | 'palettes' | 'overlays' | 'chat'>('chat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setCurrentImage(imageUrl);
      setOriginalImage(imageUrl);
      setEnhancements([]);
      showToast('success', 'Sketch uploaded successfully!');

      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Great! I can see your sketch. Would you like me to enhance it, or would you prefer to start with color palette suggestions?',
        suggestions: ['Enhance sketch', 'Generate color palettes', 'Show composition guides'],
      };
      setChatMessages(prev => [...prev, welcomeMessage]);
    };
    reader.readAsDataURL(file);
  };

  const handleEnhanceSketch = async () => {
    if (!currentImage) return;

    setIsEnhancing(true);
    setActiveTab('enhancements');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enhance-sketch`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: currentImage }),
      });

      if (!response.ok) throw new Error('Enhancement failed');

      const result = await response.json();
      setEnhancements(result.fixes);
      showToast('success', 'Sketch analyzed successfully!');

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `I've analyzed your sketch! ${result.recommendations.join(' ')} Check the Enhancements tab for detailed fixes.`,
        tips: ['Remember to save your work regularly', 'Try different angles for dynamic poses'],
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Enhancement error:', error);
      showToast('error', 'Failed to enhance sketch. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGeneratePalettes = async () => {
    setIsGeneratingPalettes(true);
    setActiveTab('palettes');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-palette`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: currentImage }),
      });

      if (!response.ok) throw new Error('Palette generation failed');

      const result = await response.json();
      setPalettes(result.themes);

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `I've generated ${result.themes.length} color palette themes for you! Check the Palettes tab to explore different moods and lighting suggestions.`,
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Palette generation error:', error);
      alert('Failed to generate palettes. Please try again.');
    } finally {
      setIsGeneratingPalettes(false);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const textToSend = message || chatInput.trim();
    if (!textToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend, imageUrl: currentImage }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const result = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.message,
        suggestions: result.suggestions,
        tips: result.tips,
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const toggleOverlay = (type: CompositionOverlay['type']) => {
    setOverlays(prev => prev.map(o => o.type === type ? { ...o, enabled: !o.enabled } : o));
    setActiveTab('overlays');
  };

  const renderOverlays = () => {
    return overlays.filter(o => o.enabled).map(overlay => (
      <div key={overlay.type} className="absolute inset-0 pointer-events-none">
        {overlay.type === 'rule-of-thirds' && (
          <svg className="w-full h-full" style={{ opacity: 0.6 }}>
            <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="#00ffff" strokeWidth="2" />
            <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="#00ffff" strokeWidth="2" />
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="#00ffff" strokeWidth="2" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="#00ffff" strokeWidth="2" />
          </svg>
        )}
        {overlay.type === 'golden-ratio' && (
          <svg className="w-full h-full" style={{ opacity: 0.6 }}>
            <circle cx="50%" cy="50%" r="30%" stroke="#ffd700" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="20%" stroke="#ffd700" strokeWidth="2" fill="none" />
          </svg>
        )}
      </div>
    ));
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex bg-gray-900">
      <div className="flex-1 p-6">
        {!currentImage ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-2xl">
                <ImageIcon className="w-20 h-20 text-gray-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Upload Your Sketch</h2>
                <p className="text-gray-400 mb-8">
                  Get started by uploading your artwork. I'll help you enhance it, suggest colors, and provide feedback.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors transform hover:scale-[1.05] hover:shadow-xl hover:shadow-cyan-500/50 flex items-center space-x-3 mx-auto"
                >
                  <Upload className="w-6 h-6" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>New Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEnhanceSketch}
                  disabled={isEnhancing}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>{isEnhancing ? 'Enhancing...' : 'Enhance Sketch'}</span>
                </button>
                <button
                  onClick={handleGeneratePalettes}
                  disabled={isGeneratingPalettes}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isGeneratingPalettes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                  <span>Generate Palettes</span>
                </button>
              </div>
            </div>

            <div className="flex-1">
              <SketchCanvas
                imageUrl={currentImage}
                beforeImageUrl={originalImage}
                showComparison={true}
                overlays={renderOverlays()}
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="flex border-b border-gray-700">
          {(['enhancements', 'palettes', 'overlays', 'chat'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-gray-700 text-white border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'enhancements' && (
            <div className="space-y-4">
              {enhancements.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No enhancements yet. Click "Enhance Sketch" to analyze your artwork.</p>
                </div>
              ) : (
                enhancements.map((fix, index) => (
                  <div key={index} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 " >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        fix.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        fix.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {fix.severity}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{fix.type}</span>
                    </div>
                    <p className="text-white text-sm">{fix.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'palettes' && (
            <div className="space-y-4">
              {palettes.length === 0 ? (
                <div className="text-center py-12">
                  <Palette className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No palettes yet. Generate color themes for your artwork.</p>
                </div>
              ) : (
                palettes.map((theme, index) => (
                  <div key={index} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 " >
                    <h3 className="text-white font-semibold mb-2">{theme.name}</h3>
                    <div className="flex space-x-2 mb-3">
                      {theme.colors.map((color: string, i: number) => (
                        <div
                          key={i}
                          className="flex-1 aspect-square rounded-lg shadow-md"
                          style={{ backgroundColor: color }}
                          title={color}
                        ></div>
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{theme.mood}</p>
                    <p className="text-gray-500 text-xs">{theme.lighting}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'overlays' && (
            <div className="space-y-3">
              {overlays.map((overlay, index) => (
                <button
                  key={overlay.type}
                  onClick={() => toggleOverlay(overlay.type)}
                  className={`w-full p-4 rounded-xl transition-colors text-left  ${
                    overlay.enabled
                      ? 'bg-cyan-500/20 border-2 border-cyan-500'
                      : 'bg-gray-900/50 border-2 border-gray-700 hover:border-gray-600'
                  }`}
                  
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium capitalize">{overlay.type.replace('-', ' ')}</span>
                    <Grid className={`w-5 h-5 ${overlay.enabled ? 'text-cyan-400' : 'text-gray-500'}`} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div key={msg.id} className={` ${msg.type === 'user' ? 'flex justify-end' : ''}`} >
                    <div className={`max-w-[85%] p-3 rounded-xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-gray-900/50 border border-gray-700 text-gray-300'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.suggestions && (
                        <div className="mt-3 space-y-2">
                          {msg.suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(sug)}
                              className="block w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.tips && (
                        <div className="mt-3 text-xs text-gray-400 space-y-1">
                          {msg.tips.map((tip, i) => (
                            <p key={i}>💡 {tip}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="mt-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask for feedback..."
                    className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      </div>
    </>
  );
}
