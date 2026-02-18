import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-12 bg-zinc-950">
                <div className="container mx-auto px-4 text-center mb-16">
                    <div className="inline-block py-1 px-4 border border-primary/30 rounded-full bg-white/5 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                        Nuestra Historia
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-white mb-6">
                        El Legado <span className="text-primary italic">Tradicional</span>
                    </h1>
                    <div className="w-24 h-1 bg-primary mx-auto"></div>
                </div>
                <AboutSection />
            </div>
            <Footer />
        </main>
    );
}
