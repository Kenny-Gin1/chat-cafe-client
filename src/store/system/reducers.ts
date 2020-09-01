import { userState } from './types';

const initialState: userState = {
    loggedIn: false,
    session: '',
    userName: '',
    userNameIsTaken: false,
    message: '',
    errorMessage: '',
    serverDown: true,
};

export function systemReducer(state = initialState, action): userState {
    switch (action.type) {
        case 'LOGGED_IN': {
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                userName: action.payload.userName,
                serverDown: action.payload.serverDown,
            };
        }
        case 'LOGGED_OUT': {
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                userName: action.payload.userName,
                message: action.payload.message,
                errorMessage: action.payload.errorMessage,
            };
        }
        case 'UPDATE_USERNAME': {
            return {
                ...state,
                userNameIsTaken: action.payload.userNameIsTaken,
                errorMessage: action.payload.errorMessage,
                message: action.payload.message,
            };
        }
        case 'SERVER_CONNECTED': {
            return {
                ...state,
                serverDown: action.payload.serverDown,
            };
        }
        case 'SERVER_ERROR': {
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                errorMessage: action.payload.errorMessage,
                serverDown: action.payload.serverDown,
                message: action.payload.message,
            };
        }
        case 'SERVER_DISCONNECT_TIMEOUT': {
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                errorMessage: action.payload.errorMessage,
                serverDown: action.payload.serverDown,
                message: action.payload.message,
            };
        }
        default:
            return state;
    }
}
