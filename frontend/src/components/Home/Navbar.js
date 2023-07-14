import React, { useEffect, useRef, useState } from 'react';
import userImg from '../../images/user-cropped.svg';
import { Link, useNavigate } from 'react-router-dom';
import addContact from '../../images/add-contact.svg'
import axios from 'axios';

const Navbar = ({ user, handelAddContact, isEditProfile }) => {

    const navigate = useNavigate();
    const [showHideDetails, setShowHideDetails] = useState('none');
    const [showHideAddContact, setShowHideAddContact] = useState('none');
    const userDetailsRef = useRef(null);
    const addContactRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        if (userDetailsRef.current && !userDetailsRef.current.contains(event.target) && event.target.className !== 'profile-img') {
            setShowHideDetails('none');
        }

        if (addContactRef.current && !addContactRef.current.contains(event.target)) {
            setShowHideAddContact('none');
        }
    }

    function handelLogout() {
        user.setUser({});
        axios.delete('http://localhost:3001/api/logout')
            .then(resp => {
                if (resp.data) {
                    navigate("/login");
                }
            })
            .catch(error => console.log(error));
    }

    function handelEditProfile() {
        navigate('/editprofile')
    }

    function handelDetails() {
        setShowHideDetails(prevState => prevState === 'none' ? 'flex' : 'none');
    }

    function handelAddContactPopup() {
        setShowHideAddContact(prevState => prevState === 'none' ? 'flex' : 'none');
    }

    const [formData, setFormData] = useState({
        userName: '',
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
    };

    function handleStartChatClick() {
        axios.post('http://localhost:3001/api/addcontact', { userName: formData.userName })
            .then(resp => {
                setFormData({userName: ''});
                setShowHideAddContact('none');
                // console.log(resp.data);
            })
            .catch(error => console.log(error));
    }

    return (
        <div className='navbar'>
            <div className='col'>
                <Link to={'/home'}><span className='main-heading'>Contacts</span></Link>
            </div>
            <div className='col' >
                {!isEditProfile ? (<img className='add-contact' src={addContact} alt='' onClick={handelAddContactPopup} />) : (<></>)}
                <img className='profile-img' src={user.user["avatar"] ? "http://localhost:3001/uploads/profile-image/" + user.user._id + ".jpg?cache=" + Math.random() : userImg} alt='' onClick={handelDetails} />
                <div ref={userDetailsRef} className='userDetails' style={{ display: showHideDetails }}>
                    <span className='username'>@{user.user.userName}</span>
                    <span className='name'>{user.user.firstName + " " + user.user.lastName}</span>
                    <span className='logout' onClick={handelLogout}>Logout</span>
                    <span className='edit' onClick={handelEditProfile}>Edit Profile</span>
                </div>
                <div className='addContactPopup' style={{ display: showHideAddContact }}>
                    <div className='popupback' ref={addContactRef}>
                        <div className="form-field">
                            <label htmlFor="userName">Username</label>
                            <div className='flex-d-col'>
                                <div className='input-field'>
                                    <input type='text' id="userName" name="userName" value={formData.userName} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="form-field">
                            <button type="button" onClick={handleStartChatClick}>Let's Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar