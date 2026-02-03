import React from 'react';
import styles from './HeroVisual.module.css';

const HeroVisual = () => {
  return (
    <div className={styles.heroVisualContainer}>
      <div className={styles.heroVisualWrapper}>
        <svg
          viewBox="0 0 800 600"
          className={styles.heroVisualSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="8" stdDeviation="16" floodOpacity="0.15" />
            </filter>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background circles */}
          <circle cx="100" cy="100" r="80" fill="url(#accentGradient)" opacity="0.05" />
          <circle cx="700" cy="500" r="120" fill="url(#accentGradient)" opacity="0.05" />
          <circle cx="650" cy="150" r="60" fill="url(#accentGradient)" opacity="0.08" />

          {/* Laptop/Desktop */}
          <g transform="translate(150, 200)">
            {/* Screen */}
            <rect
              x="0"
              y="0"
              width="350"
              height="220"
              rx="12"
              fill="url(#deviceGradient)"
              stroke="#cbd5e1"
              strokeWidth="3"
              filter="url(#shadow)"
            />
            
            {/* Screen Content - Browser Window */}
            <g transform="translate(15, 15)">
              {/* Browser Bar */}
              <rect x="0" y="0" width="320" height="35" rx="6" fill="#f1f5f9" stroke="#e2e8f0" />
              {/* Browser Dots */}
              <circle cx="15" cy="17.5" r="5" fill="#ef4444" />
              <circle cx="30" cy="17.5" r="5" fill="#f59e0b" />
              <circle cx="45" cy="17.5" r="5" fill="#10b981" />
              {/* URL Bar */}
              <rect x="60" y="10" width="200" height="15" rx="3" fill="#ffffff" stroke="#cbd5e1" />
              <text x="65" y="21" fontSize="9" fill="#64748b" fontFamily="Arial, sans-serif">www.tuempresa.com</text>
              
              {/* Web Page Content */}
              <g transform="translate(0, 45)">
                {/* Header */}
                <rect x="0" y="0" width="320" height="50" rx="4" fill="url(#accentGradient)" opacity="0.1" />
                <text x="15" y="32" fontSize="14" fontWeight="700" fill="#1e293b" fontFamily="Arial, sans-serif">Tu Empresa</text>
                
                {/* Content Cards */}
                <g transform="translate(0, 60)">
                  <rect x="0" y="0" width="150" height="80" rx="6" fill="#ffffff" stroke="#e2e8f0" filter="url(#shadow)" />
                  <rect x="10" y="10" width="130" height="8" rx="2" fill="#e2e8f0" />
                  <rect x="10" y="25" width="100" height="8" rx="2" fill="#e2e8f0" />
                  <rect x="10" y="40" width="80" height="8" rx="2" fill="#e2e8f0" />
                  <rect x="10" y="55" width="60" height="20" rx="4" fill="url(#accentGradient)" opacity="0.2" />
                  
                  <rect x="170" y="0" width="150" height="80" rx="6" fill="#ffffff" stroke="#e2e8f0" filter="url(#shadow)" />
                  <rect x="180" y="10" width="130" height="8" rx="2" fill="#e2e8f0" />
                  <rect x="180" y="25" width="100" height="8" rx="2" fill="#e2e8f0" />
                  <rect x="180" y="40" width="80" height="8" rx="2" fill="#e2e8f0" />
                  <rect x="180" y="55" width="60" height="20" rx="4" fill="url(#accentGradient)" opacity="0.2" />
                </g>
              </g>
            </g>
          </g>

          {/* Tablet */}
          <g transform="translate(550, 250)">
            <rect
              x="0"
              y="0"
              width="180"
              height="240"
              rx="16"
              fill="url(#deviceGradient)"
              stroke="#cbd5e1"
              strokeWidth="3"
              filter="url(#shadow)"
            />
            {/* Screen */}
            <rect x="8" y="8" width="164" height="224" rx="8" fill="#1e293b" />
            {/* App Icons */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="30" height="30" rx="6" fill="#2563eb" />
              <rect x="40" y="0" width="30" height="30" rx="6" fill="#059669" />
              <rect x="80" y="0" width="30" height="30" rx="6" fill="#06b6d4" />
              <rect x="120" y="0" width="30" height="30" rx="6" fill="#f59e0b" />
              
              <rect x="0" y="40" width="30" height="30" rx="6" fill="#8b5cf6" />
              <rect x="40" y="40" width="30" height="30" rx="6" fill="#ec4899" />
              <rect x="80" y="40" width="30" height="30" rx="6" fill="#14b8a6" />
              <rect x="120" y="40" width="30" height="30" rx="6" fill="#f97316" />
            </g>
            {/* Content Area */}
            <rect x="20" y="90" width="140" height="100" rx="6" fill="#ffffff" opacity="0.1" />
            <rect x="30" y="100" width="120" height="6" rx="2" fill="#64748b" opacity="0.5" />
            <rect x="30" y="115" width="100" height="6" rx="2" fill="#64748b" opacity="0.5" />
            <rect x="30" y="130" width="80" height="6" rx="2" fill="#64748b" opacity="0.5" />
          </g>

          {/* Phone */}
          <g transform="translate(100, 350)">
            <rect
              x="0"
              y="0"
              width="100"
              height="180"
              rx="20"
              fill="url(#deviceGradient)"
              stroke="#cbd5e1"
              strokeWidth="3"
              filter="url(#shadow)"
            />
            {/* Screen */}
            <rect x="8" y="8" width="84" height="164" rx="12" fill="#1e293b" />
            {/* Notch */}
            <rect x="35" y="0" width="30" height="8" rx="4" fill="#1e293b" />
            {/* Status Bar */}
            <rect x="15" y="20" width="70" height="4" rx="2" fill="#64748b" opacity="0.5" />
            {/* App Content */}
            <rect x="15" y="35" width="70" height="50" rx="6" fill="#ffffff" opacity="0.1" />
            <rect x="20" y="40" width="60" height="4" rx="2" fill="#64748b" opacity="0.5" />
            <rect x="20" y="50" width="50" height="4" rx="2" fill="#64748b" opacity="0.5" />
            <rect x="20" y="60" width="40" height="4" rx="2" fill="#64748b" opacity="0.5" />
            {/* Home Indicator */}
            <rect x="40" y="165" width="20" height="3" rx="2" fill="#64748b" opacity="0.5" />
          </g>

          {/* Connection Lines */}
          <g stroke="url(#accentGradient)" strokeWidth="3" strokeDasharray="5,5" opacity="0.3" fill="none">
            <line x1="325" y1="310" x2="550" y2="370" />
            <line x1="325" y1="310" x2="150" y2="440" />
            <line x1="550" y2="370" x2="200" y2="440" />
          </g>

          {/* Floating Code Elements */}
          <g opacity="0.1">
            <text x="50" y="150" fontSize="40" fill="#2563eb" fontFamily="'Courier New', monospace" fontWeight="bold">{'<'}</text>
            <text x="750" y="450" fontSize="40" fill="#2563eb" fontFamily="'Courier New', monospace" fontWeight="bold">{'/>'}</text>
            <text x="680" y="100" fontSize="30" fill="#059669" fontFamily="'Courier New', monospace">{'{'}</text>
            <text x="20" y="500" fontSize="30" fill="#059669" fontFamily="'Courier New', monospace">{'}'}</text>
          </g>

          {/* Speed Indicator - 24 horas */}
          <g transform="translate(500, 100)">
            <circle cx="0" cy="0" r="50" fill="url(#accentGradient)" opacity="0.1" />
            <circle cx="0" cy="0" r="40" fill="none" stroke="url(#accentGradient)" strokeWidth="3" strokeDasharray="251" strokeDashoffset="50" opacity="0.5">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <text x="-30" y="5" fontSize="16" fontWeight="700" fill="#2563eb" fontFamily="Arial, sans-serif">24h</text>
            <text x="-20" y="20" fontSize="10" fill="#64748b" fontFamily="Arial, sans-serif">Listo</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeroVisual;
