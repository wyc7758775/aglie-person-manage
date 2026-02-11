'use client';

import React from 'react';

interface FormRadioProps {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function FormRadio({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: FormRadioProps) {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
