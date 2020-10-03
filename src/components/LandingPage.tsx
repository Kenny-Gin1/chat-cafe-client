import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import 'fontsource-roboto';
import { checkAuth } from '../lib/auth';
import { RootState } from '../store/index';
import { Alert } from '@material-ui/lab';
import { SERVER_UNAVAILABLE } from '../store/system/messages';
import { serverError } from '../store/system/actions';
import { updateUserName, loggedIn } from '../store/system/actions';
import { sendUserName, checkUserName } from '../network/sockets';
import PropTypes from 'prop-types';
import { useSocket } from '../contexts/SocketProvider'


const useStyles = makeStyles((theme) => ({
    root: {
        margin: '0px',
        padding: '0px',
        backgroundColor: '#3498db',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginWrapper: {
        backgroundColor: '#fff',
        padding: '20px',
        minWidth: '15%',
        margin: '0px auto',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderRadius: '10px',
    },
    loginInput: {
        display: 'block',
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        minWidth: '100%',
        maxWidth: '100%',
        marginBottom: '20px',
        boxSizing: 'border-box',
    },
    loginMessage: {
        textAlign: 'center',
    },
}));

export default function LandingPage({ errorMessageFromState, message }) {

    const socket = useSocket();

    const classes = useStyles();
    const dispatch = useDispatch();
    const serverDown = useSelector((state: RootState) => state.system.serverDown);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userName = (e.target as HTMLFormElement).username.value;

        checkUserName(socket, userName);
        if (serverDown) {
            dispatch(
                serverError({
                    loggedIn: false,
                    errorMessage: SERVER_UNAVAILABLE,
                    serverDown: true,
                }),
            );
        }
        socket.on('username-taken', (data) => {
            const { userNameIsTaken, errorMessage } = data;
            if (userNameIsTaken || userName === '') {
                dispatch(updateUserName({ userNameIsTaken, errorMessage, loggedIn: false, message: '' }));
            }
            socket.off();
        });
        socket.on('username-ok', (data) => {
            try {
                checkAuth();
                dispatch(loggedIn({ loggedIn: true, userName, serverDown: false }));
                sendUserName(socket, userName);
            } catch (e) {
                console.error(e);
            }
            socket.off();
        });
    };
    return (
        <div className={classes.root}>
            <div className={classes.loginWrapper}>
                <h2 className={classes.loginMessage}>
                    Welcome to Chat Café
                    <br />
                    <br />
                    Start chatting!
                </h2>
                <div>
                    {errorMessageFromState ? (
                        <Alert variant="outlined" severity="error">
                            {errorMessageFromState}
                        </Alert>
                    ) : null}
                    {message ? (
                        <Alert variant="outlined" severity="success">
                            {message}
                        </Alert>
                    ) : null}
                </div>
                <form
                    onSubmit={(e: React.FormEvent) => {
                        handleSubmit(e);
                    }}
                >
                    <input
                        className={classes.loginInput}
                        type="username"
                        placeholder="Username..."
                        id="username"
                        name="username"
                    />
                    <Button variant="contained" color="primary" size="large" type="submit" fullWidth>
                        Connect
                    </Button>
                </form>
            </div>
        </div>
    );
}

LandingPage.propTypes = {
    errorMessageFromState: PropTypes.string,
    message: PropTypes.string,
};
