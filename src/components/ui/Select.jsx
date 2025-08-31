import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  description,
  error,
  disabled = false,
  required = false,
  loading = false,
  multiple = false,
  searchable = false,
  clearable = false,
  id,
  name,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRef = useRef(null);

  const filteredOptions = searchable && searchTerm
    ? options?.filter(option => 
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : options;

  const selectedOptions = multiple 
    ? options?.filter(option => Array.isArray(value) && value?.includes(option?.value))
    : options?.find(option => option?.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef?.current && !selectRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef?.current) {
      searchInputRef?.current?.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(-1);
    }
  };

  const handleOptionClick = (option) => {
    if (option?.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues?.includes(option?.value)
        ? currentValues?.filter(v => v !== option?.value)
        : [...currentValues, option?.value];
      onChange(newValues);
    } else {
      onChange(option?.value);
      setIsOpen(false);
      setSearchTerm('');
    }
    setFocusedIndex(-1);
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    onChange(multiple ? [] : '');
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e?.key) {
      case 'Enter':
        e?.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && filteredOptions?.[focusedIndex]) {
          handleOptionClick(filteredOptions?.[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e?.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions?.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e?.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions?.length - 1
          );
        }
        break;
      case ' ':
        if (!searchable) {
          e?.preventDefault();
          handleToggle();
        }
        break;
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (!Array.isArray(value) || value?.length === 0) return placeholder;
      if (value?.length === 1) {
        const option = options?.find(opt => opt?.value === value?.[0]);
        return option ? option?.label : placeholder;
      }
      return `${value?.length} selected`;
    } else {
      const option = options?.find(opt => opt?.value === value);
      return option ? option?.label : placeholder;
    }
  };

  const hasValue = multiple 
    ? Array.isArray(value) && value?.length > 0
    : value !== '' && value !== null && value !== undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`
            relative w-full min-h-[2.5rem] px-3 py-2 text-left bg-input border border-border rounded-md shadow-sm cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
            ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : 'hover:border-border-hover'}
            ${error ? 'border-error focus:ring-error focus:border-error' : ''}
            ${isOpen ? 'ring-2 ring-ring border-ring' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center min-w-0">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  {multiple && Array.isArray(value) && value?.length > 1 ? (
                    <div className="flex flex-wrap gap-1">
                      {value?.slice(0, 2)?.map(val => {
                        const option = options?.find(opt => opt?.value === val);
                        return option ? (
                          <span
                            key={val}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                          >
                            {option?.label}
                          </span>
                        ) : null;
                      })}
                      {value?.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{value?.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className={hasValue ? 'text-foreground' : 'text-muted-foreground'}>
                      {getDisplayValue()}
                    </span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              {clearable && hasValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-muted rounded-sm transition-colors"
                  tabIndex={-1}
                >
                  <Icon name="X" size={14} className="text-muted-foreground" />
                </button>
              )}
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-modal max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>
            )}
            
            <div className="overflow-y-auto max-h-48" ref={optionsRef}>
              {filteredOptions?.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions?.map((option, index) => {
                  const isSelected = multiple 
                    ? Array.isArray(value) && value?.includes(option?.value)
                    : value === option?.value;
                  const isFocused = index === focusedIndex;
                  
                  return (
                    <div
                      key={option?.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleOptionClick(option)}
                      className={`
                        relative px-3 py-2 cursor-pointer select-none
                        ${option?.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}
                        ${isFocused ? 'bg-muted' : ''}
                        ${isSelected ? 'bg-primary/10 text-primary' : 'text-popover-foreground'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {option?.label}
                          </div>
                          {option?.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {option?.description}
                            </div>
                          )}
                        </div>
                        
                        {isSelected && (
                          <Icon 
                            name={multiple ? "Check" : "Check"} 
                            size={16} 
                            className="text-primary ml-2 flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Select;