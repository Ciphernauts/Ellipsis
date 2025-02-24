const WaveBackground = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 1440 895'
      preserveAspectRatio='none'
      className={className}
    >
      <path
        d='M175.5 139.5C97.7466 107.929 0 15.5 0 15.5V894.5H1440V0C1440 0 1409.17 122.971 1355.5 180C1283.5 256.5 1224.58 270.91 1206 333C1163.5 475 1244 614.5 1153 691C1038.1 787.593 848.891 764.876 752 706C647.5 642.5 651.5 570.5 701 437.5C747.733 311.934 661.256 170.875 531 139.5C394 106.5 304.132 191.729 175.5 139.5Z'
        fill='url(#paint0_linear_559_9628)'
      />
      <defs>
        <linearGradient
          id='paint0_linear_559_9628'
          x1='720'
          y1='0'
          x2='720'
          y2='894.5'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#006684' />
          <stop offset='1' stopColor='#91D3ED' />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default WaveBackground;
