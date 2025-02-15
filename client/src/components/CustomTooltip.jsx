import React from 'react';
import { Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label, ...props }) => {
  if (!active || !payload) return null; // Only show the tooltip when active

  return (
    <div
      style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--primary)',
        border: '1px solid var(--neutral)',
        borderRadius: '4px',
        padding: '8px',
        backgroundColor: 'var(--light)',
      }}
    >
      <p>{label}</p>
      <p>{payload[0].value}</p>
    </div>
  );
};

export default CustomTooltip;
