import React from 'react'
import MessageBtn from '../imageComponent/MessageBtn'
import CallBtn from '../imageComponent/CallBtn'
import ShareBtn from '../imageComponent/ShareBtn'
import OtherActionBtn from '../imageComponent/OtherActionBtn'
import Facebook from '../imageComponent/Facebook'
import Printerest from '../imageComponent/Printerest'
import Twitter from '../imageComponent/Twitter'
import LinkedIn from '../imageComponent/LinkedIn'
import Google from '../imageComponent/Google'
import userImg from '../../images/user-cropped.svg'


const ContactDetails = ({ contact, setDisplayComponenet, handelChatClick }) => {

    const srcPrefix = 'http://localhost:3001/uploads/profile-image/'

    if (!contact) {
        return <div className='contact-details loading'>No contact selected.</div>;
    }

    // function handleEditClick() {
    //     setDisplayComponenet('edit');
    // }

    return (
        <div className='contact-details'>
            {/* <div className="form-field savebtn">
                <button type="button" onClick={handleEditClick}>Edit</button>
            </div> */}
            <div className='profile-info'>
                <img className='profile-img' src={contact["avatar"] ? srcPrefix + contact._id + '.jpg?c=' + Math.random() : userImg} alt='' />
                <div className='contact-info'>
                    <span className='name'>{contact.firstName} {contact.lastName}</span>
                    <span className='jobTitle'>{contact.jobPos}</span>
                    <div className='actions'>
                        <button type='button' onClick={(event) => handelChatClick(event, contact)}>
                            <MessageBtn />
                            <span className='btnTitle'>Message</span>
                        </button>
                        <a href={"tel:+91" + contact.primPhone} >
                            <CallBtn />
                            <span className='btnTitle'>Call</span>
                        </a>
                        <button type='button'>
                            <ShareBtn />
                            <span className='btnTitle'>Share</span>
                        </button>
                        <button type='button'>
                            <OtherActionBtn />
                            <span className='btnTitle'>More</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='detail'>
                <span className='title'>Phone</span>
                <div className='email-phone'>
                    <div className='primary'>
                        <span className='description'>{contact.primPhone}</span>
                        <span className='primary-tag'>Primary</span>
                    </div>
                    {contact["secPhone"] ? (<span className='description'>{contact.secPhone}</span>) : <></>}
                </div>
            </div>

            <div className='detail'>
                <span className='title'>Email</span>
                <div className='email-phone'>
                    <div className='primary'>
                        <span className='description'>{contact.primEmail}</span>
                        <span className='primary-tag'>Primary</span>
                    </div>
                    {contact["secEmail"] ? (<span className='description'>{contact.secEmail}</span>) : <></>}
                </div>
            </div>

            {contact.bio ? (<div className='detail'>
                <span className='title'>Bio</span>
                <span className='description'>{contact.bio}</span>
            </div>) : <></>}

            {contact.bday ? (<div className='detail'>
                <span className='title'>B'Day</span>
                <span className='description'>{contact.bday}</span>
            </div>) : <></>}

            {contact["meeting"] ? (<div className='detail'>
                <span className='title'>Meeting</span>
                <span className='description'>{contact.meeting}</span>
            </div>) : <></>}

            <div className='detail align-center'>
                {contact["facebook"] || contact["pinterest"] || contact["twitter"] || contact["linkedin"] || contact["google"] ? (<span className='title'>Social</span>) : <></>}
                <div className='social'>
                    {contact["facebook"] ? (<a target="_blank" rel="noreferrer" href={'https://www.facebook.com/' + contact.facebook}>
                        <Facebook />
                    </a>) : <></>}
                    {contact["pinterest"] ? (<a target="_blank" rel="noreferrer" href={"https://in.pinterest.com/" + contact.pinterest}>
                        <Printerest />
                    </a>) : <></>}
                    {contact["twitter"] ? (<a target="_blank" rel="noreferrer" href={"https://twitter.com/" + contact.twitter}>
                        <Twitter />
                    </a>) : <></>}
                    {contact["linkedin"] ? (<a target="_blank" rel="noreferrer" href={"https://www.linkedin.com/in/" + contact.linkedin}>
                        <LinkedIn />
                    </a>) : <></>}
                    {contact["google"] ? (<a target="_blank" rel="noreferrer" href={"https://myaccount.google.com/" + contact.google}>
                        <Google />
                    </a>) : <></>}
                </div>
            </div>
        </div>
    )
}

export default ContactDetails