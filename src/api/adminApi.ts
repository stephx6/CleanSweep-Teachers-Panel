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

export const getAdminName = async (uid: string) => {
  const docRef = doc(db, playerCollectionName, uid);
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

export const getPlayerAnalytics = async () => {
  const q = query(
    collection(db, playerCollectionName),
    where("role", "==", "player"),
  );

  const querySnapshot = await getDocs(q);
  const players = querySnapshot.docs.map((doc) => doc.data());

  // Pre-compute shared totals
  const totalAttempts = players.reduce(
    (sum, p) => sum + (p.totalAttempts ?? 0),
    0,
  );
  const totalCorrect = players.reduce(
    (sum, p) => sum + (p.totalCorrect ?? 0),
    0,
  );
  const totalWrong = players.reduce((sum, p) => sum + (p.totalWrong ?? 0), 0);

  const biodegradableCorrect = players.reduce(
    (sum, p) => sum + (p.biodegradableCorrect ?? 0),
    0,
  );
  const biodegradableWrong = players.reduce(
    (sum, p) => sum + (p.biodegradableWrong ?? 0),
    0,
  );
  const biodegradableTotal = biodegradableCorrect + biodegradableWrong;

  const recyclableCorrect = players.reduce(
    (sum, p) => sum + (p.recyclableCorrect ?? 0),
    0,
  );
  const recyclableWrong = players.reduce(
    (sum, p) => sum + (p.recyclableWrong ?? 0),
    0,
  );
  const recyclableTotal = recyclableCorrect + recyclableWrong;

  const residualCorrect = players.reduce(
    (sum, p) => sum + (p.residualCorrect ?? 0),
    0,
  );
  const residualWrong = players.reduce(
    (sum, p) => sum + (p.residualWrong ?? 0),
    0,
  );
  const residualTotal = residualCorrect + residualWrong;

  const calcPercentage = (correct: number, total: number) =>
    total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

  const analytics = {
    totalPlayers: players.length,

    // Overall totals
    totalAttempts,
    totalCorrect,
    totalWrong,
    overallAccuracy: Math.round(calcPercentage(totalCorrect, totalAttempts)),
    totalCorrectnessPercentage: calcPercentage(totalCorrect, totalAttempts),
    totalTrashSegregated: players.reduce(
      (sum, p) => sum + (p.totalTrashSegregated ?? 0),
      0,
    ),
    // Biodegradable bin
    biodegradableCorrect,
    biodegradableWrong,
    biodegradableTotal,
    biodegradableCorrectnessPercentage: calcPercentage(
      biodegradableCorrect,
      biodegradableTotal,
    ),

    // Recyclable bin
    recyclableCorrect,
    recyclableWrong,
    recyclableTotal,
    recyclableCorrectnessPercentage: calcPercentage(
      recyclableCorrect,
      recyclableTotal,
    ),

    // Residual bin
    residualCorrect,
    residualWrong,
    residualTotal,
    residualCorrectnessPercentage: calcPercentage(
      residualCorrect,
      residualTotal,
    ),

    // Per-player breakdown
    perPlayer: players.map((p) => ({
      username: p.username,
      totalAttempts: p.totalAttempts ?? 0,
      totalCorrect: p.totalCorrect ?? 0,
      totalWrong: p.totalWrong ?? 0,
      accuracyPercentage: p.accuracyPercentage ?? 0,
      totalTrashSegregated: p.totalTrashSegregated ?? 0,
      envirocoins: p.envirocoins ?? 0,
      biodegradable: {
        correct: p.biodegradableCorrect ?? 0,
        wrong: p.biodegradableWrong ?? 0,
        percentage: calcPercentage(
          p.biodegradableCorrect ?? 0,
          (p.biodegradableCorrect ?? 0) + (p.biodegradableWrong ?? 0),
        ),
      },
      recyclable: {
        correct: p.recyclableCorrect ?? 0,
        wrong: p.recyclableWrong ?? 0,
        percentage: calcPercentage(
          p.recyclableCorrect ?? 0,
          (p.recyclableCorrect ?? 0) + (p.recyclableWrong ?? 0),
        ),
      },
      residual: {
        correct: p.residualCorrect ?? 0,
        wrong: p.residualWrong ?? 0,
        percentage: calcPercentage(
          p.residualCorrect ?? 0,
          (p.residualCorrect ?? 0) + (p.residualWrong ?? 0),
        ),
      },
    })),
  };

  return analytics;
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
export const createClassroomCode = async (uid: string): Promise<string> => {
  const currentAdmin = await getAdminName(uid);

  console.log(currentAdmin);

  const newCode = generateRandomCode();

  const codeData = {
    code: newCode,
    isActive: true,
    createdBy: currentAdmin?.username,
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, "ClassroomCodes"), codeData);

  return newCode;
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
