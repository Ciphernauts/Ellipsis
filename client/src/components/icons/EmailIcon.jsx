import React from 'react';

export default function EmailIcon(size = 'large') {
  return (
    <svg
      width={size === 'large' ? '60' : '20px'}
      height={size === 'large' ? '60' : '20px'}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7'
        stroke='var(--dark)'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect
        x='3'
        y='5'
        width='18'
        height='14'
        rx='2'
        stroke='var(--dark)'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}
