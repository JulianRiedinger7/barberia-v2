"use client";

import { CheckCircle, Calendar, Clock, MapPin, Home } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BookingSuccessProps {
    date: Date;
    time: string;
}

export default function BookingSuccess({ date, time }: BookingSuccessProps) {
    return (
        <div className="text-center animate-in zoom-in duration-500 py-10 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle size={48} className="text-green-500 stroke-[1.5]" />
            </div>

            <h2 className="text-4xl font-serif font-bold text-white mb-2">
                ¡Reserva Confirmada!
            </h2>
            <p className="text-gray-400 text-lg mb-8">
                Te esperamos en Barbería Tradicional.
            </p>

            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Calendar size={24} className="text-primary mb-1" />
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Fecha</span>
                        <span className="text-white font-bold text-lg capitalize">
                            {format(date, "EEEE d 'de' MMMM", { locale: es })}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0">
                        <Clock size={24} className="text-primary mb-1" />
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Hora</span>
                        <span className="text-white font-bold text-lg">
                            {time} HS
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <MapPin size={24} className="text-primary mb-1" />
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Ubicación</span>
                        <span className="text-white font-bold text-lg">
                            Av. Siempreviva 123
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all"
                >
                    <Home size={18} />
                    Volver al Inicio
                </Link>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-primary/50 text-gray-400 hover:text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all"
                >
                    Imprimir Comprobante
                </button>
            </div>
        </div>
    );
}
