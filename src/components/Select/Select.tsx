import React, { useImperativeHandle, useRef } from 'react';

import styles from './Select.module.scss';

export interface SelectProps {
  name: string;
  label: string;
  onChange: () => void;
  children?: React.ReactElement;
  // value: string;
}

export const Select = React.forwardRef((props: SelectProps, ref) => {
  const { name, label, onChange, children } = props;
  return (
    <div className="select">
      <label htmlFor={name}>{label}</label>
      <select ref={ref as any} id={name} {...onChange}>
        {children}
      </select>
    </div>
  );
});

Select.displayName = 'Select';
