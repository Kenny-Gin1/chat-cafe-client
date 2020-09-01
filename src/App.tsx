import React, { useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Chat from './components/Chat';
import { RootState } from './store/index';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { SERVER_DOWN, SERVER_UNAVAILABLE, TIMEOUT_DISCONNECT } from './store/system/messages';
import { serverError, serverConnected, serverDisconnectedTimeOut } from './store/system/actions';

//const socket = io('https://chat-cafe-app-server.herokuapp.com/');
const socket = io('http://localhost:8080/');

function App() {
    const loggedIn = useSelector((state: RootState) => state.system.loggedIn);
    const errorMessageFromState = useSelector((state: RootState) => state.system.errorMessage);
    const message = useSelector((state: RootState) => state.system.message);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
    });

    useEffect(() => {
        socket.on('disconnect', (error) => {
            dispatch(serverError({ loggedIn: false, errorMessage: SERVER_DOWN, serverDown: true, message: '' }));
        });
        socket.once('connect_error', (error) => {
            dispatch(serverError({ loggedIn: false, errorMessage: SERVER_UNAVAILABLE, serverDown: true, message: '' }));
        });
        socket.on('connect', () => {
            dispatch(serverConnected({ serverDown: false }));
        });

        socket.on('user disconnected due to inactivity', () => {
            dispatch(
                serverDisconnectedTimeOut({
                    loggedIn: false,
                    userName: '',
                    serverDown: false,
                    errorMessage: TIMEOUT_DISCONNECT,
                }),
            );
        });
        return () => {
            socket.off();
        };
    }, [dispatch]);
    return (
        <div className="App">
            {loggedIn ? <Chat /> : <LandingPage errorMessageFromState={errorMessageFromState} message={message} />}
        </div>
    );
}

export default App;
