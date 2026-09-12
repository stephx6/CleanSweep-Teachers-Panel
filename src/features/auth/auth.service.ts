import { auth, db } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

// Sign up
export const signUpUser = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;
    const role = "admin";

    // Store user data in Firestore
    await setDoc(doc(db, "PlayerData", user.uid), {
      name: name,
      role: role,
      email: email,
    });

    return user;
  } catch (error) {
    console.error("Error signing up user:", error);

    throw error;
  }
};
