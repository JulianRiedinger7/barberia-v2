"use client";

import { useState, useEffect } from "react";
import { Appointment, Service, Member, Client } from "@/lib/types";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { subscribeToServices } from "@/lib/db/services";
import { subscribeToStaff } from "@/lib/db/staff";
import { subscribeToClients } from "@/lib/db/clients";

interface AppointmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointment: Omit<Appointment, "id">) => Promise<void>;
    initialData?: Appointment;
    selectedDate?: Date;
}

export function AppointmentDialog({ isOpen, onClose, onSave, initialData, selectedDate }: AppointmentDialogProps) {
    // Lists for dropdowns
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Member[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    // Loading states
    const [loadingLists, setLoadingLists] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form Data
    const [formData, setFormData] = useState<Partial<Appointment>>({
        clientName: "",
        serviceId: "",
        barberId: "",
        status: "pending",
    });

    // Separate date and time for inputs
    const [dateInput, setDateInput] = useState("");
    const [timeInput, setTimeInput] = useState("10:00");

    useEffect(() => {
        const unsubServices = subscribeToServices(setServices);
        const unsubStaff = subscribeToStaff(setStaff);
        const unsubClients = subscribeToClients(setClients);

        // Promise.all not needed for listeners, just waiting for data flow
        setLoadingLists(false);

        return () => {
            unsubServices();
            unsubStaff();
            unsubClients();
        };
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                clientName: initialData.clientName,
                serviceId: initialData.serviceId,
                barberId: initialData.barberId,
                status: initialData.status,
            });
            // Format date for inputs
            const d = initialData.date;
            setDateInput(d.toISOString().split('T')[0]);
            setTimeInput(d.toTimeString().slice(0, 5));
        } else {
            // Default new appointment
            const d = selectedDate || new Date();
            setDateInput(d.toISOString().split('T')[0]);
            setFormData({
                clientName: "",
                serviceId: "",
                barberId: "",
                status: "pending",
            });
        }
    }, [initialData, isOpen, selectedDate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Construct full Date object
            const fullDate = new Date(`${dateInput}T${timeInput}`);

            // Find names for denormalization (optional but good for display if needed)
            // For now adhering to type which uses IDs mainly, but clientName is string.

            await onSave({
                clientName: formData.clientName || "Cliente",
                serviceId: formData.serviceId || "",
                barberId: formData.barberId || "",
                date: fullDate,
                duration: 30, // Default or fetch from service
                status: formData.status as Appointment['status'],
            });
            onClose();
        } catch (error) {
            console.error("Error saving appointment:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Editar Turno" : "Nuevo Turno"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Client Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Cliente</label>
                        <input
                            list="clients-list"
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            placeholder="Nombre del cliente"
                            required
                        />
                        <datalist id="clients-list">
                            {clients.map(c => (
                                <option key={c.id} value={c.fullName} />
                            ))}
                        </datalist>
                    </div>

                    {/* Service Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Servicio</label>
                        <select
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.serviceId}
                            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Servicio</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                            ))}
                        </select>
                    </div>

                    {/* Barber Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Profesional</label>
                        <select
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.barberId}
                            onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Profesional</option>
                            {staff.map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-secondary/30 border border-border rounded-md pl-10 pr-3 py-2 outline-none focus:border-primary"
                                    value={dateInput}
                                    onChange={(e) => setDateInput(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hora</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="time"
                                    required
                                    className="w-full bg-secondary/30 border border-border rounded-md pl-10 pr-3 py-2 outline-none focus:border-primary"
                                    value={timeInput}
                                    onChange={(e) => setTimeInput(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <div className="flex gap-4">
                            {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={formData.status === status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="bg-secondary"
                                    />
                                    <span className="capitalize text-sm">{status === 'pending' ? 'Pendiente' : status === 'confirmed' ? 'Confirmado' : status === 'completed' ? 'Completado' : 'Cancelado'}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
