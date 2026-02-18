import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                    {/* Brand & Social */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-serif font-bold text-primary">BARBERIA TRADICIONAL</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
                            Rescatando el arte del buen corte y el afeitado clásico. Una experiencia premium para el caballero moderno.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-semibold text-foreground">Contacto</h4>
                        <div className="flex flex-col gap-2 items-center md:items-start text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-primary" />
                                <span>Av. Corrientes 1234, Buenos Aires</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-primary" />
                                <span>+54 11 1234-5678</span>
                            </div>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-semibold text-foreground">Horarios</h4>
                        <div className="flex flex-col gap-2 items-center md:items-start text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                <span>Martes a Sábado</span>
                            </div>
                            <p>10:00 - 20:00</p>
                            <p className="text-xs text-muted-foreground/60 mt-2">Domingos y Lunes cerrado</p>
                        </div>
                    </div>

                </div>

                <div className="border-t border-border mt-12 pt-6 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Barberia Tradicional. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
