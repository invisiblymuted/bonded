import { cloneElement, type ReactElement } from "react";

interface GradientIconProps {
  icon: ReactElement;
  className?: string;
}

export function GradientIcon({ icon, className = "" }: GradientIconProps) {
  const id = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <span className={`inline-flex ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
        </defs>
      </svg>
      {cloneElement(icon, {
        style: { stroke: `url(#${id})` },
      })}
    </span>
  );
}
