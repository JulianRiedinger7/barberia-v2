import { db } from "@/lib/firebase/config";
import { Appointment } from "@/lib/types";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp
} from "firebase/firestore";

const COLLECTION_NAME = "appointments";

// --- Admin / General CRUD ---

export function subscribeToAppointments(date: Date | null | undefined, callback: (appointments: Appointment[]) => void) {
    let q;

    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        q = query(
            collection(db, COLLECTION_NAME),
            where("date", ">=", Timestamp.fromDate(startOfDay)),
            where("date", "<=", Timestamp.fromDate(endOfDay)),
            orderBy("date", "asc") // For daily view, usually want ascending
        );
    } else {
        // Order by date descending for admin list (all items)
        q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
    }

    return onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: (data.date as Timestamp).toDate(), // Convert Timestamp to Date
            } as Appointment;
        });
        callback(appointments);
    });
}

export async function createAppointment(appointment: Omit<Appointment, "id">) {
    // Ensure date is a Date object (or Timestamp if preferred by app logic, but types say Date)
    return addDoc(collection(db, COLLECTION_NAME), appointment);
}

// Alias for compatibility with Admin page
export const addAppointment = createAppointment;

export async function updateAppointment(id: string, appointment: Partial<Omit<Appointment, "id">>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, appointment);
}

export async function deleteAppointment(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(docRef);
}

// --- Booking System Specific ---

export async function getAppointmentsByDateRange(startDate: Date, endDate: Date) {
    // Firestore stores dates as Timestamps
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const q = query(
        collection(db, COLLECTION_NAME),
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate() // Convert back to JS Date
        } as Appointment;
    });
}

export async function getAppointmentsForBarber(barberId: string, date: Date) {
    // Create range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const q = query(
        collection(db, COLLECTION_NAME),
        where("barberId", "==", barberId),
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate()
        } as Appointment;
    });
}
