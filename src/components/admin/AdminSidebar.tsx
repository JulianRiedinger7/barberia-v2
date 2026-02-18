"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    CalendarDays,
    Scissors,
    Users,
    UserCircle,
    DollarSign,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Agenda", href: "/admin/agenda", icon: CalendarDays },
        { name: "Servicios", href: "/admin/services", icon: Scissors },
        { name: "Equipo", href: "/admin/team", icon: Users },
        { name: "Clientes", href: "/admin/clients", icon: UserCircle },
        { name: "Finanzas", href: "/admin/finance", icon: DollarSign },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 rounded-md text-white border border-white/10 shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/80 z-30 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full w-72 bg-[#050505] border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-24 flex items-center px-8 border-b border-white/10 bg-[#050505]">
                    <div className="flex items-center gap-3">
                        <Scissors className="text-primary w-6 h-6 transform -rotate-45" />
                        <h1 className="text-lg font-serif font-bold text-white tracking-[0.15em] uppercase">
                            <span className="text-primary">Admin</span> Panel
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "text-black bg-primary shadow-[0_0_15px_rgba(242,185,13,0.3)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-black" : "text-gray-500 group-hover:text-primary")} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 bg-[#050505]">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-bold tracking-widest uppercase text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
