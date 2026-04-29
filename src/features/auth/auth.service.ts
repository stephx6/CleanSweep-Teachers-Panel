import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signOut } from 'firebase/auth';




export const loginUser = (email : string , password : string) => {
    return signInWithEmailAndPassword(auth, email , password );
}

export const logOutUser = async () => {
    await signOut(auth);
    console.log("User logged out")
}