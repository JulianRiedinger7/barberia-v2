import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCatalog from "@/components/ServiceCatalog";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-12 bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 space-y-6">
                        <div className="inline-block py-1 px-4 border border-primary/30 rounded-full bg-white/5 text-primary text-xs font-bold tracking-widest uppercase">
                            Catálogo
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium text-white">
                            Menú de <span className="text-primary italic">Servicios</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                            Precios transparentes y la mejor calidad en cada detalle.
                        </p>
                        <div className="w-24 h-1 bg-primary mx-auto mt-8"></div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <ServiceCatalog />
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
