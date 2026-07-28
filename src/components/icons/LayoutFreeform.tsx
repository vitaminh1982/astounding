import React from 'react';
import { LucideProps } from 'lucide-react';

// lucide-react (installed at v0.344.0) doesn't ship this icon yet — inlined from lucide-static v1.27.0.
export default function LayoutFreeform({ size = 24, strokeWidth = 2, color = 'currentColor', className, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="4" rx="1" />
      <rect width="7" height="7" x="4" y="14" rx="1" />
    </svg>
  );
}
