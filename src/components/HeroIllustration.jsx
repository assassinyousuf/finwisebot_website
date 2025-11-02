import React from 'react'

export default function HeroIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 520 360" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Financial dashboard illustration">
      <defs>
        <linearGradient id="gA" x1="0" x2="1">
          <stop offset="0%" stopColor="#06d6a0"/>
          <stop offset="100%" stopColor="#60a5fa"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="360" rx="16" fill="url(#gA)" opacity="0.06" />
      <g transform="translate(24,28)">
        <rect x="0" y="0" width="340" height="220" rx="12" fill="#042b3b" opacity="0.9" stroke="rgba(255,255,255,0.04)" />
        <path d="M16 180 C70 90, 140 80, 200 120 C260 160, 320 100, 320 60" fill="none" stroke="#7ef7d6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
        <circle cx="64" cy="110" r="6" fill="#5eead4" />
        <circle cx="200" cy="140" r="6" fill="#60a5fa" />
        <rect x="360" y="20" width="120" height="60" rx="8" fill="#031826" stroke="rgba(255,255,255,0.03)" />
        <rect x="360" y="100" width="120" height="120" rx="8" fill="#031826" stroke="rgba(255,255,255,0.03)" />
        <g transform="translate(368,28)">
          <rect x="0" y="0" width="32" height="12" rx="3" fill="#6ee7b7" />
          <rect x="40" y="0" width="48" height="8" rx="3" fill="#93c5fd" />
        </g>
      </g>
    </svg>
  )
}
