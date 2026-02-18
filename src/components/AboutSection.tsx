import Image from "next/image";
import { Star, ShieldCheck, Coffee, Scissors } from "lucide-react";

export default function AboutSection() {
    return (
        <div className="space-y-20 py-12">

            {/* History Section */}
            <section className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 order-2 md:order-1">
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight">
                        Nuestra <br /><span className="text-primary italic">Historia</span>
                    </h2>
                    <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
                        <p>
                            Fundada en 2015, Barberia Tradicional nació con la misión de rescatar la elegancia de las antiguas barberías europeas y traerlas al corazón de la ciudad. Lo que comenzó como un pequeño local con dos sillones, hoy es un referente de estilo y cuidado masculino.
                        </p>
                        <p>
                            Creemos que un corte de pelo no es solo un trámite, sino un ritual. Nos dedicamos a preservar las técnicas clásicas de navaja y tijera, fusionándolas con las tendencias contemporáneas.
                        </p>
                    </div>
                </div>
                <div className="order-1 md:order-2 relative h-[500px] w-full overflow-hidden shadow-2xl shadow-black/50 group">
                    <div className="absolute inset-0 border border-primary/20 z-20 m-4 pointer-events-none transition-all duration-700 group-hover:m-0 group-hover:border-primary/50"></div>
                    <Image
                        src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop"
                        alt="Interior de la barbería"
                        fill
                        className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110"
                    />
                </div>
            </section>

            {/* Founder Section */}
            <section className="bg-zinc-900/50 py-24 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-primary">
                    <Scissors size={200} strokeWidth={0.5} />
                </div>
                <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-primary/50 mb-8 relative shadow-[0_0_30px_rgba(242,185,13,0.1)]">
                        <Image
                            src="https://images.unsplash.com/photo-1521119989659-a83eee488058?q=80&w=1000&auto=format&fit=crop"
                            alt="Fundador"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-white mb-2">Marcos Ruiz</h3>
                    <p className="text-primary font-bold mb-8 uppercase tracking-[0.2em] text-xs">Maestro Barbero & Fundador</p>
                    <blockquote className="text-gray-300 font-serif italic text-2xl leading-relaxed">
                        &quot;La barbería es más que cortar cabello; es crear confianza. Cada cliente que se sienta en mi sillón es un amigo al que debo honrar con mi mejor trabajo.&quot;
                    </blockquote>
                </div>
            </section>

            {/* Values Section */}
            <section className="container mx-auto px-4 pb-24">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-10 space-y-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-primary border border-primary/30 group-hover:scale-110 transition-transform duration-500">
                            <Star size={28} />
                        </div>
                        <h4 className="text-2xl font-serif font-medium text-white">Atención Premium</h4>
                        <p className="text-sm text-muted-foreground">Cada detalle cuenta. Desde la bienvenida hasta el acabado final, tu satisfacción es nuestra prioridad.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mx-auto text-primary border border-border">
                            <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-xl font-bold font-serif">Productos de Calidad</h4>
                        <p className="text-sm text-muted-foreground">Utilizamos exclusivamente productos de primeras marcas internacionales para el cuidado de tu cabello y barba.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mx-auto text-primary border border-border">
                            <Coffee size={24} />
                        </div>
                        <h4 className="text-xl font-bold font-serif">Ambiente Relajado</h4>
                        <p className="text-sm text-muted-foreground">Disfruta de buena música, una bebida de cortesía y una buena charla en un espacio diseñado para tu confort.</p>
                    </div>
                </div>
            </section>

        </div>
    );
}
