import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { generateRandomCode } from "../helpers";

const redeemCollection = "RedeemCodes";

export interface RedeemCode {
  id: string;
  codes: string[];
  isActive: boolean;
  rewards: Record<string, string[]>;
}

export async function getAllRedeemCodes(): Promise<RedeemCode[]> {
  const collectionRef = collection(db, redeemCollection);
  const snapshot = await getDocs(collectionRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      codes: data.codes ?? [],
      isActive: data.isActive ?? false,
      rewards: data.rewards ?? {},
    };
  });
}

export async function createRedeemCode(code: string) {
  try {
    const randomCode = generateRandomCode().slice(0, 4);
    const newCode = `${code}${randomCode}`;

    const redeemCodeRef = doc(db, "RedeemCodes", code);

    await updateDoc(redeemCodeRef, {
      codes: arrayUnion(newCode),
    });

    return newCode;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
