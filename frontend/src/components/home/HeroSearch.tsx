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
    type: string;
}

export default function HeroSearch() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'rent' | 'sale'>('rent');
    const [params, setParams] = useState<SearchParams>({
        location: '',
        dateRange: [null, null],
        guests: { adults: 1, children: 0 },
        type: 'all'
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
        if (params.type !== 'all') searchParams.append('type', params.type);
        searchParams.append('listingType', activeTab === 'rent' ? 'rent' : 'sale');

        if (startDate) searchParams.append('checkIn', startDate.toISOString());
        if (endDate) searchParams.append('checkOut', endDate.toISOString());
        searchParams.append('guests', (params.guests.adults + params.guests.children).toString());

        router.push(`/properties?${searchParams.toString()}`);
    };

    const locations = [
        'Saidia Marina',
        'Blue Pearl',
        'Golf Resort',
        'Beach Front'
    ];

    return (
        <div className="w-full max-w-5xl mx-auto" ref={dropdownRef}>
            {/* Tabs */}
            <div className="flex justify-center mb-6">
                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full inline-flex">
                    <button
                        onClick={() => setActiveTab('rent')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'rent'
                                ? 'bg-white text-primary-900 shadow-md transform scale-105'
                                : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Stays
                    </button>
                    <button
                        onClick={() => setActiveTab('sale')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'sale'
                                ? 'bg-white text-primary-900 shadow-md transform scale-105'
                                : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Buy
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-luxury-xl p-2 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">

                    {/* Location */}
                    <div className="md:col-span-4 relative group">
                        <div
                            className={`h-full px-6 py-4 rounded-xl transition-colors cursor-pointer flex items-center gap-4 ${activeDropdown === 'location' ? 'bg-secondary-50' : 'hover:bg-secondary-50'
                                }`}
                            onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                        >
                            <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                                <LuMapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-0.5">Location</p>
                                <p className="text-sm font-medium text-secondary-900 truncate">
                                    {params.location || 'Where to?'}
                                </p>
                            </div>
                        </div>

                        {/* Location Dropdown */}
                        {activeDropdown === 'location' && (
                            <div className="absolute top-full left-0 w-full md:w-[320px] bg-white rounded-xl shadow-luxury-lg mt-2 p-4 animate-fade-in-up z-50 border border-secondary-100">
                                <p className="text-xs font-semibold text-secondary-400 mb-3 px-2">POPULAR LOCATIONS</p>
                                <div className="space-y-1">
                                    {locations.map((loc) => (
                                        <button
                                            key={loc}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary-50 rounded-lg transition-colors text-left"
                                            onClick={() => {
                                                setParams({ ...params, location: loc });
                                                setActiveDropdown(null);
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-500">
                                                <LuMapPin className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-secondary-700 font-medium">{loc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block w-px bg-secondary-100 my-2" />

                    {/* Date Picker */}
                    <div className="md:col-span-4 relative">
                        <div
                            className={`h-full px-6 py-4 rounded-xl transition-colors cursor-pointer flex items-center gap-4 ${activeDropdown === 'dates' ? 'bg-secondary-50' : 'hover:bg-secondary-50'
                                }`}
                            onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
                        >
                            <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                                <LuCalendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-0.5">
                                    {activeTab === 'sale' ? 'Viewing Date' : 'Check in - Check out'}
                                </p>
                                <p className="text-sm font-medium text-secondary-900 truncate">
                                    {startDate ? (
                                        <>
                                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            {endDate && ` - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                        </>
                                    ) : (
                                        'Add dates'
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Date Dropdown */}
                        {activeDropdown === 'dates' && (
                            <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto bg-white rounded-xl shadow-luxury-lg mt-2 p-4 animate-fade-in-up z-50 border border-secondary-100">
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

                    <div className="hidden md:block w-px bg-secondary-100 my-2" />

                    {/* Guests */}
                    <div className="md:col-span-3 relative">
                        <div
                            className={`h-full px-6 py-4 rounded-xl transition-colors cursor-pointer flex items-center gap-4 ${activeDropdown === 'guests' ? 'bg-secondary-50' : 'hover:bg-secondary-50'
                                }`}
                            onClick={() => setActiveDropdown(activeDropdown === 'guests' ? null : 'guests')}
                        >
                            <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                                <LuUsers className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-0.5">Guests</p>
                                <p className="text-sm font-medium text-secondary-900 truncate">
                                    {params.guests.adults + params.guests.children} Guests
                                </p>
                            </div>
                        </div>

                        {/* Guests Dropdown */}
                        {activeDropdown === 'guests' && (
                            <div className="absolute top-full right-0 w-full md:w-[300px] bg-white rounded-xl shadow-luxury-lg mt-2 p-6 animate-fade-in-up z-50 border border-secondary-100">
                                <div className="space-y-6">
                                    {/* Adults */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-secondary-900">Adults</p>
                                            <p className="text-xs text-secondary-500">Ages 13 or above</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setParams({ ...params, guests: { ...params.guests, adults: Math.max(1, params.guests.adults - 1) } })}
                                                className={`p-2 rounded-full border ${params.guests.adults <= 1 ? 'border-secondary-100 text-secondary-300' : 'border-secondary-300 text-secondary-600 hover:border-secondary-400'}`}
                                                disabled={params.guests.adults <= 1}
                                            >
                                                <LuMinus className="w-4 h-4" />
                                            </button>
                                            <span className="w-4 text-center font-medium text-secondary-900">{params.guests.adults}</span>
                                            <button
                                                onClick={() => setParams({ ...params, guests: { ...params.guests, adults: params.guests.adults + 1 } })}
                                                className="p-2 rounded-full border border-secondary-300 text-secondary-600 hover:border-secondary-400"
                                            >
                                                <LuPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-secondary-900">Children</p>
                                            <p className="text-xs text-secondary-500">Ages 2-12</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setParams({ ...params, guests: { ...params.guests, children: Math.max(0, params.guests.children - 1) } })}
                                                className={`p-2 rounded-full border ${params.guests.children <= 0 ? 'border-secondary-100 text-secondary-300' : 'border-secondary-300 text-secondary-600 hover:border-secondary-400'}`}
                                                disabled={params.guests.children <= 0}
                                            >
                                                <LuMinus className="w-4 h-4" />
                                            </button>
                                            <span className="w-4 text-center font-medium text-secondary-900">{params.guests.children}</span>
                                            <button
                                                onClick={() => setParams({ ...params, guests: { ...params.guests, children: params.guests.children + 1 } })}
                                                className="p-2 rounded-full border border-secondary-300 text-secondary-600 hover:border-secondary-400"
                                            >
                                                <LuPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-2 hidden md:block z-30">
                <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                >
                    <LuSearch className="w-5 h-5" />
                    <span>Search</span>
                </button>
            </div>

            {/* Mobile Search Button */}
            <div className="md:hidden mt-4">
                <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-900 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-all"
                >
                    <LuSearch className="w-5 h-5" />
                    <span>Search Properties</span>
                </button>
            </div>
        </div>
    );
}
