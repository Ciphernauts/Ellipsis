import React, { useEffect } from 'react';

const PWALayout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('pwa-mode');
    return () => {
      document.body.classList.remove('pwa-mode');
    };
  }, []);

  return <div className='pwa-layout'>{children}</div>;
};

export default PWALayout;
