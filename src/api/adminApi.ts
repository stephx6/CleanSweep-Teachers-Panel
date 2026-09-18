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
import type { ClassroomCode, PlayerAnalytics } from "../types/dashboardTypes";

// Collections

const playerCollectionName = "PlayerData";
const classRoomCollectionName = "ClassroomCodes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const num = (v: unknown) => (typeof v === "number" && !isNaN(v) ? v : 0);

const calcPercentage = (correct: number, total: number) =>
  total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

/** Builds one bin's correct/wrong/percentage block from raw player fields. */
const binStat = (correct: unknown, wrong: unknown) => {
  const c = num(correct);
  const w = num(wrong);
  return { correct: c, wrong: w, percentage: calcPercentage(c, c + w) };
};

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/**
 * Fetches player docs.
 *
 * The `role == "player"` query is exact and case-sensitive, so a doc saved as
 * "Player" — or with no role at all — is silently skipped and the report comes
 * out empty. If the strict query returns nothing, this falls back to reading
 * the collection and filtering in memory.
 */
const fetchPlayerDocs = async () => {
  const strict = await getDocs(
    query(collection(db, playerCollectionName), where("role", "==", "player")),
  );

  if (!strict.empty) {
    return strict.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
  }

  const all = await getDocs(collection(db, playerCollectionName));
  const players = all.docs
    .map((d) => ({ id: d.id, ...d.data() }) as any)
    .filter((p) => String(p.role ?? "").toLowerCase() !== "admin")
    .filter((p) => String(p.role ?? "").toLowerCase() !== "teacher");

  console.warn(
    `[adminApi] No docs matched role == "player". Falling back to a full read of ${playerCollectionName}: ${all.size} docs, ${players.length} kept. Check how "role" is spelled in Firestore.`,
  );

  return players;
};

/**
 * Looks up classroom docs for a list of player classroom codes.
 * Dedupes, skips the query when there are no codes, and chunks by 30 because
 * Firestore caps `in` queries at 30 values.
 */
const fetchClassroomMap = async (rawCodes: (string | undefined)[]) => {
  const map = new Map<
    string,
    { classroomName: string | null; createdBy: string | null }
  >();

  const codes = [...new Set(rawCodes.filter(Boolean))] as string[];
  if (codes.length === 0) return map;

  const snapshots = await Promise.all(
    chunkArray(codes, 30).map((chunk) =>
      getDocs(
        query(
          collection(db, classRoomCollectionName),
          where("code", "in", chunk),
        ),
      ),
    ),
  );

  snapshots.forEach((snap) =>
    snap.docs.forEach((d) => {
      const data = d.data();
      map.set(data.code, {
        classroomName: data.classroomName ?? null,
        createdBy: data.createdBy ?? null,
      });
    }),
  );

  return map;
};

// ─── Admin ────────────────────────────────────────────────────────────────────

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

// ─── Players ──────────────────────────────────────────────────────────────────

export const getAllPlayers = async () => {
  const players = await fetchPlayerDocs();
  const classroomMap = await fetchClassroomMap(
    players.map((p) => p.classroomCode),
  );

  return players.map((p) => ({
    ...p,
    classroomName: classroomMap.get(p.classroomCode)?.classroomName ?? null,
  }));
};

export const getPlayerAnalytics = async (): Promise<PlayerAnalytics> => {
  const players = await fetchPlayerDocs();
  const classroomMap = await fetchClassroomMap(
    players.map((p) => p.classroomCode),
  );

  console.log("[adminApi] players loaded for analytics:", players.length);

  const sum = (key: string) => players.reduce((s, p) => s + num(p[key]), 0);

  const totalAttempts = sum("totalAttempts");
  const totalCorrect = sum("totalCorrect");
  const totalWrong = sum("totalWrong");

  const biodegradableCorrect = sum("biodegradableCorrect");
  const biodegradableWrong = sum("biodegradableWrong");
  const biodegradableTotal = biodegradableCorrect + biodegradableWrong;

  const recyclableCorrect = sum("recyclableCorrect");
  const recyclableWrong = sum("recyclableWrong");
  const recyclableTotal = recyclableCorrect + recyclableWrong;

  const residualCorrect = sum("residualCorrect");
  const residualWrong = sum("residualWrong");
  const residualTotal = residualCorrect + residualWrong;

  const specialWasteCorrect = sum("specialWasteCorrect");
  const specialWasteWrong = sum("specialWasteWrong");
  const specialWasteTotal = specialWasteCorrect + specialWasteWrong;

  return {
    totalPlayers: players.length,

    // Overall totals
    totalAttempts,
    totalCorrect,
    totalWrong,
    overallAccuracy: Math.round(calcPercentage(totalCorrect, totalAttempts)),
    totalCorrectnessPercentage: calcPercentage(totalCorrect, totalAttempts),
    totalTrashSegregated: sum("totalTrashSegregated"),

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

    // Special Waste bin
    specialWasteCorrect,
    specialWasteWrong,
    specialWasteTotal,
    specialWasteCorrectnessPercentage: calcPercentage(
      specialWasteCorrect,
      specialWasteTotal,
    ),

    // Per-student breakdown
    perPlayer: players.map((p) => {
      const classroom = classroomMap.get(p.classroomCode);

      return {
        id: p.id,
        studentId: p.studentId ?? "",
        studentName: p.studentName ?? p.name ?? "",
        username: p.username ?? p.name ?? p.studentName ?? p.id ?? "",

        totalAttempts: num(p.totalAttempts),
        totalCorrect: num(p.totalCorrect),
        totalWrong: num(p.totalWrong),
        accuracyPercentage:
          typeof p.accuracyPercentage === "number"
            ? p.accuracyPercentage
            : calcPercentage(num(p.totalCorrect), num(p.totalAttempts)),
        totalTrashSegregated: num(p.totalTrashSegregated),
        envirocoins: num(p.envirocoins),

        pretestAccuracy: num(p.pretestAccuracy),
        posttestAccuracy: num(p.posttestAccuracy),

        biodegradable: binStat(p.biodegradableCorrect, p.biodegradableWrong),
        recyclable: binStat(p.recyclableCorrect, p.recyclableWrong),
        residual: binStat(p.residualCorrect, p.residualWrong),
        specialWaste: binStat(p.specialWasteCorrect, p.specialWasteWrong),

        classroomCode: p.classroomCode ?? null,
        // kept for older components that read the all-lowercase key
        classroomcode: p.classroomCode ?? null,
        classroomName: classroom?.classroomName ?? null,
        createdBy: classroom?.createdBy ?? null,
      };
    }),
  };
};

// ─── Classroom codes ──────────────────────────────────────────────────────────

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
export const createClassroomCode = async (
  uid: string,
  classroomName: string,
): Promise<string> => {
  const currentAdmin = await getAdminName(uid);

  const newCode = generateRandomCode();

  const codeData = {
    code: newCode,
    classroomName,
    isActive: true,
    createdBy: currentAdmin?.username,
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, classRoomCollectionName), codeData);

  return newCode;
};

// Get all classroom codes
export const getClassroomCodes = async (): Promise<ClassroomCode[]> => {
  try {
    const codesRef = collection(db, classRoomCollectionName);
    const q = query(codesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
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
    const codeRef = doc(db, classRoomCollectionName, codeId);
    await updateDoc(codeRef, { isActive });
  } catch (error) {
    console.error("Error updating code status:", error);
    throw error;
  }
};

// Delete a classroom code
export const deleteCode = async (codeId: string): Promise<void> => {
  try {
    const codeRef = doc(db, classRoomCollectionName, codeId);
    await deleteDoc(codeRef);
  } catch (error) {
    console.error("Error deleting code:", error);
    throw error;
  }
};