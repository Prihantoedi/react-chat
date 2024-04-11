// import React from 'react';

import styles from './styles.module.css';
import RoomAndUsers from './room-and-users';
import MessageReceived from './messages';
import SendMessage from './send-message';


const Chat = ({username, room, socket}) => {
  return (
    <div className={styles.chatContainer}>

        <RoomAndUsers socket={socket} username={username} room={room} />
        <div>
            <MessageReceived socket={socket}/>
            <SendMessage socket={socket} username={username} room={room} />
        </div>
    </div>
  );
}

export default Chat;