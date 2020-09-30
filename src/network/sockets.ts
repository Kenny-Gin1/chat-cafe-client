export const userJoinedChat = (socket, setAllChats) => {
    socket.on('user has joined', (user) => {
        setAllChats((prev) => [...prev, { joinedUser: user }]);
    });
    return () => socket.off('user has joined')
};

export const userLeftChatMessage = (socket, setAllChats) => {
    socket.on('user has left', (user) => {
        setAllChats((prev) => [...prev, { leftUser: user }]);
        socket.disconnect();
    });
    return () => socket.off('user has left')
};

export const receiveMessages = (socket, setAllChats) => {
    socket.on('news', (event) => {
        const newMessages = JSON.parse(event);
        setAllChats((prev) => [...prev, newMessages]);
    });
    return () => socket.off('news')
};

export const sendMessages = async (socket, lastMessage) => socket.emit('news', JSON.stringify(lastMessage));

export const userLeavingEmitAction = (socket, currUser) => socket.emit('user has left', currUser);

export const userHasDisconnectedAction = (socket, currUser) => socket.emit('disconnect', currUser);

export const sendUserName = (socket, userName) => socket.emit('send-username', userName);

export const checkUserName = (socket, userName) => socket.emit('check-username', userName);
