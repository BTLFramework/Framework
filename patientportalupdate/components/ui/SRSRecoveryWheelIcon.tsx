import * as React from "react";

interface SRSRecoveryWheelIconProps {
  className?: string;
}

// Pure white version of the 'ball orbiting a wheel' SRS logo
export const SRSRecoveryWheelIcon: React.FC<SRSRecoveryWheelIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main open ring (thick, with a gap) */}
    <path
      d="M40 24c0-8.837-7.163-16-16-16S8 15.163 8 24s7.163 16 16 16c5.523 0 10-4.477 10-10"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Orbiting ball with SRS */}
    <g>
      <circle
        cx="36"
        cy="12"
        r="6"
        fill="#fff"
      />
      <text
        x="36"
        y="15.5"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="bold"
        fontSize="5.5"
        fill="#1881b6"
        letterSpacing="0.5"
        style={{ userSelect: 'none' }}
      >
        SRS
      </text>
    </g>
  </svg>
); 