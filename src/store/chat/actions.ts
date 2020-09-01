import { Message, SEND_MESSAGE, ChatActionTypes } from './types';

export function sendMessage(newMessage: Message): ChatActionTypes {
    return {
        type: SEND_MESSAGE,
        payload: newMessage,
    };
}
