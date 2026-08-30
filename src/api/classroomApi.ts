import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../FirebaseConfig";
const playerCollectionName = "PlayerData";
const classRoomCollectionName = "ClassroomCodes";

export async function getAllClassrooms() {
  const q = query(collection(db, classRoomCollectionName));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
// Shared helper: takes any array of player docs and returns the analytics shape
const computeAnalytics = (players: any[], classroomMap?: Map<string, string>) => {
  const calcPercentage = (correct: number, total: number) =>
    total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

  const totalAttempts = players.reduce((sum, p) => sum + (p.totalAttempts ?? 0), 0);
  const totalCorrect = players.reduce((sum, p) => sum + (p.totalCorrect ?? 0), 0);
  const totalWrong = players.reduce((sum, p) => sum + (p.totalWrong ?? 0), 0);

  const biodegradableCorrect = players.reduce((sum, p) => sum + (p.biodegradableCorrect ?? 0), 0);
  const biodegradableWrong = players.reduce((sum, p) => sum + (p.biodegradableWrong ?? 0), 0);
  const biodegradableTotal = biodegradableCorrect + biodegradableWrong;

  const recyclableCorrect = players.reduce((sum, p) => sum + (p.recyclableCorrect ?? 0), 0);
  const recyclableWrong = players.reduce((sum, p) => sum + (p.recyclableWrong ?? 0), 0);
  const recyclableTotal = recyclableCorrect + recyclableWrong;

  const residualCorrect = players.reduce((sum, p) => sum + (p.residualCorrect ?? 0), 0);
  const residualWrong = players.reduce((sum, p) => sum + (p.residualWrong ?? 0), 0);
  const residualTotal = residualCorrect + residualWrong;

  const specialWasteCorrect = players.reduce((sum, p) => sum + (p.specialWasteCorrect ?? 0), 0);
  const specialWasteWrong = players.reduce((sum, p) => sum + (p.specialWasteWrong ?? 0), 0);
  const specialWasteTotal = specialWasteCorrect + specialWasteWrong;

  return {
    totalPlayers: players.length,

    totalAttempts,
    totalCorrect,
    totalWrong,
    overallAccuracy: Math.round(calcPercentage(totalCorrect, totalAttempts)),
    totalCorrectnessPercentage: calcPercentage(totalCorrect, totalAttempts),
    totalTrashSegregated: players.reduce((sum, p) => sum + (p.totalTrashSegregated ?? 0), 0),

    biodegradableCorrect,
    biodegradableWrong,
    biodegradableTotal,
    biodegradableCorrectnessPercentage: calcPercentage(biodegradableCorrect, biodegradableTotal),

    recyclableCorrect,
    recyclableWrong,
    recyclableTotal,
    recyclableCorrectnessPercentage: calcPercentage(recyclableCorrect, recyclableTotal),

    residualCorrect,
    residualWrong,
    residualTotal,
    residualCorrectnessPercentage: calcPercentage(residualCorrect, residualTotal),

    specialWasteCorrect,
    specialWasteWrong,
    specialWasteTotal,
    specialWasteCorrectnessPercentage: calcPercentage(specialWasteCorrect, specialWasteTotal),

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
      specialWaste : {
        correct : p.specialWasteCorrect ?? 0,
        wrong : p.specialWasteWrong ?? 0,
        percentage : calcPercentage(p.specialWasteCorrect ?? 0, (p.specialWasteCorrect ?? 0) + (p.specialWasteWrong ?? 0),)
      },
      classroomcode: p.classroomCode,
      createdBy: classroomMap?.get(p.classroomCode) ?? null,
    })),
  };
};

export const getPlayerAnalytics = async () => {
  const q = query(
    collection(db, playerCollectionName),
    where("role", "==", "player"),
  );

  const querySnapshot = await getDocs(q);
  const players = querySnapshot.docs.map((doc) => doc.data());

  const playerClassroom = players.filter((p) => p.classroomCode !== undefined);

  const q2 = query(
    collection(db, "ClassroomCodes"),
    where(
      "code",
      "in",
      playerClassroom.map((e) => e.classroomCode),
    ),
  );
  const querySnapshot2 = await getDocs(q2);
  const createdBy = querySnapshot2.docs.map((doc) => doc.data());

  const classroomMap = new Map(createdBy.map((c) => [c.code, c.createdBy]));

  return computeAnalytics(players, classroomMap);
};

export async function getPlayerAnalyticsByClassCode(classroomCode: string) {
  const q = query(
    collection(db, playerCollectionName),
    where("role", "==", "player"),
    where("classroomCode", "==", classroomCode),
  );

  const querySnapshot = await getDocs(q);
  const players = querySnapshot.docs.map((doc) => doc.data());

  // Everyone here already has the same classroomCode, so createdBy is just one lookup
  const classroomQuery = query(
    collection(db, "ClassroomCodes"),
    where("code", "==", classroomCode),
  );
  const classroomSnapshot = await getDocs(classroomQuery);
  const classroomDoc = classroomSnapshot.docs[0]?.data();
  const classroomMap = classroomDoc
    ? new Map([[classroomDoc.code, classroomDoc.createdBy]])
    : new Map();

  return computeAnalytics(players, classroomMap);
}