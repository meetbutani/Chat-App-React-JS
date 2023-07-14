import '../scss/Login.scss'
import React, { useEffect, useState } from 'react'
import PasswordShowHideBtn from './imageComponent/PasswordShowHideBtn';
import md5 from 'md5';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn, user }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // login logic
      axios.post(`http://localhost:3001/api/login`, { ...formData, 'password': md5(formData.password) })
        .then(resp => resp.data)
        .then(resp => {
          setErrors({
            'userName': resp["userName"],
            'password': resp["password"],
          })

          if (resp["loggedIn"]) {
            user.setUser(resp["data"])
            setIsLoggedIn(true);
            navigate('/home');
          }
        })
        .catch(error => console.log(error));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.userName.trim() === '') {
      errors.userName = 'Username is required';
    }
    if (formData.password.trim() === '') {
      errors.password = 'Password is required';
    }
    setErrors(errors);
    return errors;
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="main-heading">Login Page</h1>
        <div className="form-field">
          <label htmlFor="userName">Username</label>
          <div className='input-field'>
            <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} />
          </div>
          {errors.userName && <span className="error-message">{errors.userName}</span>}
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
          <button type="submit">Login</button>
        </div>
        <div className="form-field">
          <span className='loginToRegister'>Don't have an account? Visit the <Link to="/registration">registration page</Link>.</span>
        </div>
      </form>
    </div>
  )
}

export default Login
