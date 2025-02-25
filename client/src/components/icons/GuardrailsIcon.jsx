import React from 'react';

const GuardrailsIcon = ({ dark = false }) => (
  <svg
    width='25'
    height='20'
    viewBox='0 0 25 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M2.11538 0H4.49341L7.91729 10.5618H2.11538C0.947078 10.5618 0 9.4551 0 8.08989V2.47191C0 1.1067 0.947078 0 2.11538 0Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
    <path
      d='M12.19 10.5618H10.854L7.43004 0H8.76615L12.19 10.5618Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
    <path
      d='M15.1268 10.5618L11.7028 0H13.0388L16.4627 10.5618H15.1268Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
    <path
      d='M19.3994 10.5618L15.9754 0H22.8846C24.0529 0 25 1.1067 25 2.47191V8.08989C25 9.4551 24.0529 10.5618 22.8846 10.5618H19.3994Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
    <path
      d='M3.84615 11.9101H5.96154V18.2022C6.49258 18.2022 6.92308 18.7053 6.92308 19.3258V20H2.88462V19.3258C2.88462 18.7053 3.31511 18.2022 3.84615 18.2022V11.9101Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
    <path
      d='M19.0385 11.9101H21.1538V18.2022C21.6849 18.2022 22.1154 18.7053 22.1154 19.3258V20H18.0769V19.3258C18.0769 18.7053 18.5074 18.2022 19.0385 18.2022V11.9101Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
  </svg>
);

export default GuardrailsIcon;
