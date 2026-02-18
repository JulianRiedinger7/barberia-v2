import { db } from "@/lib/firebase/config";
import { Client } from "@/lib/types";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";

const COLLECTION_NAME = "clients";

export function subscribeToClients(callback: (clients: Client[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("totalSpent", "desc"));

    return onSnapshot(q, (snapshot) => {
        const clients = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                lastVisit: data.lastVisit ? data.lastVisit.toDate() : undefined,
            };
        }) as Client[];
        callback(clients);
    });
}

export async function addClient(client: Omit<Client, "id">) {
    return addDoc(collection(db, COLLECTION_NAME), client);
}

export async function updateClient(id: string, client: Partial<Omit<Client, "id">>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, client);
}

export async function deleteClient(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(docRef);
}
