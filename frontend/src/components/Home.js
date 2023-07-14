import Navbar from './Home/Navbar'
import ContactList from './Home/ContactList';
import ContactDetails from './Home/ContactDetails';
import { useState } from 'react';
import '../scss/Home.scss'
import axios from 'axios';
import AddContact from './Home/AddContact';
import ChatIndividual from './Home/ChatIndividual';
const socket = useRef();
import { io } from "socket.io-client";

const Home = ({ user }) => {

    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [displayComponenet, setDisplayComponenet] = useState('details');

    const handleContactClick = (contact) => {
        axios.post(`http://localhost:3001/api/contact`, { userName: contact.userName })
            .then(resp => resp.data)
            // .then(resp => console.log({ ...contact, ...resp.data }))
            .then(resp => setSelectedContact({ ...contact, ...resp.data }))
            .catch(error => console.log(error));
        setDisplayComponenet('details');
    };

    function handelAddContact() {
        setDisplayComponenet(prevState => prevState === 'add' ? 'details' : 'add');
    }

    function handelChatClick(event, contact) {
        event.stopPropagation();
        setSelectedChat({ ...contact })
        setDisplayComponenet('chat');
    }

    useEffect(() => {
        socket.current = io('http://localhost:3001');
        socket.current.emit("add-user", user.userName);
    }, []);

    return (
        <>
            <Navbar handelAddContact={handelAddContact} user={user} />
            <div className='data-container'>
                <ContactList user={user.user} handleContactClick={handleContactClick} handelChatClick={handelChatClick} />
                {displayComponenet === 'details' ? (<ContactDetails contact={selectedContact} setDisplayComponenet={setDisplayComponenet} handelChatClick={handelChatClick} />)
                    : displayComponenet === 'edit' ? (<AddContact user={user.user} editDetails={selectedContact} />)
                        : displayComponenet === 'chat' ? (<ChatIndividual user={user.user} selectedChat={selectedChat} />)
                            : (<AddContact user={user.user} editDetails={{}} />)}
            </div>
        </>
    )
}

export default Home
