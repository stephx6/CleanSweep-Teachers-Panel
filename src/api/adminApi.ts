import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";
import {} from "firebase/firestore";
import type { ClassroomCode } from "../types/dashboardTypes";

// Collections

const playerCollectionName = "PlayerData";

export const getCurrentAdmin = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return null;

  return { uid: user.uid };
};

export const getAdminName = async () => {
  const currentUser = await getCurrentAdmin();

  if (!currentUser) return null;

  const docRef = doc(db, playerCollectionName, currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();

  return {
    username: data.name as string,
  };
};

export const getAllPlayers = async () => {
  const q = query(
    collection(db, playerCollectionName),
    where("role", "==", "player"),
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};



// Generate a random classroom code
const generateRandomCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Create a new classroom code
export const createClassroomCode = async (): Promise<string> => {
  const currentAdmin = await getAdminName();
  console.log(currentAdmin);
  const newCode = generateRandomCode();
  const codeData = {
    code: newCode,
    isActive: true,
    createdBy: currentAdmin?.username,
    createdAt: new Date().toISOString(),
  };

  try {
    await addDoc(collection(db, "ClassroomCodes"), codeData);
    return newCode;
  } catch (error) {
    console.error("Error creating classroom code:", error);
    throw error;
  }
};

// Get all classroom codes
export const getClassroomCodes = async (): Promise<ClassroomCode[]> => {
  try {
    const codesRef = collection(db, "ClassroomCodes");
    const q = query(codesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ClassroomCode[];
  } catch (error) {
    console.error("Error fetching classroom codes:", error);
    throw error;
  }
};

// Update code status (active/disabled)
export const updateCodeStatus = async (
  codeId: string,
  isActive: boolean,
): Promise<void> => {
  try {
    const codeRef = doc(db, "ClassroomCodes", codeId);
    await updateDoc(codeRef, { isActive });
  } catch (error) {
    console.error("Error updating code status:", error);
    throw error;
  }
};

// Delete a classroom code
export const deleteCode = async (codeId: string): Promise<void> => {
  try {
    const codeRef = doc(db, "ClassroomCodes", codeId);
    await deleteDoc(codeRef);
  } catch (error) {
    console.error("Error deleting code:", error);
    throw error;
  }
};
