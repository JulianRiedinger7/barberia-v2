"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Service } from "@/lib/types";
import { subscribeToServices, addService, updateService, deleteService } from "@/lib/db/services";
import { ServiceDialog } from "@/components/admin/ServiceDialog";

export default function ServicesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = subscribeToServices((data) => {
            setServices(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (serviceData: Omit<Service, "id">) => {
        if (editingService) {
            await updateService(editingService.id, serviceData);
        } else {
            await addService(serviceData);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar el servicio "${name}"?`)) {
            await deleteService(id);
        }
    };

    const handleNew = () => {
        setEditingService(undefined);
        setIsDialogOpen(true);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif font-bold text-foreground">Servicios</h2>
                <button
                    onClick={handleNew}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Servicio
                </button>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-lg">
                <Search size={20} className="text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar servicio..."
                    className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Nombre</th>
                            <th className="p-4 font-medium text-muted-foreground">Categoría</th>
                            <th className="p-4 font-medium text-muted-foreground">Duración</th>
                            <th className="p-4 font-medium text-muted-foreground">Precio</th>
                            <th className="p-4 font-medium text-muted-foreground">Estado</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No se encontraron servicios.
                                </td>
                            </tr>
                        ) : filteredServices.map((service) => (
                            <tr key={service.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="p-4 font-medium">{service.name}</td>
                                <td className="p-4">
                                    <span className="bg-secondary px-2 py-1 rounded text-xs font-medium text-muted-foreground border border-border">
                                        {service.category}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground">{service.duration} min</td>
                                <td className="p-4 font-mono font-bold text-primary">${service.price.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${service.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {service.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id, service.name)}
                                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-secondary rounded transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ServiceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                initialData={editingService}
            />
        </div>
    );
}
