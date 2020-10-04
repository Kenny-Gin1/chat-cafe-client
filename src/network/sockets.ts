import { serverDisconnectedTimeOut } from '../store/system/actions';
import { TIMEOUT_DISCONNECT } from '../store/system/messages';

export const userJoinedChat = (socket, setAllChats) => {
    socket.on('user has joined', (user) => {
        setAllChats((prev) => [...prev, { joinedUser: user }]);
    });
};

export const userLeftChatMessage = (socket, setAllChats) => {
    socket.on('user has left', (user) => {
        setAllChats((prev) => [...prev, { leftUser: user }]);
    });
};

export const userInactivityDisconnect = (socket, dispatch) => {
    socket.on('user disconnected due to inactivity', (user) => {
        dispatch(serverDisconnectedTimeOut({
            loggedIn: false,
            userName: '',
            serverDown: false,
            errorMessage: TIMEOUT_DISCONNECT,
         }),
        )
    })
}

export const receiveMessages = (socket, setAllChats) => {
    socket.on('receive messages', (event) => {
        const newMessages = JSON.parse(event);
        setAllChats((prev) => [...prev, newMessages]);
    });
};

export const sendMessages = async (socket, lastMessage, setAllChats) => { 
    socket.emit('send messages', JSON.stringify(lastMessage)) 
    setAllChats((prev) => [...prev, lastMessage]);
}; 

export const userLeavingEmitAction = (socket, currUser) => socket.emit('user has left', currUser);

export const userHasDisconnectedAction = (socket, currUser) => socket.emit('disconnect', currUser);

export const sendUserName = (socket, userName) => socket.emit('send-username', userName);

export const checkUserName = (socket, userName) => socket.emit('check-username', userName);
