import { addDoc, collection } from "firebase/firestore";
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
