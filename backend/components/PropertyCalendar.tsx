'use client';

import { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-day-picker/src/style.css';

interface Property {
  id: string;
  title: string;
  price: number;
  [key: string]: any;
}

interface BlockedDate {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface SelectedDates {
  startDate: Date;
  endDate: Date;
  nights: number;
  totalPrice: number;
}

interface PropertyCalendarProps {
  property: Property;
  onDatesSelected: (dates: SelectedDates | null) => void;
}

export default function PropertyCalendar({ property, onDatesSelected }: PropertyCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blocked dates and reservations
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch blocked dates
        const blockedResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blocked-dates/property/${property.id}`
        );

        // Fetch existing reservations
        const reservationsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/property/${property.id}`
        );

        if (!blockedResponse.ok || !reservationsResponse.ok) {
          throw new Error('Failed to fetch availability data');
        }

        const blockedData = await blockedResponse.json();
        const reservationsData = await reservationsResponse.json();

        // Convert blocked dates to Date objects
        const blocked: Date[] = [];

        if (blockedData.success && blockedData.data) {
          blockedData.data.forEach((block: BlockedDate) => {
            const start = new Date(block.startDate);
            const end = new Date(block.endDate);

            // Add all dates in the range
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              blocked.push(new Date(d));
            }
          });
        }

        // Convert reservation dates to Date objects (only PENDING and CONFIRMED)
        if (reservationsData.success && reservationsData.data) {
          reservationsData.data.forEach((reservation: Reservation) => {
            if (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') {
              const start = new Date(reservation.startDate);
              const end = new Date(reservation.endDate);

              // Add all dates in the range
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                blocked.push(new Date(d));
              }
            }
          });
        }

        setBlockedDates(blocked);
      } catch (err) {
        console.error('Error fetching dates:', err);
        setError('Impossible de charger les dates disponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchUnavailableDates();
  }, [property.id]);

  // Check if a date range contains any blocked dates
  const isRangeBlocked = (from: Date, to: Date): boolean => {
    const start = startOfDay(from);
    const end = startOfDay(to);

    // Check each date in the range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDate = startOfDay(new Date(d));

      // Check if this date is in the blocked dates list
      const isBlocked = blockedDates.some(blockedDate =>
        startOfDay(blockedDate).getTime() === currentDate.getTime()
      );

      if (isBlocked) {
        return true;
      }
    }

    return false;
  };

  // Handle date range selection with validation
  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      setRange(undefined);
      return;
    }

    // If both dates are selected, validate the range
    if (selectedRange.from && selectedRange.to) {
      if (isRangeBlocked(selectedRange.from, selectedRange.to)) {
        // Range contains blocked dates - reject selection
        setRange(undefined);
        alert('La période sélectionnée contient des dates bloquées. Veuillez choisir une autre période.');
        return;
      }
    }

    // Range is valid or only one date selected
    setRange(selectedRange);
  };

  // Handle date range selection for parent component
  useEffect(() => {
    if (range?.from && range?.to) {
      const nights = differenceInDays(range.to, range.from);
      const totalPrice = nights * property.price;

      onDatesSelected({
        startDate: range.from,
        endDate: range.to,
        nights,
        totalPrice,
      });
    } else {
      onDatesSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, property.price]);

  // Disable dates
  const disabledDays = [
    { before: new Date() }, // Disable past dates
    ...blockedDates, // Disable blocked dates and reservations
  ];

  // Calculate display values
  const nights = range?.from && range?.to
    ? differenceInDays(range.to, range.from)
    : 0;
  const totalPrice = nights * property.price;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="text-center mb-4 pb-2 border-b border-gray-100">
        <p className="text-lg font-bold text-blue-600">
          {property.price.toLocaleString('fr-MA')} DH <span className="text-sm text-gray-500 font-normal">/ nuit</span>
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[320px]">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            disabled={disabledDays}
            modifiers={{
              blocked: blockedDates,
            }}
            modifiersClassNames={{
              blocked: "blocked-date",
            }}
            locale={fr}
            numberOfMonths={1}
            fixedWeeks
            showOutsideDays={false}
            classNames={{
              months: "w-full",
              month: "w-full space-y-1",
              caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-sm font-bold text-gray-800",
              nav: "flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center border rounded-md transition-all",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full",
              head_row: "mb-2",
              head_cell: "text-gray-400 font-semibold text-[10px] uppercase text-center p-1",
              row: "w-full",
              cell: "p-0 relative text-center",
              day: "w-full h-full p-0 font-normal flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-sm",
              day_range_start: "!bg-blue-600 !text-white !rounded-lg",
              day_range_end: "!bg-blue-600 !text-white !rounded-lg",
              day_range_middle: "!bg-blue-50 !text-blue-700 !rounded-none",
              day_selected: "bg-blue-600 text-white",
              day_today: "border border-blue-200 text-blue-600 font-bold",
              day_outside: "text-gray-300 opacity-50",
              day_disabled: "text-gray-200 opacity-30 line-through cursor-not-allowed hover:bg-transparent",
              day_hidden: "invisible",
            }}
          />
        </div>
      </div>

      {/* Compact Price Summary */}
      {range?.from && range?.to && nights > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{nights} nuit{nights > 1 ? 's' : ''}</span>
            <span>{property.price.toLocaleString('fr-MA')} × {nights}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-blue-600">
              {totalPrice.toLocaleString('fr-MA')} DH
            </span>
          </div>
        </div>
      )}

      {/* Compact Legend */}
      <div className="mt-3 pt-2 border-t border-gray-200 flex justify-around text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Sélectionné</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded opacity-30"></div>
          <span>Indisponible</span>
        </div>
      </div>
    </div>
  );
}
