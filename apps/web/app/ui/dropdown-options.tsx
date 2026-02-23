'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

interface DropdownOptionsProps<T> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  renderTrigger?: (selectedOption: DropdownOption<T>, isOpen: boolean) => React.ReactNode;
  renderOption?: (option: DropdownOption<T>, isSelected: boolean) => React.ReactNode;
  minWidth?: number | string;
  disabled?: boolean;
  className?: string;
}

export default function DropdownOptions<T extends string>({
  options,
  value,
  onChange,
  renderTrigger,
  renderOption,
  minWidth = 80,
  disabled = false,
  className,
}: DropdownOptionsProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption<T>) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(!disabled && 'cursor-pointer')}
      >
        {renderTrigger ? (
          renderTrigger(selectedOption, isOpen)
        ) : (
          <span className="text-sm">{selectedOption.label}</span>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute z-50 mt-1 rounded-lg overflow-hidden shadow-lg"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(26, 29, 46, 0.15)',
              minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={String(option.value)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelect(option)}
                >
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <span className="text-sm">{option.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
