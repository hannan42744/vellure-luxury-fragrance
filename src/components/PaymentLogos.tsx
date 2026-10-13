import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Official-style bKash Logo with iconic origami bird and wordmark
 */
export const BkashLogo: React.FC<LogoProps> = ({ className = 'h-5 w-auto' }) => {
  return (
    <svg
      viewBox="0 0 92 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="bKash"
      role="img"
    >
      {/* Origami Bird Mark */}
      <g transform="translate(1, 1)">
        <path d="M15.5 1.5L2.8 10.2L12.2 13.8L15.5 1.5Z" fill="#E2136E" />
        <path d="M15.5 1.5L12.2 13.8L23.8 11.2L15.5 1.5Z" fill="#C20F5D" />
        <path d="M12.2 13.8L7.5 23.2L16.8 18.2L12.2 13.8Z" fill="#E2136E" />
        <path d="M12.2 13.8L16.8 18.2L23.8 11.2L12.2 13.8Z" fill="#9F0B4B" />
        <path d="M16.8 18.2L20.8 24.2L23.8 11.2L16.8 18.2Z" fill="#C20F5D" />
      </g>
      {/* bKash Typography */}
      <text
        x="30"
        y="19"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="-0.3px"
      >
        <tspan fill="#E2136E">b</tspan>
        <tspan fill="#FFFFFF">Kash</tspan>
      </text>
    </svg>
  );
};

/**
 * Official-style Nagad Logo with vibrant swirl flame and wordmark
 */
export const NagadLogo: React.FC<LogoProps> = ({ className = 'h-5 w-auto' }) => {
  return (
    <svg
      viewBox="0 0 94 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nagad"
      role="img"
    >
      {/* Swirl Ribbon Emblem */}
      <g transform="translate(1, 2)">
        <path
          d="M12 0.5C7.2 0.5 3.2 3.6 1.8 8.1C5 5.7 9 5.4 12.2 7C15.8 8.7 17.3 12.9 15.8 16.7C18.8 14.5 20.2 10.6 19.1 6.9C17.5 3.1 14.9 0.5 12 0.5Z"
          fill="#F7931E"
        />
        <path
          d="M2.2 12C2.5 15.9 5.2 19.2 9.1 20.4C5.8 18.6 4.7 15 5.8 11.7C7 8.2 11 6.3 14.6 7.3C11.9 4.5 7.6 4 4.3 6C2.2 7.6 1.9 10 2.2 12Z"
          fill="#ED1C24"
        />
        <circle cx="10.8" cy="12.5" r="2.8" fill="#F7931E" />
      </g>
      {/* Nagad Typography */}
      <text
        x="27"
        y="19"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="-0.2px"
        fill="#F7931E"
      >
        nagad
      </text>
    </svg>
  );
};

/**
 * Premium Cash On Delivery (COD) Badge Logo with Banknotes and Shield
 */
export const CodLogo: React.FC<LogoProps> = ({ className = 'h-5 w-auto' }) => {
  return (
    <svg
      viewBox="0 0 106 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cash on Delivery"
      role="img"
    >
      {/* Banknote & Shield Icon */}
      <g transform="translate(2, 3)">
        <rect
          x="0"
          y="1"
          width="20"
          height="14"
          rx="2.5"
          fill="#064E3B"
          stroke="#10B981"
          strokeWidth="1.2"
        />
        <circle cx="10" cy="8" r="3" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
        <path d="M8 8H12M10 6V10" stroke="#10B981" strokeWidth="1" strokeLinecap="round" />
        <path d="M2.5 4H4.5M15.5 12H17.5" stroke="#34D399" strokeWidth="1" strokeLinecap="round" />
        {/* Verification checkmark dot */}
        <circle cx="18" cy="3" r="2.5" fill="#10B981" />
        <path d="M17 3L17.8 3.8L19.2 2.2" stroke="#064E3B" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Text: CASH ON DELIVERY */}
      <g transform="translate(27, 2)">
        <text
          x="0"
          y="11"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="9"
          letterSpacing="0.8px"
          fill="#10B981"
        >
          CASH ON
        </text>
        <text
          x="0"
          y="19"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="7.5"
          letterSpacing="0.6px"
          fill="#E5E7EB"
        >
          DELIVERY
        </text>
      </g>
    </svg>
  );
};

/**
 * Beautiful unified payment method badges with official logos
 */
export const PaymentBadges: React.FC<{ variant?: 'footer' | 'checkout' }> = ({ variant = 'footer' }) => {
  if (variant === 'checkout') {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F0E13] border border-[#272530] shadow-sm">
          <CodLogo className="h-4 w-auto" />
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F0E13] border border-[#272530] shadow-sm">
          <BkashLogo className="h-4 w-auto" />
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F0E13] border border-[#272530] shadow-sm">
          <NagadLogo className="h-4 w-auto" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {/* Cash On Delivery Pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111015] border border-[#26242F] hover:border-[#10B981]/60 transition-all duration-200 shadow-sm group cursor-default"
        title="Cash on Delivery available nationwide in Bangladesh"
      >
        <CodLogo className="h-4 sm:h-[18px] w-auto transition-transform group-hover:scale-105" />
      </div>

      {/* bKash Pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111015] border border-[#26242F] hover:border-[#E2136E]/60 transition-all duration-200 shadow-sm group cursor-default"
        title="bKash Merchant Payment supported"
      >
        <BkashLogo className="h-4 sm:h-[18px] w-auto transition-transform group-hover:scale-105" />
      </div>

      {/* Nagad Pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111015] border border-[#26242F] hover:border-[#F7931E]/60 transition-all duration-200 shadow-sm group cursor-default"
        title="Nagad Payment supported"
      >
        <NagadLogo className="h-4 sm:h-[18px] w-auto transition-transform group-hover:scale-105" />
      </div>
    </div>
  );
};
