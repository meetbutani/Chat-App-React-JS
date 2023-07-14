import React, { useEffect, useState, useRef } from 'react'
import '../../scss/ChatIndividual.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Chat from './Chat';
// import io from 'socket.io-client';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const ChatIndividual = ({ user, selectedChat }) => {
  // console.log("selectedchat",selectedChat);
  // const [socket, setSocket] = useState(null);
  const [response, setResponse] = useState({});
  const [message, setMessage] = useState('');
  const socket = useRef();


  // useEffect(() => {
  //   // Establish a socket connection
  //   const newSocket = io('http://localhost:3001');
  //   setSocket(newSocket);

  //   // Clean up the socket connection on component unmount
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   // Receive new messages from the server
  //   if (socket) {
  //     socket.on('message', (data) => {
  //       // Update the chat state with the received message
  //       setResponse((prevState) => [...prevState, data]);
  //     });
  //   }
  // }, [socket]);

  // useEffect(() => {
  //   socket.current = io('http://localhost:3001');
  //   socket.current.emit("add-user", user.userName);
  // }, []);

  useEffect(() => {
    fetchChats();
    // console.log("selectedChat", selectedChat);
  }, [selectedChat.userName]);

  // useEffect(() => {
  //   console.log(response);
  // }, [response])

  // Connect to the Socket.io server
  // useEffect(() => {
  //   const socket = io('http://localhost:3001');

  //   // Handle new message event
  //   socket.on('newMessage', (message) => {
  //     // Update the chat with the new message
  //     setResponse((prevResponse) => ({
  //       data: [...prevResponse.data, message],
  //     }));
  //   });

  //   return () => {
  //     // Disconnect from the Socket.io server when component unmounts
  //     socket.disconnect();
  //   };
  // }, []);

  // const socket = io('http://localhost:3001');
  // useEffect(() => {

  //   // Listen for new message event
  //   socket.on('newMessage', (message) => {
  //     // Check if the message is for the selected receiver
  //     console.log("New message: ", message);
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
  // }, [selectedChat.userName]);

  function handleMessageSend(event) {
    event.preventDefault();
    // console.log("Clicked", message);
    // if (socket) {
    //   // Emit the message event to the server
    //   socket.emit('message', { sender: user, receiver: selectedChat.userName, message: message });

    //   // Clear the input field
    //   setMessage('');
    // }

    // setMessage('');

    // Emit the new message event to the Socket.io server
    // socket.emit('newMessage', { receiver: selectedChat.userName, message });

    // // Send the message to the server as before
    // axios
    //   .post('http://localhost:3001/api/sendchat', {
    //     receiver: selectedChat.userName,
    //     message: message,
    //   })
    //   .then((resp) => console.log(resp))
    //   .catch((error) => console.log(error));

    socket.current.emit("send-msg", {
      receiver: selectedChat.userName,
      message: message,
    });


    setMessage("");
    axios.post("http://localhost:3001/api/sendchat", { receiver: selectedChat.userName, message: message })
      // .then(resp => console.log(resp))
      .catch(error => console.log(error));
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
