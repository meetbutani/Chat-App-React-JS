import './scss/App.scss'
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios'
import EditProfile from './components/Home/EditProfile';

function App() {

  axios.defaults.withCredentials = true;

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/login')
      .then(resp => {
        setUser(resp.data["user"])
        setIsLoggedIn(resp.data.loggedIn);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error)
        setIsLoading(false);
      })
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/home" element={isLoggedIn ? <Home user={{ user: user, setUser: setUser }} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login user={{ user: user, setUser: setUser }} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/editprofile" element={isLoggedIn ? <EditProfile user={{ user: user, setUser: setUser }} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;