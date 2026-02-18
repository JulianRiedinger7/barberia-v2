import { Service } from "@/lib/types";
import { Scissors, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSelectionProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelect: (serviceId: string) => void;
    onNext: () => void;
}

export default function ServiceSelection({ services, selectedServiceId, onSelect, onNext }: ServiceSelectionProps) {
    if (services.length === 0) {
        return <div className="text-center text-gray-500 py-10">Cargando servicios...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => {
                    const isSelected = selectedServiceId === service.id;

                    return (
                        <button
                            key={service.id}
                            onClick={() => onSelect(service.id)}
                            className={cn(
                                "group relative flex flex-col items-start text-left p-6 rounded-xl border transition-all duration-300 w-full",
                                isSelected
                                    ? "bg-zinc-800/80 border-primary shadow-[0_0_20px_rgba(242,185,13,0.15)] scale-[1.02]"
                                    : "bg-zinc-900/50 border-white/10 hover:border-primary/50 hover:bg-zinc-800/50"
                            )}
                        >
                            <div className="flex justify-between w-full mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                                    isSelected ? "bg-primary text-black" : "bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/20"
                                )}>
                                    <Scissors size={24} />
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "block text-xl font-bold font-serif tracking-wide",
                                        isSelected ? "text-primary" : "text-white"
                                    )}>
                                        ${service.price.toLocaleString("es-AR")}
                                    </span>
                                </div>
                            </div>

                            <h3 className={cn(
                                "text-lg font-bold mb-2 transition-colors",
                                isSelected ? "text-white" : "text-gray-200 group-hover:text-white"
                            )}>
                                {service.name}
                            </h3>

                            <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                                {service.description || "Un servicio de excelente calidad realizado por profesionales."}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mt-auto pt-4 border-t border-white/5 w-full">
                                <Clock size={14} className="text-primary" />
                                <span>{service.duration} Minutos</span>
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn(
                                "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-all",
                                isSelected ? "border-primary bg-primary" : "border-gray-600 bg-transparent group-hover:border-primary/50"
                            )} />
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-end pt-8 border-t border-white/5">
                <button
                    onClick={onNext}
                    disabled={!selectedServiceId}
                    className={cn(
                        "px-8 py-3 rounded font-bold uppercase tracking-widest transition-all",
                        selectedServiceId
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
