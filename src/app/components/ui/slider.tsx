'use client';

import React, { useState, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
  labels?: string[];
}

export function Slider({
  min,
  max,
  value,
  onChange,
  step = 1,
  className = '',
  labels
}: SliderProps) {
  const [localValue, setLocalValue] = useState(value);
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Calculate percentage for slider position and fill
  const percentage = ((localValue - min) / (max - min)) * 100;
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Slider background */}
        <div className="absolute h-2 rounded-full w-full bg-slate-200 dark:bg-slate-700" />
        
        {/* Filled portion of slider */}
        <div 
          className="absolute h-2 rounded-full bg-blue-500 dark:bg-blue-400" 
          style={{ width: `${percentage}%` }}
        />
        
        {/* Range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer relative z-10"
          style={{
            // Override default styles for different browsers
            WebkitAppearance: 'none',
            appearance: 'none',
            backgroundColor: 'transparent'
          }}
        />
        
        {/* Thumb/handle */}
        <div 
          className="absolute w-5 h-5 bg-white border-2 border-blue-500 dark:border-blue-400 rounded-full shadow-md top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      {/* Labels */}
      {labels && (
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
} 