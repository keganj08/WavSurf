import ReactDOM from 'react-dom/client';
import { 
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from 'react-router-dom';
import React, { useState, useEffect, useLayoutEffect } from 'react';

import LandingContent from './LandingContent.js';
import SignupContent from './SignupContent.js';
import LoginContent from './LoginContent.js';
import BrowseContent from './BrowseContent.js';
import Header from './Header.js';
import Footer from './Footer.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDownload, faPlay, faPause, faBars } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie';

library.add(faDownload, faPlay, faPause, faBars)

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const route = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    });

    useEffect(() => {
        console.log({username : Cookies.get("sessionUsername"), accessToken : Cookies.get("accessToken")});
        fetch('/validateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username : Cookies.get("sessionUsername"), accessToken : Cookies.get("accessToken")})
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            if(data && data == true) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [route]);

    function logout() {
        Cookies.remove("sessionUsername");
        Cookies.remove("accessToken");
        setIsLoggedIn(false);
    }

    return (
        <React.Fragment>
            <Header isLoggedIn = {isLoggedIn} logout = {logout} />
            <Routes>
                <Route path="/" element={<LandingContent />} />
                <Route path="signup" element={<SignupContent />} />
                <Route path="login" element={<LoginContent />} />
                <Route path="browse" element={<BrowseContent />} />
            </Routes>
            <Footer />
        </React.Fragment>
    )        
}

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);