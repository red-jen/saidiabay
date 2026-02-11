'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  className = '',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white border rounded-xl
          flex items-center justify-between gap-2
          transition-all duration-200
          ${
            disabled
              ? 'bg-secondary-50 border-secondary-200 cursor-not-allowed opacity-60'
              : isOpen
              ? 'border-primary-500 ring-2 ring-primary-100 shadow-sm'
              : 'border-secondary-200 hover:border-primary-300 hover:shadow-sm'
          }
        `}
      >
        <span
          className={`text-left flex-1 ${
            selectedOption ? 'text-secondary-900' : 'text-secondary-400'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`w-5 h-5 text-secondary-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute z-50 w-full mt-2 
            bg-white border border-secondary-200 rounded-xl shadow-luxury
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-3 text-left
                    flex items-center justify-between gap-2
                    transition-colors duration-150
                    ${
                      isSelected
                        ? 'bg-primary-50 text-primary-900 font-medium'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <FiCheck className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

