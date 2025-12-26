import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item, Event, Prompt, ItemType, ItemStatus } from "@/lib/types";

/**
 * Items CRUD operations
 */
export const itemsService = {
  async create(userId: string, itemData: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">): Promise<string> {
    const itemRef = collection(db, `users/${userId}/items`);
    const now = Timestamp.now();
    
    const docRef = await addDoc(itemRef, {
      ...itemData,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    
    return docRef.id;
  },

  async update(userId: string, itemId: string, updates: Partial<Item>): Promise<void> {
    const itemRef = doc(db, `users/${userId}/items`, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(userId: string, itemId: string): Promise<void> {
    const itemRef = doc(db, `users/${userId}/items`, itemId);
    await deleteDoc(itemRef);
  },

  async get(userId: string, itemId: string): Promise<Item | null> {
    const itemRef = doc(db, `users/${userId}/items`, itemId);
    const snapshot = await getDoc(itemRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Item;
  },

  async list(
    userId: string,
    filters?: {
      type?: ItemType;
      status?: ItemStatus;
      tags?: string[];
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<Item[]> {
    const itemsRef = collection(db, `users/${userId}/items`);
    const constraints: QueryConstraint[] = [];

    if (filters?.type) {
      constraints.push(where("type", "==", filters.type));
    }

    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }

    if (filters?.tags && filters.tags.length > 0) {
      constraints.push(where("tags", "array-contains-any", filters.tags));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(itemsRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Item[];
  },
};

/**
 * Events CRUD operations
 */
export const eventsService = {
  async create(userId: string, eventData: Omit<Event, "id" | "userId" | "createdAt">): Promise<string> {
    const eventsRef = collection(db, `users/${userId}/events`);
    
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      userId,
      createdAt: Timestamp.now(),
    });
    
    return docRef.id;
  },

  async list(userId: string, itemId?: string): Promise<Event[]> {
    const eventsRef = collection(db, `users/${userId}/events`);
    const constraints: QueryConstraint[] = [];

    if (itemId) {
      constraints.push(where("itemId", "==", itemId));
    }

    constraints.push(orderBy("timestamp", "desc"));

    const q = query(eventsRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  },
};

/**
 * Prompts CRUD operations
 */
export const promptsService = {
  async create(userId: string, promptData: Omit<Prompt, "id" | "userId" | "createdAt">): Promise<string> {
    const promptsRef = collection(db, `users/${userId}/prompts`);
    
    const docRef = await addDoc(promptsRef, {
      ...promptData,
      userId,
      createdAt: Timestamp.now(),
    });
    
    return docRef.id;
  },

  async update(userId: string, promptId: string, updates: Partial<Prompt>): Promise<void> {
    const promptRef = doc(db, `users/${userId}/prompts`, promptId);
    await updateDoc(promptRef, updates);
  },

  async list(userId: string, limit = 50): Promise<Prompt[]> {
    const promptsRef = collection(db, `users/${userId}/prompts`);
    const q = query(promptsRef, orderBy("createdAt", "desc"));
    
    const snapshot = await getDocs(q);

    return snapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Prompt[];
  },
};

/**
 * Batch write operations for multi-action commits
 */
export async function executeActionPlan(
  userId: string,
  promptId: string,
  actions: Array<{ type: string; itemType?: ItemType; data?: unknown }>
): Promise<string[]> {
  const batch = writeBatch(db);
  const createdItemIds: string[] = [];

  for (const action of actions) {
    if (action.type === "create_item" && action.itemType && action.data) {
      const itemRef = doc(collection(db, `users/${userId}/items`));
      const now = Timestamp.now();
      
      batch.set(itemRef, {
        ...action.data,
        type: action.itemType,
        userId,
        source: {
          promptId,
          type: "prompt",
        },
        createdAt: now,
        updatedAt: now,
      });
      
      createdItemIds.push(itemRef.id);
    }
  }

  await batch.commit();
  return createdItemIds;
}
