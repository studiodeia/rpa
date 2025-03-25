import React from 'react';
import { Input } from './Input';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  disabled = false,
}) => {
  // Formatar datas para o formato de entrada HTML
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Converter string de entrada para objeto Date
  const parseInputDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data inicial
        </label>
        <Input
          type="date"
          value={formatDateForInput(startDate)}
          onChange={(e) => onStartDateChange(parseInputDate(e.target.value))}
          min={minDate ? formatDateForInput(minDate) : undefined}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          disabled={disabled}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data final
        </label>
        <Input
          type="date"
          value={formatDateForInput(endDate)}
          onChange={(e) => onEndDateChange(parseInputDate(e.target.value))}
          min={startDate ? formatDateForInput(startDate) : minDate ? formatDateForInput(minDate) : undefined}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          disabled={disabled}
        />
      </div>
    </div>
  );
};