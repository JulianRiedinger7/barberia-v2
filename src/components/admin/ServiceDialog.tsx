"use client";

import { useState, useEffect } from "react";
import { Service } from "@/lib/types";
import { X } from "lucide-react";

interface ServiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: Omit<Service, "id">) => Promise<void>;
    initialData?: Service;
}

export function ServiceDialog({ isOpen, onClose, onSave, initialData }: ServiceDialogProps) {
    const [formData, setFormData] = useState<Omit<Service, "id">>({
        name: "",
        category: "Cortes",
        price: 0,
        duration: 30,
        description: "",
        active: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                price: initialData.price,
                duration: initialData.duration,
                description: initialData.description || "",
                active: initialData.active,
            });
        } else {
            setFormData({
                name: "",
                category: "Cortes",
                price: 0,
                duration: 30,
                description: "",
                active: true,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Error saving service:", error);
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
                    {initialData ? "Editar Servicio" : "Nuevo Servicio"}
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
                        <label className="block text-sm font-medium mb-1">Categoría</label>
                        <select
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as Service["category"] })}
                        >
                            <option value="Cortes">Cortes</option>
                            <option value="Barba">Barba</option>
                            <option value="Combos">Combos</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Precio ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Duración (min)</label>
                            <input
                                type="number"
                                required
                                min="5"
                                step="5"
                                className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
                        <textarea
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary resize-none h-20"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        <label htmlFor="active" className="text-sm font-medium">Servicio Activo</label>
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
