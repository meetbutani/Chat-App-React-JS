import '../scss/Registration.scss';
import React, { useState } from 'react'
import PasswordShowHideBtn from './imageComponent/PasswordShowHideBtn';
import md5 from 'md5';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registration = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    primEmail: '',
    primPhone: '',
    password: '',
    conpassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    console.log('Clicked', validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Registration logic
      axios.post('http://localhost:3001/api/register', { ...formData, 'password': md5(formData.password) })
        // .then(resp => resp.json())
        .then(resp => {
          setErrors({
            'userName': resp.data["userName"] ? 'Username already taken' : '',
            'primEmail': resp.data["primEmail"] ? 'Email already exist' : ''
          })

          console.log(resp.data);

          if (!resp.data["userName"] && !resp.data["primEmail"]) {
            navigate("/login");
          }
        })
        .catch(error => console.log(error));
    }
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

    if (formData.userName.trim() === '') {
      errors.userName = 'Username is required';
    }

    if (formData.password.trim() === '') {
      errors.password = 'Password is required';
    } else if (formData.password.trim().length < 6) {
      errors.password = 'Password length must be greater than 5';
    }

    if (formData.conpassword.trim() === '') {
      errors.conpassword = 'Confirm Password is required';
    } else if (formData.password.trim() !== formData.conpassword.trim()) {
      errors.conpassword = 'Password and Confirm Password must be same';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    setErrors(errors);
    return errors;
  };

  const isValidEmail = (email) => {
    // Email validation logic (you can use a library or custom regex)
    // Example regex pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return true;
  };

  return (
    <div className="registration">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h1 className="main-heading">Registration Page</h1>
        <div className='col-2'>
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <div className='input-field'>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <div className='input-field'>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="primEmail">Email</label>
          <div className='input-field'>
            <input type="email" id="primEmail" name="primEmail" value={formData.primEmail} onChange={handleChange} />
          </div>
          {errors.primEmail && <span className="error-message">{errors.primEmail}</span>}
        </div>
        <div className='col-2'>
          <div className="form-field">
            <label htmlFor="userName">Username</label>
            <div className='input-field'>
              <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} />
            </div>
            {errors.userName && <span className="error-message">{errors.userName}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="primPhone">Phone Number</label>
            <div className='input-field'>
              <input type="text" id="primPhone" name="primPhone" value={formData.primPhone} onChange={handleChange} />
            </div>
            {errors.primPhone && <span className="error-message">{errors.primPhone}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className='input-field'>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
            <PasswordShowHideBtn width={"30px"} fill={"#D3D3D3"} id={"password"} />
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="conpassword">Confirm Password</label>
          <div className='input-field'>
            <input type="password" id="conpassword" name="conpassword" value={formData.conpassword} onChange={handleChange} />
            <PasswordShowHideBtn width={"30px"} fill={"#D3D3D3"} id={"conpassword"} />
          </div>
          {errors.conpassword && <span className="error-message">{errors.conpassword}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="acceptTerms">
            <input type="checkbox" id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
            Accept Terms and Conditions
          </label>
          {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
        </div>
        <div className="form-field">
          <button type="submit">Register</button>
        </div>
        <div className="form-field">
          <span className='RegisterToLogin'>Already have an account? Go to the <Link to="/login">login page</Link>.</span>
        </div>
      </form>
    </div>
  );
}

export default Registration
