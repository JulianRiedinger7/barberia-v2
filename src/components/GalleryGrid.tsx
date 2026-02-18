"use client";

import { useState } from "react";
import Image from "next/image";

export default function GalleryGrid() {
    const [filter, setFilter] = useState("Todos");

    const images = [
        { id: 1, src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop", category: "Cortes", size: "tall" },
        { id: 2, src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop", category: "Barba", size: "wide" },
        { id: 3, src: "https://images.unsplash.com/photo-1503951914290-934fa5f4c50c?q=80&w=2070&auto=format&fit=crop", category: "Local", size: "square" },
        { id: 4, src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop", category: "Local", size: "tall" },
        { id: 5, src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop", category: "Cortes", size: "square" },
        { id: 6, src: "https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2070&auto=format&fit=crop", category: "Local", size: "wide" },
        { id: 7, src: "https://images.unsplash.com/photo-1519500099198-fd81846b8f03?q=80&w=2070&auto=format&fit=crop", category: "Barba", size: "square" },
        { id: 8, src: "https://images.unsplash.com/photo-1590540179852-208f65d6c934?q=80&w=2070&auto=format&fit=crop", category: "Local", size: "tall" },
    ];

    const filteredImages = filter === "Todos" ? images : images.filter(img => img.category === filter);

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex justify-center gap-4 flex-wrap">
                {["Todos", "Cortes", "Barba", "Local"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === cat
                            ? "bg-primary text-black shadow-[0_0_15px_rgba(242,185,13,0.4)]"
                            : "bg-transparent border border-white/20 text-gray-400 hover:border-primary hover:text-primary"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredImages.map((image) => (
                    <div key={image.id} className="break-inside-avoid relative group rounded bg-zinc-900 overflow-hidden border border-white/5 hover:border-primary/50 transition-colors duration-500">
                        <div className="relative w-full h-auto">
                            <Image
                                src={image.src}
                                alt={`Galería ${image.category}`}
                                width={600}
                                height={400} // Aspect ratio approximation
                                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110 block grayscale group-hover:grayscale-0"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-primary font-serif font-bold tracking-[0.2em] uppercase text-xs border border-primary/50 px-6 py-2 bg-black/50">
                                {image.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
