import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";

const playerDataCollection = "PlayerData";

function generateStudentId() {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `${year}-${randomNumber}`;
}

interface AddStudentParams {
  studentName: string;
  classroomId: string;
}

export async function addStudents({
  studentName,
  classroomId,
}: AddStudentParams) {
  const studentId = generateStudentId();

  const data = {
    studentId,
    studentName,
    role: "player",
    classroomCode: classroomId,
  };

  await addDoc(collection(db, playerDataCollection), data);

  return data;
}

interface UpdateStudentNameParams {
  studentId: string;
  classroomId: string;
  studentName: string;
  /** Firestore document ID, if you already have it. Skips the lookup. */
  docId?: string;
}

/**
 * Changes only the student's name. If the Firestore document ID isn't known,
 * the PlayerData document is found by studentId + classroomCode.
 */
export async function updateStudentName({
  studentId,
  classroomId,
  studentName,
  docId,
}: UpdateStudentNameParams) {
  if (docId) {
    await updateDoc(doc(db, playerDataCollection, docId), { studentName });
    return;
  }

  const snapshot = await getDocs(
    query(
      collection(db, playerDataCollection),
      where("studentId", "==", studentId),
      where("classroomCode", "==", classroomId),
    ),
  );

  if (snapshot.empty) {
    throw new Error(`No student found with ID ${studentId} in this classroom.`);
  }

  if (snapshot.size > 1) {
    throw new Error(
      `Multiple students share ID ${studentId} in this classroom; cannot tell which to update.`,
    );
  }

  await updateDoc(snapshot.docs[0].ref, { studentName });
}

interface AddStudentsBulkParams {
  studentNames: string[];
  classroomId: string;
}

// Firestore allows at most 500 writes per batch.
const BATCH_LIMIT = 500;

/**
 * Adds many students in one go using Firestore batched writes.
 * Each batch is atomic: either all students in it are saved or none are.
 * Student IDs are guaranteed unique within the submitted list.
 */
export async function addStudentsBulk({
  studentNames,
  classroomId,
}: AddStudentsBulkParams) {
  const usedIds = new Set<string>();

  const records = studentNames.map((studentName) => {
    let studentId = generateStudentId();

    while (usedIds.has(studentId)) {
      studentId = generateStudentId();
    }

    usedIds.add(studentId);

    return {
      studentId,
      studentName,
      role: "player",
      classroomCode: classroomId,
    };
  });

  for (let i = 0; i < records.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);

    records.slice(i, i + BATCH_LIMIT).forEach((record) => {
      batch.set(doc(collection(db, playerDataCollection)), record);
    });

    await batch.commit();
  }

  return records;
}
