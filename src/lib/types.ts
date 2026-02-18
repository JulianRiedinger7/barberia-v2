export interface Service {
    id: string;
    name: string;
    category: "Cortes" | "Barba" | "Combos" | "Otros";
    price: number;
    duration: number; // in minutes
    description?: string;
    active: boolean;
}

export interface Client {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    lastVisit?: Date;
    totalSpent: number;
    notes?: string;
}

export interface Member {
    id: string;
    name: string;
    role: string;
    specialties: string[];
    rating: number;
    image: string;
    active: boolean;
}

// Deprecated alias if needed, or just remove
export type Professional = Member;

export interface Appointment {
    id: string;

    // Client info (denormalized for simplicity in list view, or ID if linked)
    clientId?: string;
    clientName: string;

    // Service info
    serviceId: string;

    // Staff info
    barberId: string; // Corresponds to Member.id

    // Contact info
    clientPhone?: string;
    clientEmail?: string;
    notes?: string;

    date: Date;
    duration: number; // in minutes
    status: "pending" | "confirmed" | "completed" | "cancelled";
}
