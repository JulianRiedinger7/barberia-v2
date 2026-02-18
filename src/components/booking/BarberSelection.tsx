import Image from "next/image";
import { Member } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star, Check } from "lucide-react";

interface BarberSelectionProps {
    staff: Member[];
    selectedStaffId: string | null;
    onSelect: (staffId: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function BarberSelection({ staff, selectedStaffId, onSelect, onNext, onBack }: BarberSelectionProps) {
    if (staff.length === 0) {
        return <div className="text-center text-gray-500 py-10">Cargando profesionales...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => {
                    const isSelected = selectedStaffId === member.id;

                    return (
                        <button
                            key={member.id}
                            onClick={() => onSelect(member.id)}
                            className={cn(
                                "group relative flex items-center gap-4 text-left p-4 rounded-xl border transition-all duration-300 w-full",
                                isSelected
                                    ? "bg-zinc-800/80 border-primary shadow-[0_0_20px_rgba(242,185,13,0.15)] scale-[1.02]"
                                    : "bg-zinc-900/50 border-white/10 hover:border-primary/50 hover:bg-zinc-800/50"
                            )}
                        >
                            <div className={cn(
                                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                isSelected ? "border-primary" : "border-white/10 group-hover:border-primary/50"
                            )}>
                                <Image
                                    src={member.image || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"}
                                    alt={member.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className={cn(
                                    "text-lg font-bold font-serif transition-colors",
                                    isSelected ? "text-primary" : "text-white"
                                )}>
                                    {member.name}
                                </h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                                    {member.role}
                                </p>

                                <div className="flex items-center gap-1 text-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={i < (member.rating || 5) ? "fill-primary" : "fill-transparent text-zinc-700"}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Selection Check */}
                            {isSelected && (
                                <div className="absolute top-4 right-4 bg-primary text-black rounded-full p-1 animate-in zoom-in spin-in-180 duration-300">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between pt-8 border-t border-white/5">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded text-gray-400 hover:text-white transition-colors"
                >
                    Volver
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedStaffId}
                    className={cn(
                        "px-8 py-3 rounded font-bold uppercase tracking-widest transition-all",
                        selectedStaffId
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
