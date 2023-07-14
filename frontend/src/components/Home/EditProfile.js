import React, { useState } from 'react'
import Facebook from '../imageComponent/Facebook'
import Printerest from '../imageComponent/Printerest'
import Twitter from '../imageComponent/Twitter'
import LinkedIn from '../imageComponent/LinkedIn'
import Google from '../imageComponent/Google'

import ProfileImage from '../ImageCropComponent/ProfileImage'
import axios from 'axios';
import Navbar from './Navbar'

const EditProfile = ({ user }) => {
    // console.log(editDetails);
    // const isEdit = !!Object.keys(editDetails).length;
    const [imgData, setImgData] = useState('');

    // console.log(user.user);

    const [formData, setFormData] = useState({
        firstName: user.user['firstName'] ? user.user.firstName : '',
        lastName: user.user['lastName'] ? user.user.lastName : '',
        jobPos: user.user['jobPos'] ? user.user.jobPos : '',
        primPhone: user.user['primPhone'] ? user.user.primPhone + "" : '',
        secPhone: user.user['secPhone'] ? user.user.secPhone + "" : '',
        primEmail: user.user['primEmail'] ? user.user.primEmail : '',
        secEmail: user.user['secEmail'] ? user.user.secEmail : '',
        bio: user.user['bio'] ? user.user.bio : '',
        bday: user.user['bday'] ? user.user.bday : '',
        meeting: user.user['meeting'] ? user.user.meeting : '',
        facebook: user.user['facebook'] ? user.user.facebook : '',
        pinterest: user.user['pinterest'] ? user.user.pinterest : '',
        twitter: user.user['twitter'] ? user.user.twitter : '',
        linkedin: user.user['linkedin'] ? user.user.linkedin : '',
        google: user.user['google'] ? user.user.google : '',
    });

    // useEffect(() => {
    //     if (!isEdit) {
    //         setFormData({ firstName: '', lastName: '', jobPos: '', primPhone: '', secPhone: '', primEmail: '', secEmail: '', bio: '', bday: '', meeting: '', facebook: '', pinterest: '', twitter: '', linkedin: '', google: '' });
    //         setImgData('');
    //     }
    // }, [isEdit])

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
    };

    const validateForm = () => {
        const errors = {};
        if (formData.firstName.trim() === '') {
            errors.firstName = 'First name is required';
        }

        if (formData.lastName.trim() === '') {
            errors.lastName = 'Last name is required';
        }

        if (formData.primEmail.trim() === '') {
            errors.primEmail = 'Email is required';
        } else if (!isValidEmail(formData.primEmail)) {
            errors.primEmail = 'Invalid email format';
        }

        if (formData.primPhone.trim() === '') {
            errors.primPhone = 'Phone Number is required';
        }
        setErrors(errors);
        return errors;
    };

    const isValidEmail = (email) => {
        // Email validation logic (you can use a library or custom regex)
        // Example regex pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return true;
    };

    // function handleAddSaveClick(e) {
    //     e.preventDefault();
    //     if (Object.keys(validateForm()).length === 0) {
    //         // Contact save logic
    //         // console.log({ ...(Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== ''))), owner: user["_id"] });
    //         axios.post('http://localhost:3001/api/addcontact', { ...(Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== ''))), owner: user["_id"], avatar: !!imgData })
    //             .then(async resp => {
    //                 if (imgData && resp.data["success"]) {
    //                     const response = await axios.post('http://localhost:3001/api/upload-contact-image', {
    //                         image: imgData,
    //                         fileName: resp.data.data['_id'],
    //                     });

    //                     if (response.data["uploaded"]) {
    //                         // console.log('Image uploaded:', response.data);
    //                     } else {
    //                         console.log('Image Upload Fail:', response.data);
    //                     }
    //                 }
    //             })
    //             .catch(error => console.log(error));
    //     }
    // }

    function handleEditSaveClick(e) {
        e.preventDefault();
        if (Object.keys(validateForm()).length === 0) {
            // console.log({ ...formData, avatar: !!imgData || editDetails['avatar'], _id: editDetails._id });
            // console.log({ ...(Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== user[key] + ""))), avatar: user.user['avatar'] || !!imgData });
            axios.put('http://localhost:3001/api/updateprofile', { ...(Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== user.user[key] + ""))), avatar: user.user['avatar'] || !!imgData })
                .then(async resp => {
                    console.log(resp.data);
                    if (!!imgData && resp.data.data["acknowledged"]) {
                        const response = await axios.post('http://localhost:3001/api/upload-profile-image', {
                            image: imgData,
                        });

                        if (response.data["uploaded"]) {
                            user.setUser({...user.user, avatar: true});
                            // console.log('Image uploaded:', response.data);
                        } else {
                            console.log('Image Upload Fail:', response.data);
                        }
                    }
                })
                .catch(error => console.log(error));
        }

    }
    return (
        <>
            <Navbar handelAddContact={() => ''} user={user} isEditProfile={true} />
            <div className='add-contact'>
                <div className="form-field savebtn">
                    <button type="button" onClick={handleEditSaveClick}>{"Update"}</button>
                </div>
                <div className='profile-info'>
                    <ProfileImage avatar={user.user["avatar"]} imgData={{ imgData: imgData, setImgData: setImgData }} fileName={user.user["avatar"] ? user.user._id : ''} srcPrefix={'http://localhost:3001/uploads/profile-image/'} />
                    {/* <ProfileImage avatar={false} imgData={{ imgData: imgData, setImgData: setImgData }} fileName={user.user['avatar'] ? user.user._id : ''} srcPrefix={'http://localhost:3001/uploads/contact-image/'} /> */}

                    {/* <ProfileImage avatar={true} imgData={{ imgData: imgData, setImgData: setImgData }} fileName={user['_id']} srcPrefix={'http://localhost:3001/uploads/profile-image/'} /> */}

                    <div className='contact-info'>
                        <div className='col-multi'>
                            <div className="form-field col">
                                <label htmlFor="firstName">First Name</label>
                                <div className='input-field'>
                                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>
                                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                            </div>
                            <div className="form-field col">
                                <label htmlFor="lastName">Last Name</label>
                                <div className='input-field'>
                                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>
                                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                            </div>
                        </div>
                        <div className="form-field col mb-0">
                            <label htmlFor="jobPos">Job Position</label>
                            <div className='input-field'>
                                <input type="text" id="jobPos" name="jobPos" value={formData.jobPos} onChange={handleChange} />
                            </div>
                            {/* {errors.jobPos && <span className="error-message">{errors.jobPos}</span>} */}
                        </div>
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="userName">Username</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="userName" name="userName" value={user.user.userName} onChange={handleChange} disabled />
                        </div>
                        {/* {errors.userName && <span className="error-message">{errors.userName}</span>} */}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="primPhone">Primary Phone</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="primPhone" name="primPhone" value={formData.primPhone} onChange={handleChange} />
                        </div>
                        {errors.primPhone && <span className="error-message">{errors.primPhone}</span>}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="secPhone">Secondary Phone</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="secPhone" name="secPhone" value={formData.secPhone} onChange={handleChange} />
                        </div>
                        {/* {errors.secPhone && <span className="error-message">{errors.secPhone}</span>} */}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="primEmail">Primary Email</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='email' id="primEmail" name="primEmail" value={formData.primEmail} onChange={handleChange} />
                        </div>
                        {errors.primEmail && <span className="error-message">{errors.primEmail}</span>}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="secEmail">Secondary Email</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='email' id="secEmail" name="secEmail" value={formData.secEmail} onChange={handleChange} />
                        </div>
                        {/* {errors.secEmail && <span className="error-message">{errors.secEmail}</span>} */}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="bio">Bio</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <textarea id="bio" name="bio" rows={3} value={formData.bio} onChange={handleChange} />
                        </div>
                        {/* {errors.bio && <span className="error-message">{errors.bio}</span>} */}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="bday">Birth Date</label>
                    <div className='flex-d-col'>
                        <div className='input-field fit-content'>
                            <input type='date' id="bday" name="bday" value={formData.bday} onChange={handleChange} />
                        </div>
                        {/* {errors.bday && <span className="error-message">{errors.bday}</span>} */}
                    </div>
                </div>

                <div className="form-field row">
                    <label htmlFor="meeting">Meeting</label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="meeting" name="meeting" value={formData.meeting} onChange={handleChange} />
                        </div>
                        {/* {errors.meeting && <span className="error-message">{errors.meeting}</span>} */}
                    </div>
                </div>

                <span className='socialTitle'>Social Media Links</span>
                <div className="form-field row">
                    <label htmlFor="facebook">Facebook&#x3164;<Facebook /></label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} />
                        </div>
                        {/* {errors.facebook && <span className="error-message">{errors.facebook}</span>} */}
                    </div>
                </div>
                <div className="form-field row">
                    <label htmlFor="pinterest">Pinterest&#x3164;<Printerest /></label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="pinterest" name="pinterest" value={formData.pinterest} onChange={handleChange} />
                        </div>
                        {/* {errors.pinterest && <span className="error-message">{errors.pinterest}</span>} */}
                    </div>
                </div>
                <div className="form-field row">
                    <label htmlFor="twitter">Twitter&#x3164;<Twitter /></label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} />
                        </div>
                        {/* {errors.twitter && <span className="error-message">{errors.twitter}</span>} */}
                    </div>
                </div>
                <div className="form-field row">
                    <label htmlFor="linkedin">Linkedin&#x3164;<LinkedIn /></label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                        </div>
                        {/* {errors.linkedin && <span className="error-message">{errors.linkedin}</span>} */}
                    </div>
                </div>
                <div className="form-field row">
                    <label htmlFor="google">Google&#x3164;<Google /></label>
                    <div className='flex-d-col'>
                        <div className='input-field'>
                            <input type='text' id="google" name="google" value={formData.google} onChange={handleChange} />
                        </div>
                        {/* {errors.google && <span className="error-message">{errors.google}</span>} */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile
