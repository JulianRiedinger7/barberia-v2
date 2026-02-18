"use client";

import { useState } from "react";
import { addService } from "@/lib/db/services";
import { addStaffMember } from "@/lib/db/staff";
import { addClient } from "@/lib/db/clients";
import { Loader2 } from "lucide-react";

export function DatabaseSeeder() {
    const [loading, setLoading] = useState(false);
    const [seeded, setSeed] = useState(false);

    const seedData = async () => {
        setLoading(true);
        try {
            // Seed Services
            await addService({
                name: "Corte Clásico",
                category: "Cortes",
                price: 15000,
                duration: 45,
                description: "Corte de cabello tradicional con tijera y máquina.",
                active: true
            });
            await addService({
                name: "Corte y Barba",
                category: "Combos",
                price: 25000,
                duration: 60,
                description: "Servicio completo de corte de cabello y perfilado de barba.",
                active: true
            });
            await addService({
                name: "Perfilado de Barba",
                category: "Barba",
                price: 12000,
                duration: 30,
                description: "Afeitado y perfilado de barba con toalla caliente.",
                active: true
            });

            // Seed Staff
            await addStaffMember({
                name: "Juan Pérez",
                role: "Master Barber",
                specialties: ["Cortes Clásicos", "Navaja"],
                rating: 5.0,
                image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?auto=format&fit=crop&q=80&w=200",
                active: true
            });
            await addStaffMember({
                name: "Carlos Rodríguez",
                role: "Barbero Senior",
                specialties: ["Degradados", "Diseños"],
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
                active: true
            });

            // Seed Clients
            await addClient({
                fullName: "Julián Riedinger",
                email: "julian@example.com",
                phone: "1122334455",
                totalSpent: 45000,
                notes: "Cliente frecuente, prefiere café.",
                lastVisit: new Date()
            });

            setSeed(true);
            alert("Base de datos poblada con éxito!");
            // Reload page to show data
            window.location.reload();

        } catch (error) {
            console.error("Error seeding database:", error);
            alert("Error al poblar la base de datos. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    if (seeded) return null;

    return (
        <button
            onClick={seedData}
            disabled={loading}
            className="fixed bottom-4 right-4 z-50 bg-yellow-500/20 text-yellow-600 border border-yellow-500/50 hover:bg-yellow-500/30 px-4 py-2 rounded-md flex items-center shadow-lg transition-colors font-medium text-sm"
        >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Poblar Base de Datos (Debug)
        </button>
    );
}
