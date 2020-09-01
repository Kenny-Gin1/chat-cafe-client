import { db } from '../services/firebase';

export const loadMessages = async (): Promise<string[]> => {
    const messages: string[] = [];
    try {
        await db
            .ref()
            .child('messages')
            .once('value', (snapshot) => {
                snapshot.forEach((snap) => {
                    messages.push(snap.val());
                });
            });
    } catch (error) {
        console.error(error);
    }
    return messages;
};

export const findUsers = async (): Promise<string[]> => {
    const users: string[] = [];
    await db
        .ref()
        .child('messages')
        .once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                users.push(snap.val().user);
            });
        });
    return users;
};

export const getNewMessages = async (): Promise<string[]> => {
    const messages: string[] = [];

    try {
        await db
            .ref()
            .child('messages')
            .once('value', (snapshot) => {
                snapshot.forEach((snap) => {
                    messages.push(snap.val());
                });
            });
    } catch (error) {
        console.error(error);
    }
    return messages;
};

export const getLastMessageAndSend = (handleMessages) => {
    db.ref()
        .child('messages')
        .orderByChild('timestamp')
        .startAt(Date.now())
        .limitToFirst(1)
        .on('child_added', handleMessages);
    db.ref().off('child_added', handleMessages);
};

export const writeToDataBase = async (allMessages) => {
    if (allMessages === null) return;
    const lastMessage = allMessages[parseInt(allMessages.length) - 1];
    const { message, timestamp, id, user } = lastMessage;

    try {
        await db.ref().child('messages').push({
            message,
            timestamp,
            id,
            user,
        });
    } catch (error) {
        console.error(error);
    }
};
