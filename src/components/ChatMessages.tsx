import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { writeToDataBase, getLastMessageAndSend } from '../lib/db';
import { Button } from '@material-ui/core';
import { sendMessages } from '../network/sockets';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/index';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { userJoinedChat, userLeftChatMessage, receiveMessages } from '../network/sockets';
import { sendMessage } from '../store/chat/actions';

// const socket = io('https://chat-cafe-app-server.herokuapp.com/');
const socket = io('http://localhost:8080/');

const useStyles = makeStyles((theme) => ({
    messageList: {
        background: 'white',
        height: '100%',
        paddingLeft: '30px',
        paddingRight: '30px',
        overflowY: 'scroll',
        justifyContent: 'flex-end',
        '&::before': {
            content: '""',
            height: '80vh',
            width: '100%',
            display: 'block',
        },
    },

    messageRow: {
        display: 'grid',
        gridTemplateColumns: '70%',
        marginBottom: '20px',
        alignContent: 'end',
        minHeight: '0',
    },

    messageContent: {
        display: 'grid',
        minHeight: '0',
    },

    messageText: {
        padding: '9px 14px',
        fontSize: '1.6rem',
        marginBottom: '5px',
    },
    messageTime: {
        fontSize: '0.9rem',
        color: '#777',
    },
    myMessages: {
        color: '#eee',
        borderRadius: '14px 14px 0 14px',
        justifyContent: 'end',
        justifyItems: 'end',
        '& $messageContent': {
            justifyItems: 'end',
        },
        '& $messageText': {
            background: '#0048AA',
            color: '#eee',
            border: '1px solid #0048AA',
            borderRadius: '14px 14px 0 14px',
        },
        '& $messageTime': {
            background: '#fff',
            border: '0px transparent',
        },
    },
    otherMessages: {
        color: '#111',
        borderRadius: '14px 14px 14px 0',
        justifyContent: 'start',
        justifyItems: 'start',

        '& $messageContent': {
            justifyItems: 'start',
        },
        '& $messageText': {
            background: '#eee',
            color: '#111',
            border: '1px solid #ddd',
            borderRadius: '14px 14px 14px 0',
        },
        '& $messageTime': {
            background: '#fff',
        },
    },

    avatarHolder: {
        gridRow: 'span 2',
        color: 'black',
    },
    chatForm: {
        alignContent: 'center',
        alignItems: 'center',
        gridGap: '15px',
        background: '#eee',
        borderRadius: '0 0 10px 10px',
        borderTop: '1px solid rgba(0,0,0,0.25)',
        padding: '22px',
        height: '71px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',

        '& input': {
            outline: 'none',
            padding: '15px',
            border: '2px solid #ddd',
            color: '#330',
            borderRadius: '6px 0 0 6px',
            fontSize: '1.4rem',
            maxWidth: '100%',
            minWidth: '90%',
            boxSizing: 'border-box',
        },
    },
    sendButton: {
        padding: '15px',
    },
}));

export default function ChatMessages({ id, user }) {
    const [userChatTemp, setUserChatTemp] = useState('');
    const [allChats, setAllChats] = useState([]);
    const loggedIn = useSelector((state: RootState) => state.system.loggedIn);
    const currentUsersMessages = useSelector((state: RootState) => state.chat.messages);
    const classes = useStyles();
    const dispatch = useDispatch();
    const timestamp = Date.now();
    const message = userChatTemp;
    const messageListRef = useRef<HTMLDivElement | null>(null);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const handleMessages = async (snapshot) => {
        const data = snapshot.val();
        if (data.message !== null && data.message !== '' && data.message !== undefined) {
            await sendMessages(socket, data);
        }
        return;
    };

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
    });
    useEffect(() => {
        userJoinedChat(socket, setAllChats);
        userLeftChatMessage(socket, setAllChats);
    }, [loggedIn]);

    useEffect(() => {
        receiveMessages(socket, setAllChats);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [allChats]);
    useEffect(() => {
        if (currentUsersMessages.length !== 0) {
            writeToDataBase(currentUsersMessages);
        }
        getLastMessageAndSend(handleMessages);
    }, [currentUsersMessages]);

    const submitMessage = async (e: React.MouseEvent | React.FormEvent) => {
        e.preventDefault();
        dispatch(sendMessage({ user, id, message, timestamp }));
        setUserChatTemp('');
    };
    const handleChange = async (e) => await setUserChatTemp(e.target.value);

    const scrollToBottom = () =>
        messageListRef?.current?.scrollTo({
            top: bottomRef?.current?.offsetTop,
            behavior: 'smooth',
        });

    return (
        <React.Fragment>
            <div className={classes.messageList} ref={messageListRef}>
                {allChats.map((chat: Record<string, number>) => {
                    return (
                        <div
                            key={chat.timestamp ? chat.timestamp : null}
                            className={`${classes.messageRow} ${
                                chat.user === user ? classes.myMessages : classes.otherMessages
                            }`}
                        >
                            <div className={classes.messageContent} key={chat.timestamp ? chat.timestamp : null}>
                                <p className={classes.avatarHolder}>{chat.user ? chat.user : null}</p>
                                <div className={classes.messageText}>
                                    {chat.message ? chat.message : null}
                                    {chat.joinedUser ? chat.joinedUser : null}
                                    {chat.leftUser ? chat.leftUser : null}
                                </div>
                                <div className={classes.messageTime}>{chat.messageTime ? chat.messageTime : null}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef}></div>
            </div>
            <form className={classes.chatForm} onSubmit={submitMessage}>
                <input
                    type="text"
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    value={userChatTemp || ''}
                    placeholder="type a message..."
                />
                <span>
                    <Button
                        className={classes.sendButton}
                        variant="contained"
                        color="primary"
                        size="small"
                        type="text"
                        href=""
                    >
                        Send
                    </Button>
                </span>
            </form>
        </React.Fragment>
    );
}

ChatMessages.propTypes = {
    id: PropTypes.string,
    user: PropTypes.string,
};
