import styles from './styles.module.css';
import React, { useState, useEffect, useRef } from 'react';

const Messages = ({socket}) => {
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [messageTxt, setMessageTxt] = useState('');
    const messagesColumnRef = useRef(null);



    useEffect( () => {
        
        socket.on('receive_messages', (data) => {
            console.log(data);
            if(typeof data == 'string'){ // prevent to receive the message data from object
                setMessageTxt(data);
            }
            
            // let tmp = {
            //     message: data.message,
            //     username: data.username,
            //     __createdtime__ : formatDateFromTimestamp(data.__createdtime__),
            //     __timestamp__: data.__createdtime__
            // };
            
            // let dataWrapper = [tmp];

            // setMessagesReceived( (messagesReceived) => messagesReceived.concat([...dataWrapper]));
        });

        // remove event listener on component unmount

        return () => socket.off('receive_message');

      
    }, [socket]);

    useEffect( () => {
        console.log(messageTxt);
        if(messageTxt !== ''){
            
            let newMessage = JSON.parse(messageTxt);

            setMessagesReceived( (state) => [
                ...state, {
                    message: newMessage.message,
                    username: newMessage.username,
                    __createdtime__: formatDateFromTimestamp(newMessage.__createdtime__),
                    __timestamp__: newMessage.__createdtime__
                }
            ]);
        }

        setMessageTxt('');
    
    }, [messageTxt]);



    useEffect( () => {

        socket.on('last_100_messages', (last100Messages) => {
           
            let tmpLast100Msg = [];
            for(let i = 0; i < last100Messages.length; i++){
                let tmp = {
                    message: last100Messages[i].message,
                    username: last100Messages[i].username,
                    __createdtime__: formatDateFromTimestamp(last100Messages[i].created_at),
                    __timestamp__: last100Messages[i].created_at,
                }
                tmpLast100Msg.push(tmp);
            }


            let newLast100Msg = sortMessagesByDate(tmpLast100Msg);
            
             // update multiple element inside array:
            setMessagesReceived( (messagesReceived) => messagesReceived.concat([...newLast100Msg]));
        });

        return () => socket.off('last_100_messages')
    }, [socket]);


    useEffect( () => {
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]);

    


    function sortMessagesByDate(messages){
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }


    function formatDateFromTimestamp(timestamp){
        const date = new Date(timestamp);
        return date.toLocaleString();
    }



    return (
        <div className={styles.messageColumn} ref={messagesColumnRef}>
            {
                messagesReceived.map((msg, i) => {
                    return(
                        <div className={styles.message} key={i}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span className={styles.msgMeta}>{msg.username}</span>
                                <span className={styles.msgMeta}>
                                    {/* {formatDateFromTimestamp(msg.__createdtime__)} */}
                                    {msg.__createdtime__}
                                </span>
                            </div>
                            <p className={styles.msgText}>{msg.message}</p>
                            <br/>
                            
                        </div>
                    );
                    
                })
            }
        </div>
    );
};

export default Messages;