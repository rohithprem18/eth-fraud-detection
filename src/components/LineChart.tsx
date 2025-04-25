import React, { useEffect, useRef } from 'react';
import { ChartData } from '../types';

interface LineChartProps {
  data: ChartData;
  height?: number;
  animate?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 200, animate = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const chartHeight = height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    
    const chartWidth = width - padding.left - padding.right;
    const chartArea = {
      x: padding.left,
      y: padding.top,
      width: chartWidth,
      height: chartHeight - padding.top - padding.bottom
    };
    
    // Clear canvas
    ctx.clearRect(0, 0, width, chartHeight);
    
    // Find max value for y-axis scale
    const allValues = data.datasets.flatMap(ds => ds.data);
    const maxValue = Math.max(...allValues) * 1.1; // Add 10% padding
    
    // Draw grid lines
    ctx.strokeStyle = '#374151'; // Gray-700
    ctx.lineWidth = 0.5;
    
    // Draw y-axis grid lines
    const yGridCount = 5;
    ctx.beginPath();
    for (let i = 0; i <= yGridCount; i++) {
      const y = chartArea.y + chartArea.height - (i / yGridCount) * chartArea.height;
      ctx.moveTo(chartArea.x, y);
      ctx.lineTo(chartArea.x + chartArea.width, y);
      
      // Draw y-axis labels
      const value = (i / yGridCount) * maxValue;
      ctx.fillStyle = '#9CA3AF'; // Gray-400
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toFixed(0), chartArea.x - 5, y);
    }
    ctx.stroke();
    
    // Draw x-axis grid lines and labels
    const xStep = chartArea.width / (data.labels.length - 1);
    ctx.beginPath();
    for (let i = 0; i < data.labels.length; i++) {
      const x = chartArea.x + i * xStep;
      
      // Vertical grid line
      ctx.moveTo(x, chartArea.y);
      ctx.lineTo(x, chartArea.y + chartArea.height);
      
      // x-axis label
      ctx.fillStyle = '#9CA3AF'; // Gray-400
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(data.labels[i], x, chartArea.y + chartArea.height + 5);
    }
    ctx.stroke();
    
    // Draw data for each dataset
    data.datasets.forEach((dataset, datasetIndex) => {
      const points = dataset.data.map((value, i) => ({
        x: chartArea.x + i * xStep,
        y: chartArea.y + chartArea.height - (value / maxValue) * chartArea.height
      }));
      
      const lineColor = Array.isArray(dataset.borderColor) 
        ? dataset.borderColor[0] 
        : dataset.borderColor || '#3B82F6'; // Blue-500
      
      // Draw line
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      if (animate) {
        // Animate drawing the line
        let currentPoints = 0;
        const drawLine = () => {
          if (currentPoints >= points.length) return;
          
          ctx.beginPath();
          if (currentPoints === 0) {
            ctx.moveTo(points[0].x, points[0].y);
          } else {
            ctx.moveTo(points[currentPoints - 1].x, points[currentPoints - 1].y);
            ctx.lineTo(points[currentPoints].x, points[currentPoints].y);
          }
          ctx.stroke();
          
          // Draw point
          ctx.fillStyle = lineColor;
          ctx.beginPath();
          ctx.arc(points[currentPoints].x, points[currentPoints].y, 3, 0, Math.PI * 2);
          ctx.fill();
          
          currentPoints++;
          if (currentPoints < points.length) {
            requestAnimationFrame(drawLine);
          }
        };
        
        drawLine();
      } else {
        // Draw line without animation
        points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        
        // Draw points
        points.forEach(point => {
          ctx.fillStyle = lineColor;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      // Draw dataset label
      ctx.fillStyle = lineColor;
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(dataset.label, chartArea.x + 5, chartArea.y + 10 + datasetIndex * 20);
    });
    
  }, [data, height, animate]);
  
  return <canvas ref={canvasRef} width="100%" height={height} />;
};

export default LineChart;