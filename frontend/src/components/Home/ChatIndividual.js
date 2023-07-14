import React, { useEffect, useState, useRef } from 'react'
import '../../scss/ChatIndividual.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Chat from './Chat';
import io from 'socket.io-client';

const ChatIndividual = ({ user, selectedChat }) => {
  // console.log("selectedchat",selectedChat);
  const [response, setResponse] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchChats();
    // console.log("selectedChat", selectedChat);
  }, [selectedChat.userName]);

  // useEffect(() => {
  //   console.log(response);
  // }, [response])

  // const socket = io('http://localhost:3001');

  // useEffect(() => {

  //   // Listen for new message event
  //   socket.on('newMessage', (message) => {
  //     // Check if the message is for the selected receiver
  //     console.log(message);
  //     if (message.receiver === user.userName) {
  //       // Update the chat with the new message
  //       setResponse((prevResponse) => ({
  //         data: [...prevResponse.data, message],
  //       }));
  //     }
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3001');

    // Join the room corresponding to the selected chat user
    socket.current.emit('joinRoom', user.userName);

    // Cleanup function
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Listen for received messages
    socket.current.on('messageReceived', (data) => {
      // Update the chat messages with the received message
      console.log("New Message:", data.message, data.message.sender === selectedChat.userName);
      if (data.message.sender === selectedChat.userName) {
        setResponse((prevResponse) => {
          return {
            ...prevResponse,
            data: [...prevResponse.data, data.message],
          };
        });
      }
    });

    console.log("selectedChat", selectedChat);
  }, [selectedChat.userName]);


  function handleMessageSend(event) {
    event.preventDefault();

    // Emit the new message event to the Socket.io server
    // socket.emit('newMessage', { receiver: selectedChat.userName, message });
    socket.current.emit('sendMessage', {
      receiver: selectedChat.userName, message: {
        message: message,
        time: new Date().toISOString(),
        _id: new Date().getTime(),
        sender: user.userName
      }
    });

    setMessage("");
    // axios.post("http://localhost:3001/api/sendchat", { receiver: selectedChat.userName, message: message })
    //   // .then(resp => console.log(resp))
    //   .catch(error => console.log(error));
  }

  function fetchChats() {
    axios.post("http://localhost:3001/api/getchat", { selected: selectedChat.userName })
      .then(resp => setResponse(resp.data))
      // .then(resp => console.log(resp.data))
      .catch(error => console.log(error));
  }

  return (
    <div className='chatIndiavidual'>
      <div className='chatheader'>
        <div className='contact-info'>
          <span className='name'>{selectedChat.firstName} {selectedChat.lastName}</span>
          <span className='status'>{selectedChat['online'] === 'on' ? 'Online' : selectedChat.online === 'rec' ? 'Recently Online' : 'Offline'}</span>
        </div>
      </div>
      <div className='chatarea'>
        <div className='chats'>
          {/* <div className='sender'>
                <div className='chat'>
                    <span className='message'>Hello</span>
                    <div className='time'>{new Date().toISOString()}</div>
                </div>
            </div>
            <div className='receiver'>
                <div className='chat'>
                    <span className='message'>Hello</span>
                    <div className='time'>{new Date().toISOString()}</div>
                </div>
            </div> */}

          {response["data"] ? response.data.map((chat, index, self) => <Chat key={chat._id} type={chat.sender === user.userName ? "sender" : "receiver"} chat={chat} last={self[index + 1]?.sender !== chat.sender} />) : <span className='loading'>Loading...</span>}
        </div>
      </div>
      <form className='message-form' onSubmit={handleMessageSend}>
        <div className='messagebar'>
          <input type="text" id="message-input" onChange={(event) => setMessage(event.target.value)} value={message} placeholder='Your Message' />
          <button type='button' onClick={handleMessageSend}>
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ffffff", }} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatIndividual
