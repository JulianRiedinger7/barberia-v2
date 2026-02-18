"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Clock, User, Scissors, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Appointment, Service, Member } from "@/lib/types";
import { subscribeToAppointments, addAppointment, updateAppointment, deleteAppointment } from "@/lib/db/appointments";
import { subscribeToServices } from "@/lib/db/services";
import { subscribeToStaff } from "@/lib/db/staff";
import { AppointmentDialog } from "@/components/admin/AppointmentDialog";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);

    // Cache services and staff for display
    const [servicesMap, setServicesMap] = useState<Record<string, string>>({});
    const [staffMap, setStaffMap] = useState<Record<string, string>>({});

    // Subscriptions
    useEffect(() => {
        // 1. Subscribe to appointments for selected date
        if (date) {
            setLoading(true);
            const unsubscribe = subscribeToAppointments(date, (data) => {
                setAppointments(data);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [date]);

    useEffect(() => {
        // 2. Load Metadata for display names
        const unsubServices = subscribeToServices((data) => {
            const map: Record<string, string> = {};
            data.forEach(s => map[s.id] = s.name);
            setServicesMap(map);
        });

        const unsubStaff = subscribeToStaff((data) => {
            const map: Record<string, string> = {};
            data.forEach(s => map[s.id] = s.name);
            setStaffMap(map);
        });

        return () => {
            unsubServices();
            unsubStaff();
        }
    }, []);


    const handleSave = async (data: Omit<Appointment, "id">) => {
        if (editingAppointment) {
            await updateAppointment(editingAppointment.id, data);
        } else {
            await addAppointment(data);
        }
    };

    const handleEdit = (apt: Appointment) => {
        setEditingAppointment(apt);
        setIsDialogOpen(true);
    };

    const handleNew = () => {
        setEditingAppointment(undefined);
        setIsDialogOpen(true);
    };

    // Status colors
    const statusColors = {
        pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        completed: "bg-green-500/10 text-green-500 border-green-500/20",
        cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const statusLabels = {
        pending: "Pendiente",
        confirmed: "Confirmado",
        completed: "Completado",
        cancelled: "Cancelado",
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide">AGENDA</h2>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Gestión de Turnos</p>
                </div>
                <div className="text-sm text-gray-400 font-medium bg-white/5 px-4 py-2 rounded border border-white/10">
                    {date?.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Calendar Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 sticky top-6 backdrop-blur-sm">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="flex justify-center"
                        />

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <button
                                onClick={handleNew}
                                className="w-full bg-primary text-black py-3 rounded-lg font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(242,185,13,0.2)] hover:shadow-[0_0_25px_rgba(242,185,13,0.4)]"
                            >
                                <Plus size={18} />
                                Nuevo Turno
                            </button>

                            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-400 font-medium">
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/5 text-yellow-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Pendiente
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/5 text-blue-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Confirmado
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/5 text-green-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Completado
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/5 text-red-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Cancelado
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900/30 border border-white/10 rounded-xl min-h-[600px] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <span className="font-bold text-white tracking-wide uppercase text-sm">Turnos Programados</span>
                            <span className="text-xs text-primary font-mono">{date?.toLocaleDateString()}</span>
                        </div>

                        <div className="p-4 space-y-3 flex-1">
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
                                    <CalendarIcon size={48} className="mb-4 opacity-20" />
                                    <p>No hay turnos para esta fecha.</p>
                                    <button onClick={handleNew} className="text-primary hover:underline mt-2 text-sm">Crear uno nuevo</button>
                                </div>
                            ) : (
                                appointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        onClick={() => handleEdit(apt)}
                                        className="flex flex-col sm:flex-row gap-6 p-6 rounded-lg bg-black/40 border border-white/5 hover:border-primary/30 hover:bg-black/60 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3 min-w-[100px] pl-2 border-l-2 border-primary/50">
                                            <Clock size={16} className="text-primary" />
                                            <span className="font-mono text-xl font-bold text-white">
                                                {apt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <h4 className="font-bold text-white text-lg tracking-wide">{apt.clientName}</h4>
                                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Scissors size={14} className="text-primary" />
                                                    {servicesMap[apt.serviceId] || 'Servicio desconocido'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-primary" />
                                                    {staffMap[apt.barberId] || 'Profesional desconocido'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between gap-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest",
                                                statusColors[apt.status]
                                            )}>
                                                {statusLabels[apt.status]}
                                            </span>
                                            <span className="text-xs text-primary font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                Editar <Scissors size={10} />
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AppointmentDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                initialData={editingAppointment}
                selectedDate={date}
            />
        </div>
    );
}
