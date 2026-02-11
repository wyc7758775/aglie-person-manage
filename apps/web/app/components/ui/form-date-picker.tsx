'use client';

import React from 'react';
import FormLabel from './form-label';

interface FormDatePickerProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function FormDatePicker({
  id,
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  error,
  disabled = false,
  className = '',
}: FormDatePickerProps) {
  return (
    <div className={className}>
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      )}
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
