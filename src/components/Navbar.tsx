"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Nosotros", href: "/about" },
        { name: "Servicios", href: "/services" },
        { name: "Galería", href: "/gallery" },
    ];

    return (
        <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <Scissors className="text-primary w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    <span className="text-lg font-serif font-bold text-white tracking-[0.15em] uppercase">
                        <span className="text-primary">Barberia</span> Tradicional
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/services" className="text-xs font-bold tracking-widest text-gray-300 hover:text-primary transition-colors uppercase">
                        Servicios
                    </Link>
                    <Link href="/about" className="text-xs font-bold tracking-widest text-gray-300 hover:text-primary transition-colors uppercase">
                        Nosotros
                    </Link>
                    <Link href="/gallery" className="text-xs font-bold tracking-widest text-gray-300 hover:text-primary transition-colors uppercase">
                        Galería
                    </Link>

                    <Link
                        href="/reservar"
                        className="bg-primary text-black hover:bg-primary/90 px-6 py-2.5 rounded font-bold text-xs tracking-widest uppercase transition-colors shadow-lg shadow-primary/20"
                    >
                        Reservar Turno
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-base font-medium hover:text-primary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/reservar"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm text-center transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Reservar Turno
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
