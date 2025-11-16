import React, { useEffect, useState } from 'react';
import { Wand2, CheckCircle, Clock, Zap } from 'lucide-react';

interface EnhancementStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  duration: number;
}

interface EnhancementProgressProps {
  isVisible: boolean;
  onComplete: () => void;
  enhancementType: 'lines' | 'anatomy' | 'perspective';
  className?: string;
}

export default function EnhancementProgress({ 
  isVisible, 
  onComplete, 
  enhancementType,
  className = '' 
}: EnhancementProgressProps) {
  const [steps, setSteps] = useState<EnhancementStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const enhancementSteps = {
    lines: [
      { id: '1', name: 'Analyzing sketch', description: 'Detecting line quality and consistency', duration: 1000 },
      { id: '2', name: 'Cleaning lines', description: 'Smoothing rough strokes and removing artifacts', duration: 1500 },
      { id: '3', name: 'Optimizing strokes', description: 'Improving line weight and consistency', duration: 1200 },
      { id: '4', name: 'Final touches', description: 'Applying style consistency', duration: 800 }
    ],
    anatomy: [
      { id: '1', name: 'Analyzing proportions', description: 'Detecting anatomical structure', duration: 1200 },
      { id: '2', name: 'Fixing anatomy', description: 'Correcting proportion issues', duration: 1800 },
      { id: '3', name: 'Adjusting symmetry', description: 'Balancing left and right sides', duration: 1000 },
      { id: '4', name: 'Preserving style', description: 'Maintaining original artistic style', duration: 900 }
    ],
    perspective: [
      { id: '1', name: 'Analyzing perspective', description: 'Detecting vanishing points and depth', duration: 1100 },
      { id: '2', name: 'Correcting depth', description: 'Adjusting perspective lines', duration: 1600 },
      { id: '3', name: 'Balancing composition', description: 'Improving visual flow', duration: 1300 },
      { id: '4', name: 'Final refinement', description: 'Polishing the result', duration: 700 }
    ]
  };

  useEffect(() => {
    if (isVisible) {
      const initialSteps = enhancementSteps[enhancementType].map(step => ({
        ...step,
        status: 'pending' as const
      }));
      setSteps(initialSteps);
      setCurrentStep(0);
      
      // Start processing steps
      processSteps(initialSteps);
    }
  }, [isVisible, enhancementType]);

  const processSteps = async (initialSteps: EnhancementStep[]) => {
    for (let i = 0; i < initialSteps.length; i++) {
      setCurrentStep(i);
      
      // Mark current step as processing
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'processing' } : step
      ));

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, initialSteps[i].duration));

      // Mark current step as completed
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));
    }

    // Wait a bit before calling onComplete
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="bg-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Enhancing Your Sketch</h3>
          <p className="text-gray-400">
            AI is analyzing and improving your artwork...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                flex items-center space-x-4 p-3 rounded-lg transition-all
                ${step.status === 'processing' 
                  ? 'bg-purple-600 bg-opacity-20 border border-purple-500' 
                  : step.status === 'completed'
                  ? 'bg-green-600 bg-opacity-20 border border-green-500'
                  : 'bg-gray-700'
                }
              `}
            >
              <div className="flex-shrink-0">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : step.status === 'processing' ? (
                  <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  step.status === 'completed' ? 'text-green-300' :
                  step.status === 'processing' ? 'text-purple-300' : 'text-gray-300'
                }`}>
                  {step.name}
                </h4>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>

              {step.status === 'processing' && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-purple-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}