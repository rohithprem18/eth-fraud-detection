import React, { useEffect, useRef } from 'react';

interface RiskScoreGaugeProps {
  score: number;
  size?: number;
  thickness?: number;
  animate?: boolean;
}

const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ 
  score, 
  size = 200, 
  thickness = 12,
  animate = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - thickness) / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = '#374151'; // Gray-700
    ctx.stroke();
    
    // Calculate score color
    const getColor = (value: number) => {
      const red = Math.min(255, Math.round((value / 100) * 255));
      const green = Math.min(255, Math.round(((100 - value) / 100) * 255));
      return `rgb(${red}, ${green}, 60)`;
    };
    
    const color = getColor(score);
    
    // Animate the score arc
    if (animate) {
      let currentScore = 0;
      const interval = setInterval(() => {
        if (currentScore >= score) {
          clearInterval(interval);
          return;
        }
        
        currentScore += 1;
        
        // Draw score arc
        ctx.beginPath();
        ctx.arc(
          centerX, 
          centerY, 
          radius, 
          Math.PI, 
          Math.PI + (currentScore / 100) * Math.PI, 
          false
        );
        ctx.lineWidth = thickness;
        ctx.strokeStyle = getColor(currentScore);
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw score text
        ctx.font = 'bold 32px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.clearRect(centerX - 50, centerY - 20, 100, 60);
        ctx.fillText(`${currentScore}`, centerX, centerY);
        
        ctx.font = '14px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#9CA3AF'; // Gray-400
        ctx.fillText('Risk Score', centerX, centerY + 25);
        
      }, 10);
    } else {
      // Draw score arc without animation
      ctx.beginPath();
      ctx.arc(
        centerX, 
        centerY, 
        radius, 
        Math.PI, 
        Math.PI + (score / 100) * Math.PI, 
        false
      );
      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw score text
      ctx.font = 'bold 32px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${score}`, centerX, centerY);
      
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#9CA3AF'; // Gray-400
      ctx.fillText('Risk Score', centerX, centerY + 25);
    }
    
  }, [score, size, thickness, animate]);
  
  return <canvas ref={canvasRef} width={size} height={size} />;
};

export default RiskScoreGauge;