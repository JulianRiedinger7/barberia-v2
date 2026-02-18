"use client";

import { useState, useEffect } from "react";
import { Member } from "@/lib/types";
import { X } from "lucide-react";

interface StaffDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (member: Omit<Member, "id">) => Promise<void>;
    initialData?: Member;
}

export function StaffDialog({ isOpen, onClose, onSave, initialData }: StaffDialogProps) {
    const [formData, setFormData] = useState<Omit<Member, "id">>({
        name: "",
        role: "Barbero",
        image: "/barbers/barber1.jpg", // Default placeholder
        rating: 5.0,
        specialties: [],
        active: true,
    });
    const [specialtiesInput, setSpecialtiesInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                role: initialData.role,
                image: initialData.image,
                rating: initialData.rating,
                specialties: initialData.specialties,
                active: initialData.active ?? true,
            });
            setSpecialtiesInput(initialData.specialties.join(", "));
        } else {
            setFormData({
                name: "",
                role: "Barbero",
                image: "/barbers/barber1.jpg",
                rating: 5.0,
                specialties: [],
                active: true,
            });
            setSpecialtiesInput("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const specialtiesArray = specialtiesInput
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);

            await onSave({ ...formData, specialties: specialtiesArray });
            onClose();
        } catch (error) {
            console.error("Error saving staff member:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    {initialData ? "Editar Miembro" : "Nuevo Miembro"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Rol</label>
                        <select
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Barbero">Barbero</option>
                            <option value="Estilista">Estilista</option>
                            <option value="Colorista">Colorista</option>
                            <option value="Recepcionista">Recepcionista</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Especialidades (separadas por coma)</label>
                        <input
                            type="text"
                            placeholder="Corte Clásico, Barba, Color..."
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={specialtiesInput}
                            onChange={(e) => setSpecialtiesInput(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">URL Imagen (Opcional)</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="rounded border-border bg-secondary/30"
                        />
                        <label htmlFor="active" className="text-sm font-medium">Activo</label>
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
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
