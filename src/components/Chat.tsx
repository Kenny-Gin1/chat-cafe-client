import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import 'fontsource-roboto';
import { Button, Paper } from '@material-ui/core';
import { RootState } from '../store';
import { signOut, deleteCurrentUser, getUserId } from '../lib/auth';
import ChatMessages from './ChatMessages';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import io from 'socket.io-client';
import { logOut } from '../store/system/actions';
import { userLeavingEmitAction, userHasDisconnectedAction } from '../network/sockets';
import { LOGGED_OUT } from '../store/system/messages';

//const socket = io('https://chat-cafe-app-server.herokuapp.com/');

const socket = io('http://localhost:8080/');

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'linear-gradient(to right, #57c1eb 0%, #246faB 100%)',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        [theme.breakpoints.down('sm')]: {
            height: '100vh',
            width: '100vw',
            overflowY: 'hidden',
            margin: 0,
        },
    },
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '80vw',
        maxWidth: '80vh',
        maxHeight: '800px',
        width: '90%',
        height: '95vh',
        background: '#FFF',
        borderRadius: '10px',
        [theme.breakpoints.down('xs')]: {
            height: '100vh',
            width: '100vw',
        },
    },

    chatTitle: {
        display: 'grid',
        grid: '36px / 1fr 0.025fr',
        alignContent: 'center',
        alignItems: 'center',
        background: '#0048AA',
        color: 'black',
        height: '71px',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        borderRadius: '10px 10px 0 0 ',
        boxShadow: '0 1px 3px -1px rgba(0,0,0,0.75)',
        padding: '0 20px',
    },

    logOutButton: {
        width: 'auto',
        boxSizing: 'border-box',
        justifyContent: 'flex-end',
    },
}));

export default function Chat() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const userName = useSelector((state: RootState) => state.system.userName);

    const currId = getUserId();
    const currUser = userName;

    const handleLogOut = (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            deleteCurrentUser() || signOut();
            userLeavingEmitAction(socket, currUser);
            userHasDisconnectedAction(socket, currUser);
            dispatch(
                logOut({ loggedIn: false, userName: '', serverDown: false, message: LOGGED_OUT, errorMessage: '' }),
            );
        } catch (e) {
            console.log(e.message);
        }

        return () => {
            socket.off();
        };
    };
    return (
        <div className={classes.root}>
            <Paper className={classes.chatContainer}>
                <div className={classes.chatTitle}>
                    Chat Cafe
                    <Button
                        className={classes.logOutButton}
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={(e) => {
                            handleLogOut(e);
                        }}
                    >
                        <ExitToAppIcon />
                    </Button>
                </div>
                <ChatMessages id={currId} user={currUser} />
            </Paper>
        </div>
    );
}
