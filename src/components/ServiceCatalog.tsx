import Link from "next/link";
import { Scissors, Zap, Crown, Sparkles } from "lucide-react";

export default function ServiceCatalog() {
    const categories = [
        {
            title: "Cortes",
            description: "Técnicas clásicas y modernas ejecutadas con precisión.",
            services: [
                { name: "Corte Clásico", price: "$12.000", desc: "Tijera o máquina, lavado y peinado." },
                { name: "Skin Fade", price: "$14.000", desc: "Degradado a piel con navaja." },
                { name: "Corte Infantil", price: "$10.000", desc: "Para menores de 12 años." },
                { name: "Rapado Completo", price: "$8.000", desc: "Con máquina, un solo número." },
            ]
        },
        {
            title: "Barba & Afeitado",
            description: "El cuidado experto que tu barba merece.",
            services: [
                { name: "Perfilado de Barba", price: "$8.000", desc: "Con tijera y máquina." },
                { name: "Ritual de Barba", price: "$10.000", desc: "Toalla caliente, aceites y masaje." },
                { name: "Afeitado Tradicional", price: "$12.000", desc: "Afeitado completo con navaja y espuma." },
                { name: "Camuflaje de Canas", price: "$15.000", desc: "Tinte natural para barba." },
            ]
        },
        {
            title: "Combos & Extras",
            description: "Paquetes completos para una experiencia superior.",
            services: [
                { name: "Barberia Tradicional (Corte + Barba)", price: "$18.000", desc: "Servicio completo premium.", highlight: true },
                { name: "Padre e Hijo", price: "$20.000", desc: "Dos cortes clásicos." },
                { name: "Limpieza Facial", price: "$8.000", desc: "Exfoliación y mascarilla negra." },
                { name: "Depilación Cejas/Nariz", price: "$4.000", desc: "Con cera o hilo." },
            ]
        }
    ];

    return (
        <div className="space-y-16">
            {categories.map((category, idx) => (
                <section key={idx} className="bg-zinc-900/30 border border-white/5 overflow-hidden">
                    <div className="bg-black/40 p-8 border-b border-primary/20 flex items-center gap-6">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            {idx === 0 && <Scissors className="w-6 h-6" />}
                            {idx === 1 && <Zap className="w-6 h-6" />}
                            {idx === 2 && <Crown className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-medium text-white">{category.title}</h3>
                            <p className="text-gray-400 text-sm mt-1 font-light">{category.description}</p>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {category.services.map((service, sIdx) => (
                            <div key={sIdx} className={`p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-white/[0.02] transition-colors ${service.highlight ? 'bg-primary/[0.03]' : ''}`}>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-lg text-white tracking-wide group-hover:text-primary transition-colors">{service.name}</h4>
                                        {service.highlight && <Sparkles size={16} className="text-primary animate-pulse" />}
                                    </div>
                                    <p className="text-gray-500 text-sm font-light">{service.desc}</p>
                                </div>
                                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className="text-xl font-bold text-primary font-serif italic">{service.price}</span>
                                    <Link
                                        href="/reservar"
                                        className="text-xs font-bold uppercase tracking-widest border border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary px-6 py-2.5 transition-all"
                                    >
                                        Reservar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
