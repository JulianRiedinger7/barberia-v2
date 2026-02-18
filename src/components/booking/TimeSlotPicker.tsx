"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfDay, isSameDay, setHours, setMinutes, addMinutes, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getAppointmentsForBarber } from "@/lib/db/appointments";
import { Appointment } from "@/lib/types";

interface TimeSlotPickerProps {
    selectedDate: Date | null;
    selectedTime: string | null;
    onSelectDate: (date: Date) => void;
    onSelectTime: (time: string) => void;
    onNext: () => void;
    onBack: () => void;
    barberId: string;
    serviceDuration: number;
}

export default function TimeSlotPicker({
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime,
    onNext,
    onBack,
    barberId,
    serviceDuration
}: TimeSlotPickerProps) {
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [weekStart, setWeekStart] = useState(startOfDay(new Date()));

    // Generate next 14 days
    const days = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

    // Calculate slots when date/barber changes
    useEffect(() => {
        if (!selectedDate || !barberId) return;

        const fetchAvailability = async () => {
            setLoading(true);
            try {
                // 1. Get existing appointments
                const appointments = await getAppointmentsForBarber(barberId, selectedDate);

                // 2. Generate all possible slots (10:00 to 20:00)
                const slots: string[] = [];
                let currentTime = setMinutes(setHours(selectedDate, 10), 0); // Start at 10:00
                const endTime = setMinutes(setHours(selectedDate, 20), 0);   // End at 20:00

                const now = new Date();

                while (currentTime < endTime) {
                    const slotTimeStr = format(currentTime, "HH:mm");

                    // Check if slot is in the past (if today)
                    if (isSameDay(currentTime, now) && isBefore(currentTime, now)) {
                        currentTime = addMinutes(currentTime, 30); // Increment 30 mins
                        continue;
                    }

                    // Check conflict with existing appointments
                    const isOccupied = appointments.some(app => {
                        const appStart = app.date;
                        const appEnd = addMinutes(app.date, app.duration);
                        const slotEnd = addMinutes(currentTime, serviceDuration);

                        // Check overlap
                        return (
                            (currentTime >= appStart && currentTime < appEnd) || // Slot starts inside app
                            (slotEnd > appStart && slotEnd <= appEnd) ||       // Slot ends inside app
                            (currentTime <= appStart && slotEnd >= appEnd)     // Slot encloses app
                        );
                    });

                    if (!isOccupied) {
                        slots.push(slotTimeStr);
                    }

                    currentTime = addMinutes(currentTime, 30); // Increment 30 mins
                }

                setAvailableSlots(slots);
            } catch (error) {
                console.error("Error fetching availability:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [selectedDate, barberId, serviceDuration]);

    // Handle initial date selection if none
    useEffect(() => {
        if (!selectedDate) {
            onSelectDate(days[0]);
        }
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Date Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <CalendarIcon size={18} className="text-primary" />
                        Selecciona el Día
                    </h3>
                </div>

                <div className="relative group">
                    <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide px-1">
                        {days.map((date) => {
                            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                            const isToday = isSameDay(date, new Date());

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => onSelectDate(date)}
                                    className={cn(
                                        "flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 snap-start",
                                        isSelected
                                            ? "bg-primary border-primary text-black shadow-[0_0_15px_rgba(242,185,13,0.4)] scale-105"
                                            : "bg-zinc-900/50 border-white/10 text-gray-400 hover:border-primary/50 hover:text-white"
                                    )}
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest mb-1">
                                        {isToday ? "HOY" : format(date, "EEE", { locale: es })}
                                    </span>
                                    <span className={cn(
                                        "text-2xl font-bold font-serif",
                                        isSelected ? "text-black" : "text-white"
                                    )}>
                                        {format(date, "d")}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-80 mt-1">
                                        {format(date, "MMM", { locale: es })}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
                <div className="flex items-center px-2">
                    <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        Horarios Disponibles
                    </h3>
                </div>

                {loading ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                        Buscando horarios...
                    </div>
                ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {availableSlots.map((time) => {
                            const isSelected = selectedTime === time;

                            return (
                                <button
                                    key={time}
                                    onClick={() => onSelectTime(time)}
                                    className={cn(
                                        "py-3 rounded-lg border text-sm font-bold tracking-wider transition-all duration-200",
                                        isSelected
                                            ? "bg-primary border-primary text-black shadow-[0_0_10px_rgba(242,185,13,0.3)]"
                                            : "bg-transparent border-white/20 text-white hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-zinc-900/30 rounded-xl border border-white/5 border-dashed">
                        <Clock size={32} className="mb-3 opacity-50" />
                        <p>No hay horarios disponibles para esta fecha.</p>
                        <p className="text-sm mt-1">Intenta seleccionar otro día.</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-8 border-t border-white/5">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded text-gray-400 hover:text-white transition-colors"
                >
                    Volver
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedTime || !selectedDate}
                    className={cn(
                        "px-8 py-3 rounded font-bold uppercase tracking-widest transition-all",
                        selectedTime && selectedDate
                            ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                            : "bg-zinc-800 text-gray-600 cursor-not-allowed"
                    )}
                >
                    Siguiente Paso
                </button>
            </div>
        </div>
    );
}
