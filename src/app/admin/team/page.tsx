"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Star, Loader2 } from "lucide-react";
import { Member } from "@/lib/types";
import { subscribeToStaff, addStaffMember, updateStaffMember, deleteStaffMember } from "@/lib/db/staff";
import { StaffDialog } from "@/components/admin/StaffDialog";

export default function TeamPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [staff, setStaff] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = subscribeToStaff((data) => {
            setStaff(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (memberData: Omit<Member, "id">) => {
        if (editingMember) {
            await updateStaffMember(editingMember.id, memberData);
        } else {
            await addStaffMember(memberData);
        }
    };

    const handleEdit = (member: Member) => {
        setEditingMember(member);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
            await deleteStaffMember(id);
        }
    };

    const handleNew = () => {
        setEditingMember(undefined);
        setIsDialogOpen(true);
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h2 className="text-3xl font-serif font-bold text-foreground">Equipo</h2>
                <button
                    onClick={handleNew}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Nuevo Miembro
                </button>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-lg">
                <Search size={20} className="text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar miembro..."
                    className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground p-8">
                        No se encontraron miembros del equipo.
                    </div>
                ) : filteredStaff.map((member) => (
                    <div key={member.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group">
                        <div className="aspect-square w-full bg-secondary relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={member.image}
                                alt={member.name}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id, member.name)}
                                    className="p-3 bg-white text-black rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold">{member.name}</h3>
                                    <p className="text-sm text-primary font-medium">{member.role}</p>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                    <Star size={14} fill="currentColor" />
                                    {member.rating}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                {member.specialties.map((spec, index) => (
                                    <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground border border-border/50">
                                        {spec}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                                <span className={`flex items-center gap-1.5 ${member.active ? 'text-green-500' : 'text-red-500'}`}>
                                    <span className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {member.active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <StaffDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                initialData={editingMember}
            />
        </div>
    );
}
