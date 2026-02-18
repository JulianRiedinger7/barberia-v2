import { db } from "@/lib/firebase/config";
import { Service } from "@/lib/types";
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

const COLLECTION_NAME = "services";

export function subscribeToServices(callback: (services: Service[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));

    return onSnapshot(q, (snapshot) => {
        const services = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Service[];
        callback(services);
    });
}

export async function addService(service: Omit<Service, "id">) {
    return addDoc(collection(db, COLLECTION_NAME), service);
}

export async function updateService(id: string, service: Partial<Omit<Service, "id">>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, service);
}

export async function deleteService(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(docRef);
}
