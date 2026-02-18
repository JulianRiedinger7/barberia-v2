"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Mail, Phone, Calendar, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Client } from "@/lib/types";
import { subscribeToClients, addClient, updateClient, deleteClient } from "@/lib/db/clients";
import { ClientDialog } from "@/components/admin/ClientDialog";

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = subscribeToClients((data) => {
            setClients(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (clientData: Omit<Client, "id">) => {
        if (editingClient) {
            await updateClient(editingClient.id, clientData);
        } else {
            await addClient(clientData);
        }
    };

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
            await deleteClient(id);
        }
    };

    const handleNew = () => {
        setEditingClient(undefined);
        setIsDialogOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h2 className="text-3xl font-serif font-bold text-foreground">Clientes</h2>
                <button
                    onClick={handleNew}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Cliente
                </button>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            className="w-full bg-secondary/30 border border-border rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary">
                            Filtros
                        </button>
                        <button className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary">
                            Exportar
                        </button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Cliente</th>
                            <th className="p-4 font-medium text-muted-foreground">Contacto</th>
                            <th className="p-4 font-medium text-muted-foreground">Última Visita</th>
                            <th className="p-4 font-medium text-muted-foreground">Total Gastado</th>
                            <th className="p-4 font-medium text-muted-foreground">Notas</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No se encontraron clientes.
                                </td>
                            </tr>
                        ) : filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-foreground">{client.fullName}</div>
                                    <div className="text-xs text-muted-foreground">ID: #{client.id.slice(0, 8)}</div>
                                </td>
                                <td className="p-4 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} />
                                        {client.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone size={14} />
                                        {client.phone}
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-muted-foreground" />
                                        {client.lastVisit ? client.lastVisit.toLocaleDateString() : 'N/A'}
                                    </div>
                                </td>
                                <td className="p-4 font-mono font-medium text-primary">
                                    ${client.totalSpent.toLocaleString()}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground italic max-w-xs truncate">
                                    {client.notes || "-"}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id, client.fullName)}
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

                <div className="p-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
                    <span>Mostrando {filteredClients.length} de {clients.length} clientes</span>
                </div>
            </div>

            <ClientDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                initialData={editingClient}
            />
        </div>
    );
}
