"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Service, Member } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Scissors, User, Phone, Mail, FileText, CheckCircle, Loader2 } from "lucide-react";

interface BookingSummaryProps {
    service: Service | undefined;
    barber: Member | undefined;
    date: Date | null;
    time: string | null;
    onBack: () => void;
    onConfirm: (customerData: CustomerData) => Promise<void>;
}

export interface CustomerData {
    name: string;
    phone: string;
    email: string;
    notes?: string;
}

export default function BookingSummary({
    service,
    barber,
    date,
    time,
    onBack,
    onConfirm
}: BookingSummaryProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CustomerData>({
        name: "",
        phone: "",
        email: "",
        notes: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onConfirm(formData);
        } catch (error) {
            console.error("Booking error:", error);
            setLoading(false);
        }
    };

    if (!service || !barber || !date || !time) {
        return <div>Faltan datos para la reserva.</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Resumen de la Reserva */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white border-b border-white/10 pb-4">
                        Resumen de la Cita
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Scissors size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Servicio</p>
                                <p className="text-white font-bold text-lg">{service.name}</p>
                                <p className="text-primary font-bold">
                                    ${service.price.toLocaleString("es-AR")}
                                    <span className="text-gray-500 text-sm font-normal ml-2">({service.duration} min)</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Profesional</p>
                                <p className="text-white font-bold text-lg">{barber.name}</p>
                                <p className="text-gray-400 text-sm">{barber.role}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Fecha y Hora</p>
                                <p className="text-white font-bold text-lg capitalize">
                                    {format(date, "EEEE d 'de' MMMM", { locale: es })}
                                </p>
                                <p className="text-primary font-bold text-xl flex items-center gap-2">
                                    <Clock size={16} />
                                    {time} HS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario de Datos */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-white mb-2">
                            Tus Datos
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Completa tus datos para confirmar la reserva.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Nombre Completo *
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    Teléfono *
                                </label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                        placeholder="11 1234 5678"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                        placeholder="juan@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Notas Adicionales
                            </label>
                            <div className="relative">
                                <FileText size={16} className="absolute left-4 top-3 text-gray-500" />
                                <textarea
                                    rows={3}
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-gray-700"
                                    placeholder="Alguna preferencia o detalle..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-6 py-4 rounded-xl text-gray-400 hover:text-white border border-transparent hover:border-white/10 transition-all"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.name || !formData.phone || !formData.email}
                                className="flex-1 bg-primary text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(242,185,13,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Confirmando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} className="stroke-[2.5]" />
                                        Confirmar Reserva
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
