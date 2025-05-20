import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const Spinner = ({ size = 'md', variant = 'primary', className = '', ...props }) => {
  const sizeMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  };
  
  const spinnerSize = sizeMap[size] || sizeMap.md;
  
  return (
    <BootstrapSpinner
      animation="border"
      variant={variant}
      style={{ width: spinnerSize, height: spinnerSize }}
      className={className}
      {...props}
    />
  );
};

export default Spinner; 