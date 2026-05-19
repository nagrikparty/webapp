import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  const wheelCenterY = 108;
  const wheelCenterX = 100;
  
  // Generate 24 spokes for Ashoka Chakra
  const spokes = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    return (
      <polygon
        key={`spoke-${i}`}
        points="98.5,108 101.5,76 100.5,44 99.5,44 98.5,76"
        fill="#0B2553"
        transform={`rotate(${angle} ${wheelCenterX} ${wheelCenterY})`}
      />
    );
  });

  // Generate 24 teeth for Ashoka Chakra
  const teeth = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24 + 7.5;
    return (
      <circle
        key={`tooth-${i}`}
        cx={wheelCenterX}
        cy={46}
        r="2.2"
        fill="#0B2553"
        transform={`rotate(${angle} ${wheelCenterX} ${wheelCenterY})`}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ashoka Chakra Wheel (Navy Blue) */}
      <circle cx={wheelCenterX} cy={wheelCenterY} r="14" fill="#0B2553" />
      <circle
        cx={wheelCenterX}
        cy={wheelCenterY}
        r="66"
        stroke="#0B2553"
        strokeWidth="6"
        fill="none"
      />
      {spokes}
      {teeth}

      {/* Chimta Symbol (Matte Black / currentColor) */}
      <path
        d="M 100,20 C 89,20 84,28 84,39 C 84,45 82,75 69.5,158 C 68.8,162.5 72.2,166.5 76.8,166.5 C 80.5,166.5 82.5,163.5 83.2,159 C 94.5,85 96.5,57.5 96.5,52 C 96.5,51.5 103.5,51.5 103.5,52 C 103.5,57.5 105.5,85 116.8,159 C 117.5,163.5 119.5,166.5 123.2,166.5 C 127.8,166.5 131.2,162.5 130.5,158 C 118,75 116,45 116,39 C 116,28 111,20 100,20 Z M 100,28 C 104.4,28 108,31.6 108,36 C 108,40.4 104.4,44 100,44 C 95.6,44 92,40.4 92,36 C 92,31.6 95.6,28 100,28 Z"
        fill="currentColor"
      />

      {/* Chimta Hinge Detail */}
      <circle cx="102" cy="38" r="4.5" fill="currentColor" />
      <circle cx="102" cy="38" r="1.5" fill="#F5F1E8" className="fill-off-white" />
    </svg>
  );
}
