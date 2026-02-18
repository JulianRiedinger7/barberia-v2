import { db } from "@/lib/firebase/config";
import { Member } from "@/lib/types";
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

const COLLECTION_NAME = "staff";

export function subscribeToStaff(callback: (staff: Member[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));

    return onSnapshot(q, (snapshot) => {
        const staff = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Member[];
        callback(staff);
    });
}

export async function addStaffMember(member: Omit<Member, "id">) {
    return addDoc(collection(db, COLLECTION_NAME), member);
}

export async function updateStaffMember(id: string, member: Partial<Omit<Member, "id">>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, member);
}

export async function deleteStaffMember(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(docRef);
}
