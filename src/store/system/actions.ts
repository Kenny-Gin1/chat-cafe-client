export function loggedIn(payload: Record<string, unknown>) {
    return {
        type: 'LOGGED_IN',
        payload,
    };
}

export function logOut(payload: Record<string, unknown>) {
    return {
        type: 'LOGGED_OUT',
        payload,
    };
}

export function updateUserName(payload: Record<string, unknown>) {
    return {
        type: 'UPDATE_USERNAME',
        payload,
    };
}

export function serverError(payload: Record<string, unknown>) {
    return {
        type: 'SERVER_ERROR',
        payload,
    };
}

export function serverConnected(payload: Record<string, unknown>) {
    return {
        type: 'SERVER_CONNECTED',
        payload,
    };
}

export function serverDisconnectedTimeOut(payload: Record<string, unknown>) {
    return {
        type: 'SERVER_DISCONNECT_TIMEOUT',
        payload,
    };
}
