import { auth } from '../services/firebase';

export function checkAuth() {
    auth().onAuthStateChanged((user) => {
        if (!user) return signIn();
    });
}

export async function signIn() {
    return await auth()
        .signInAnonymously()
        .catch((error) => {
            console.log(error);
        });
}

export function signOut() {
    return auth().signOut();
}

export function deleteCurrentUser() {
    const currentUser = auth().currentUser || null;
    if (currentUser !== null) {
        return currentUser.delete();
    }
    return;
}

export function getUserId() {
    const currentUser = auth().currentUser || null;
    if (currentUser !== null) {
        return currentUser.uid;
    }
    return;
}
