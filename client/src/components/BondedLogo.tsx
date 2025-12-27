export function BondedLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left piece */}
      <path d="M12 20c-3.314 0-6-2.239-6-5 0-2.144 1.365-4.02 3.5-4.87" />
      
      {/* Right piece */}
      <path d="M12 20c3.314 0 6-2.239 6-5 0-2.144-1.365-4.02-3.5-4.87" />
      
      {/* Top left piece */}
      <path d="M7.5 10.13C6 9.02 5 7.5 5 5.5 5 3.57 6.343 2 8 2c1.657 0 3 1.57 3 3.5 0 1.4-.5 2.6-1.5 3.63" />
      
      {/* Top right piece */}
      <path d="M16.5 10.13C18 9.02 19 7.5 19 5.5 19 3.57 17.657 2 16 2c-1.657 0-3 1.57-3 3.5 0 1.4.5 2.6 1.5 3.63" />
      
      {/* Center piece that connects it all */}
      <path d="M12 10c0 0-1 1-1 2.5 0 1.5.5 3 1 4" />
      <path d="M12 10c0 0 1 1 1 2.5 0 1.5-.5 3-1 4" />
      
      {/* Stitching details - dashed lines for sewn effect */}
      <g strokeDasharray="1.5,1.5" opacity="0.7">
        <path d="M9 8 Q12 9 15 8" />
        <path d="M8 12 Q12 13 16 12" />
        <path d="M10 15 Q12 15.5 14 15" />
      </g>
    </svg>
  );
}
