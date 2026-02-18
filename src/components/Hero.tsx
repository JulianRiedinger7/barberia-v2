import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/30 z-10" />
                <div
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"
                />
            </div>

            <div className="container relative z-20 px-4 text-center space-y-8 max-w-4xl mx-auto flex flex-col items-center">
                {/* Badge */}
                <div className="inline-block py-1.5 px-6 border border-primary/50 rounded-full bg-black/40 backdrop-blur-md text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">
                    ESTABLECIDO EN 1984
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white leading-[0.9]">
                    El Arte del <br />
                    Cuidado <br />
                    <span className="text-primary italic">Masculino</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                    Experimenta el ritual clásico de la barbería tradicional en un ambiente
                    diseñado para el caballero moderno. Excelencia, precisión y estilo.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <Link
                        href="/reservar"
                        className="bg-primary text-black hover:bg-primary/90 px-8 py-4 rounded font-bold text-sm tracking-widest uppercase transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(242,185,13,0.3)]"
                    >
                        Reservar Turno
                    </Link>
                    <Link
                        href="/services"
                        className="bg-transparent text-white hover:bg-white/10 px-8 py-4 rounded font-bold text-sm tracking-widest uppercase border border-white/20 transition-colors"
                    >
                        Ver Servicios
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white/50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
}
