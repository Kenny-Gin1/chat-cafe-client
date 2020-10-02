import React, { useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Chat from './components/Chat';
import { RootState } from './store/index';
import { useSelector, useDispatch } from 'react-redux';
import { SERVER_DOWN, SERVER_UNAVAILABLE, TIMEOUT_DISCONNECT } from './store/system/messages';
import { serverError, serverConnected, serverDisconnectedTimeOut } from './store/system/actions';
import { useSocket } from './contexts/SocketProvider';

//const socket = io('https://chat-cafe-app-server.herokuapp.com/');

function App() {
    const socket = useSocket();
    const loggedIn = useSelector((state: RootState) => state.system.loggedIn);
    const errorMessageFromState = useSelector((state: RootState) => state.system.errorMessage);
    const message = useSelector((state: RootState) => state.system.message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket === null || socket === undefined) return;
        socket.on('connect', () => {
            dispatch(serverConnected({ serverDown: false }));
        });
        return () => {
            socket.off('connect');
        };
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket === null || socket === undefined) return;
        socket.on('disconnect', (error) => {
            dispatch(serverError({ loggedIn: false, errorMessage: SERVER_DOWN, serverDown: true, message: '' }));
        });
        return () => {
            socket.off('disconnect');
        };
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket === null || socket === undefined) return;
        setInterval(() => {
            if (!socket.connected) {
                dispatch(
                    serverError({ loggedIn: false, errorMessage: SERVER_UNAVAILABLE, serverDown: true, message: '' }),
                );
            }
        }, 1000);
        return () => socket.off()
    }, [socket, dispatch]);

    return (
        <div className="App">
            {loggedIn ? <Chat /> : <LandingPage errorMessageFromState={errorMessageFromState} message={message} />}
        </div>
    );
}

export default App;
