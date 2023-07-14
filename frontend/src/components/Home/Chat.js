import React from 'react'

const Chat = ({ chat, type, last }) => {
    return (
        <div className={type}>
            <div className={'chat' + (last ? " last" : "")}>
                <span className='message'>{chat.message}</span>
                <div className='time'>{chat.time}</div>
            </div>
        </div>
    )
}

export default Chat