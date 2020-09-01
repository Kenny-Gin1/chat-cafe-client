export interface userState {
    loggedIn: boolean;
    session: string;
    userName: string;
    userNameIsTaken: boolean;
    message: string;
    errorMessage: string;
    serverDown: boolean;
}
