import React from 'react';

/* Smooth wave connecting black → white sections */
export const WaveDivider = ({ from = '#000', to = '#fff', className = '' }) => (
  <div className={`relative z-10 h-[120px] -mt-[1px] -mb-[1px] w-full ${className}`} style={{ background: from }}>
    <svg
      viewBox="0 0 1440 220"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="block w-full h-full"
    >
      <path
        fill={to}
        d="M0,128L60,138.7C120,149,240,171,360,165.3C480,160,600,128,720,117.3C840,107,960,117,1080,138.7C1200,160,1320,192,1380,208L1440,224L1440,224L1380,224C1320,224,1200,224,1080,224C960,224,840,224,720,224C600,224,480,224,360,224C240,224,120,224,60,224L0,224Z"
      />
    </svg>
  </div>
);

/* Smooth wave connecting white → black sections */
export const WaveDividerInverse = ({ from = '#fff', to = '#000', className = '' }) => (
  <div className={`relative z-10 h-[120px] -mt-[1px] -mb-[1px] w-full ${className}`} style={{ background: from }}>
    <svg
      viewBox="0 0 1440 220"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="block w-full h-full"
    >
      <path
        fill={to}
        d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,112C672,107,768,117,864,138.7C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,224L1392,224C1344,224,1248,224,1152,224C1056,224,960,224,864,224C768,224,672,224,576,224C480,224,384,224,288,224C192,224,96,224,48,224L0,224Z"
      />
    </svg>
  </div>
);
