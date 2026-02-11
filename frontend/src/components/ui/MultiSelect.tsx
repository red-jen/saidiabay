'use client';

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  label,
  className = '',
  disabled = false,
  maxDisplay = 2,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}

      {/* Multi-Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white border rounded-xl
          flex items-center justify-between gap-2
          transition-all duration-200 min-h-[48px]
          ${
            disabled
              ? 'bg-secondary-50 border-secondary-200 cursor-not-allowed opacity-60'
              : isOpen
              ? 'border-primary-500 ring-2 ring-primary-100 shadow-sm'
              : 'border-secondary-200 hover:border-primary-300 hover:shadow-sm'
          }
        `}
      >
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          {selectedOptions.length === 0 ? (
            <span className="text-secondary-400">{placeholder}</span>
          ) : (
            <>
              {selectedOptions.slice(0, maxDisplay).map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedOptions.length > maxDisplay && (
                <span className="text-sm text-secondary-600 font-medium">
                  +{selectedOptions.length - maxDisplay} more
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <FiChevronDown
            className={`w-5 h-5 text-secondary-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
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
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={`
                    w-full px-4 py-3 text-left
                    flex items-center justify-between gap-2
                    transition-colors duration-150
                    ${
                      isSelected
                        ? 'bg-primary-50 text-primary-900'
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

