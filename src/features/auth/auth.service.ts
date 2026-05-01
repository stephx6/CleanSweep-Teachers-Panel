import { auth, db } from "../../FirebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getUserRole = async (uid: string): Promise<string | null> => {
  const docRef = doc(db, "PlayerData", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data().role ?? null) : null;
};

export const logOutUser = async () => {
  await signOut(auth);
};
