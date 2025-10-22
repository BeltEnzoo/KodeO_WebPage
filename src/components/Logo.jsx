import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className={styles.logoContainer}>
      <svg 
        className={className} 
        viewBox="0 0 500 500" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Solo la K central - sin fondo */}
        <g transform="translate(0,500) scale(0.1,-0.1)" fill="url(#logoGradient)" filter="url(#glow)">
          <path d="M2381 4209 c-506 -55 -910 -419 -1017 -919 -28 -128 -25 -354 6 -480
43 -180 102 -305 211 -449 148 -197 380 -352 626 -418 90 -25 114 -27 288 -27
175 0 198 2 289 27 531 143 891 633 863 1172 -9 180 -44 311 -125 469 -109
212 -299 403 -507 508 -181 92 -434 138 -634 117z m-69 -660 l3 -322 260 321
260 321 163 0 c89 1 162 -2 162 -7 0 -4 -55 -75 -122 -158 -68 -84 -194 -240
-282 -348 l-158 -196 35 -43 c19 -23 145 -172 281 -332 135 -159 246 -296 246
-302 0 -10 -40 -13 -165 -13 l-164 0 -48 58 c-26 31 -120 146 -208 256 l-159
198 -24 -28 c-14 -16 -90 -103 -171 -194 -80 -90 -154 -173 -163 -185 -16 -19
-17 15 -18 638 l0 657 135 0 135 0 2 -321z"/>
        </g>
      </svg>
      {showText && <span>KodeON</span>}
    </div>
  );
};

export default Logo;
