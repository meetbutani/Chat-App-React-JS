import React from 'react'
import userImg from '../../images/user-cropped.svg'
import online from '../../images/online.svg'
import offline from '../../images/offline.svg'
import recentOn from '../../images/recently-online.svg'

import Messagebtn from '../imageComponent/MessageBtn'
import CallBtn from '../imageComponent/CallBtn'
import OtherActionBtn from '../imageComponent/OtherActionBtn'

const ContactCard = ({ contact, handleContactClick, handelChatClick }) => {

    const onlinelist = { "on": online, "rec": recentOn, "off": offline }
    const srcPrefix = 'http://localhost:3001/uploads/profile-image/'

    return (
        <div className='contact-card' onClick={handleContactClick}>
            <div className='profile-img'>
                <img className='profile' src={contact["avatar"] ? srcPrefix + contact._id + '.jpg?c=' + Math.random() : userImg} alt='' />
                <img className='online-status' src={onlinelist[contact.online]} alt='' />
            </div>
            <div className='contact-info'>
                <span className='name'>{contact.firstName + " " + contact.lastName}</span>
                <span className='jobTitle'>{contact.jobPos}</span>
            </div>
            <div className='actions'>
                <button type='button' onClick={handelChatClick}>
                    <Messagebtn />
                </button>
                <a href={"tel:+91" + contact.primPhone} >
                    <CallBtn />
                </a>
                <button type='button'>
                    <OtherActionBtn />
                </button>
            </div>
        </div>
    )
}

export default ContactCard;