import React from 'react';

const BootsIcon = ({ dark = false }) => (
  <svg
    width='19'
    height='20'
    viewBox='0 0 19 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M18.5125 14V15H0.487793V0H10.5015V10H14.507C15.5693 10 16.5881 10.4214 17.3393 11.1716C18.0905 11.9217 18.5125 12.9391 18.5125 14ZM0.487793 18C0.487793 18.5304 0.698796 19.0391 1.07438 19.4142C1.44997 19.7893 1.95938 20 2.49054 20H16.5097C17.0409 20 17.5503 19.7893 17.9259 19.4142C18.3015 19.0391 18.5125 18.5304 18.5125 18V17H0.487793V18Z'
      fill={dark ? 'var(--dark)' : 'var(--light)'}
    />
  </svg>
);

export default BootsIcon;
