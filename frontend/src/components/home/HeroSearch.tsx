'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LuMapPin, LuCalendar, LuUsers, LuSearch, LuMinus, LuPlus } from 'react-icons/lu';

interface SearchParams {
    location: string;
    dateRange: [Date | null, Date | null];
    guests: {
        adults: number;
        children: number;
    };
}

const propertyTypes = ['Homes', 'Villas', 'Apartments', 'Resorts', 'Cottages'];

export default function HeroSearch() {
    const router = useRouter();
    const [activeType, setActiveType] = useState('Homes');
    const [params, setParams] = useState<SearchParams>({
        location: '',
        dateRange: [null, null],
        guests: { adults: 1, children: 0 },
    });

    const [startDate, endDate] = params.dateRange;
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        const searchParams = new URLSearchParams();
        if (params.location) searchParams.append('location', params.location);
        if (startDate) searchParams.append('checkIn', startDate.toISOString());
        if (endDate) searchParams.append('checkOut', endDate.toISOString());
        searchParams.append('guests', (params.guests.adults + params.guests.children).toString());
        router.push(`/properties?${searchParams.toString()}`);
    };

    const locations = ['Saidia Marina', 'Blue Pearl', 'Golf Resort', 'Beach Front'];

    return (
        <div className="w-full" ref={dropdownRef}>
            {/* Property Type Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm font-medium text-secondary-500 mr-2 self-center">Filter:</span>
                {propertyTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeType === type
                                ? 'bg-secondary-900 text-white border-secondary-900'
                                : 'bg-white text-secondary-700 border-secondary-200 hover:border-secondary-400'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Location */}
                <div className="md:col-span-4 relative">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Location</label>
                    <div
                        className="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl cursor-pointer hover:bg-secondary-100 transition-colors"
                        onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                    >
                        <LuMapPin className="w-5 h-5 text-secondary-400" />
                        <span className={`text-sm ${params.location ? 'text-secondary-900' : 'text-secondary-400'}`}>
                            {params.location || 'Find location'}
                        </span>
                    </div>

                    {activeDropdown === 'location' && (
                        <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-lg mt-2 p-3 z-50 border border-secondary-100">
                            {locations.map((loc) => (
                                <button
                                    key={loc}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-50 rounded-lg transition-colors text-left"
                                    onClick={() => {
                                        setParams({ ...params, location: loc });
                                        setActiveDropdown(null);
                                    }}
                                >
                                    <LuMapPin className="w-4 h-4 text-secondary-400" />
                                    <span className="text-sm text-secondary-700">{loc}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date */}
                <div className="md:col-span-3 relative">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Check-in & Check-out</label>
                    <div
                        className="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl cursor-pointer hover:bg-secondary-100 transition-colors"
                        onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
                    >
                        <LuCalendar className="w-5 h-5 text-secondary-400" />
                        <span className={`text-sm ${startDate ? 'text-secondary-900' : 'text-secondary-400'}`}>
                            {startDate
                                ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${endDate ? ` - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}`
                                : 'Add dates'}
                        </span>
                    </div>

                    {activeDropdown === 'dates' && (
                        <div className="absolute top-full left-0 bg-white rounded-xl shadow-lg mt-2 p-4 z-50 border border-secondary-100">
                            <DatePicker
                                selected={startDate}
                                onChange={(update: [Date | null, Date | null]) => {
                                    setParams({ ...params, dateRange: update });
                                }}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                inline
                                minDate={new Date()}
                                monthsShown={2}
                            />
                        </div>
                    )}
                </div>

                {/* Guests */}
                <div className="md:col-span-3 relative">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Guests and Rooms</label>
                    <div
                        className="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl cursor-pointer hover:bg-secondary-100 transition-colors"
                        onClick={() => setActiveDropdown(activeDropdown === 'guests' ? null : 'guests')}
                    >
                        <LuUsers className="w-5 h-5 text-secondary-400" />
                        <span className="text-sm text-secondary-900">
                            {params.guests.adults + params.guests.children} guest{params.guests.adults + params.guests.children > 1 ? 's' : ''}, 1 room
                        </span>
                    </div>

                    {activeDropdown === 'guests' && (
                        <div className="absolute top-full right-0 w-[280px] bg-white rounded-xl shadow-lg mt-2 p-5 z-50 border border-secondary-100">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-secondary-900">Adults</p>
                                        <p className="text-xs text-secondary-500">Ages 13+</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setParams({ ...params, guests: { ...params.guests, adults: Math.max(1, params.guests.adults - 1) } })}
                                            className="w-8 h-8 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-600 hover:border-secondary-400 disabled:opacity-40"
                                            disabled={params.guests.adults <= 1}
                                        >
                                            <LuMinus className="w-4 h-4" />
                                        </button>
                                        <span className="w-4 text-center font-medium">{params.guests.adults}</span>
                                        <button
                                            onClick={() => setParams({ ...params, guests: { ...params.guests, adults: params.guests.adults + 1 } })}
                                            className="w-8 h-8 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-600 hover:border-secondary-400"
                                        >
                                            <LuPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-secondary-900">Children</p>
                                        <p className="text-xs text-secondary-500">Ages 2-12</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setParams({ ...params, guests: { ...params.guests, children: Math.max(0, params.guests.children - 1) } })}
                                            className="w-8 h-8 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-600 hover:border-secondary-400 disabled:opacity-40"
                                            disabled={params.guests.children <= 0}
                                        >
                                            <LuMinus className="w-4 h-4" />
                                        </button>
                                        <span className="w-4 text-center font-medium">{params.guests.children}</span>
                                        <button
                                            onClick={() => setParams({ ...params, guests: { ...params.guests, children: params.guests.children + 1 } })}
                                            className="w-8 h-8 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-600 hover:border-secondary-400"
                                        >
                                            <LuPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
                    <button
                        onClick={handleSearch}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary-900 text-white rounded-xl font-medium hover:bg-secondary-800 transition-colors"
                    >
                        <span>Search</span>
                        <LuSearch className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
