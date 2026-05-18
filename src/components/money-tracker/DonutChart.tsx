'use client';

import React from 'react';

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerAmount?: string;
  centerLabel?: string;
}

export default function DonutChart({
  segments,
  size = 200,
  strokeWidth = 28,
  centerAmount = '₹0',
  centerLabel = 'Total',
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {total > 0 &&
            segments.map((segment, index) => {
              const percentage = segment.value / total;
              const offset = circumference * (1 - percentage);
              const rotation = (cumulativeOffset / total) * 360 - 90;

              cumulativeOffset += segment.value;

              return (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform={`rotate(${rotation} ${center} ${center})`}
                  className="donut-segment"
                  style={
                    {
                      '--donut-circumference': circumference,
                      '--donut-offset': offset,
                    } as React.CSSProperties
                  }
                />
              );
            })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg">{centerAmount}</span>
          <span className="text-[#9ca3af] text-xs">{centerLabel}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-[#9ca3af]">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
