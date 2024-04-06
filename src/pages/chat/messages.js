import styles from './styles.module.css';
import React, { useState, useEffect, useRef } from 'react';

const Messages = ({socket}) => {
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [sampleText, setSampleText] = useState('');
    const messagesColumnRef = useRef(null);

    const messageSocket = () => {
        socket.on('receive_messages', (data) => {
            setSampleText(`${data}receive_messages`);
     
        });

        // remove event listener on component unmount

        return () => socket.off('receive_message');

    }


    // useEffect( () => {
        
    //     messageSocket();

      
    // }, [socket]);

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

            // let newLast100Msg = tmpLast100Msg.sort(
            //     (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
            // );

            let newLast100Msg = sortMessagesByDate(tmpLast100Msg);
            
             // update multiple element inside array:
            setMessagesReceived( (messagesReceived) => messagesReceived.concat([...newLast100Msg]));
        });

        return () => socket.off('last_100_messages')
    }, [socket]);

    useEffect( () => {
        if(sampleText != ''){
            
            const textToJson = JSON.parse(sampleText);
            setMessagesReceived( (state) => [
                ...state, 
                {
                    message: textToJson.message, 
                    username: textToJson.username,
                    __createdtime__: formatDateFromTimestamp(textToJson.__createdtime__),
                    __timestamp__: textToJson.__createdtime__,
                },
            ]);            
        }

    }, [sampleText]);





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
        <div className={styles.messageColumn}>
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