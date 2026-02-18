"use client";

import { useState, useEffect } from "react";
import { Client } from "@/lib/types";
import { X } from "lucide-react";

interface ClientDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Omit<Client, "id">) => Promise<void>;
    initialData?: Client;
}

export function ClientDialog({ isOpen, onClose, onSave, initialData }: ClientDialogProps) {
    const [formData, setFormData] = useState<Omit<Client, "id">>({
        fullName: "",
        email: "",
        phone: "",
        notes: "",
        totalSpent: 0,
        lastVisit: new Date(),
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName,
                email: initialData.email,
                phone: initialData.phone,
                notes: initialData.notes || "",
                totalSpent: initialData.totalSpent,
                lastVisit: initialData.lastVisit || new Date(),
            });
        } else {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                notes: "",
                totalSpent: 0,
                lastVisit: new Date(),
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
            console.error("Error saving client:", error);
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
                    {initialData ? "Editar Cliente" : "Nuevo Cliente"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Teléfono</label>
                        <input
                            type="tel"
                            required
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notas</label>
                        <textarea
                            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 outline-none focus:border-primary resize-none h-20"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Hidden fields for manual entry, can serve as 'initial' values */}
                    <input type="hidden" value={formData.totalSpent} />

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
