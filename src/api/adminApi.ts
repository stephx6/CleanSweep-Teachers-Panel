import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";

export const getCurrentAdmin = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return null;

  return { uid: user.uid };
};

export const getAdminName = async () => {
  const currentUser = await getCurrentAdmin();

  if (!currentUser) return null;

  const docRef = doc(db, "PlayerData", currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();

  return {
    username: data.name as string,
  };
};