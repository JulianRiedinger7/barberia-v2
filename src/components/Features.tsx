import Link from "next/link";
import { Scissors, Zap, Crown } from "lucide-react";

export default function FeaturedServices() {
    const services = [
        {
            id: 1,
            title: "Corte Clásico",
            price: "$12.000",
            description: "Corte a tijera o máquina, lavado incluido y peinado con productos premium.",
            icon: <Scissors className="w-8 h-8 text-primary" />,
        },
        {
            id: 2,
            title: "Barba & Ritual",
            price: "$10.000",
            description: "Perfilado, toalla caliente, aceites esenciales y masaje facial relajante.",
            icon: <Zap className="w-8 h-8 text-primary" />,
        },
        {
            id: 3,
            title: "Servicio Completo",
            price: "$18.000",
            description: "La experiencia definitiva: Corte + Barba + Bebida de cortesía.",
            icon: <Crown className="w-8 h-8 text-primary" />,
        },
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                        Nuestros <span className="text-primary">Servicios</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Ofrecemos una gama completa de servicios de barbería tradicional adaptados al hombre moderno.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group bg-card border border-border p-8 rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="mb-6 p-4 bg-background rounded-full w-16 h-16 flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                                {service.description}
                            </p>
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                                <span className="text-xl font-bold text-primary">{service.price}</span>
                                <Link
                                    href="/reservar"
                                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    Reservar →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/services"
                        className="text-muted-foreground hover:text-primary underline underline-offset-4 text-sm font-medium transition-colors"
                    >
                        Ver todos los servicios y precios
                    </Link>
                </div>
            </div>
        </section>
    );
}
