import { ColorPalette } from '../types';

export const generateColorPalette = (mood: ColorPalette['mood']): string[] => {
  const palettes: Record<ColorPalette['mood'], string[]> = {
    warm: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42', '#FFF3E0'],
    cool: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#E8F4F8'],
    dramatic: ['#1A0B2E', '#16213E', '#0F3460', '#E94560', '#F5F5F5'],
    sunset: ['#FF6B6B', '#FF8E53', '#FF6B35', '#FFE66D', '#FF8C42'],
    night: ['#2D1B69', '#11052C', '#3D2C8D', '#6439FF', '#9D4EDD'],
    natural: ['#6B5B73', '#88A47C', '#B8E6B8', '#C7CEEA', '#A593C2']
  };

  return palettes[mood];
};

export const extractColorsFromImage = async (imageUrl: string): Promise<string[]> => {
  // Simulate color extraction - in real implementation, this would use canvas or external API
  return new Promise((resolve) => {
    setTimeout(() => {
      const colors = ['#3B4A6B', '#5D7491', '#8FA4C4', '#B8CCE8', '#E1EAF4'];
      resolve(colors);
    }, 1000);
  });
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};