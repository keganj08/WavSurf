import ReactDOM from "react-dom/client";
import { 
    BrowserRouter,
    Routes,
    Route,
    useLocation,
    Navigate,
} from "react-router-dom";
import React, { useState, useEffect, useLayoutEffect } from "react";

import Landing from "./pages/Landing.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import Browse from "./pages/Browse.js";
import Users from "./pages/Users.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import MessageModal from "./components/MessageModal.js";

import Cookies from "js-cookie";

import { library } from "@fortawesome/fontawesome-svg-core"
import { faCircleNotch, faUpload, faDownload, faPlay, faPause, faBars, faMagnifyingGlass, faCircleExclamation, 
    faCircleCheck, faCircleInfo, faUser } from "@fortawesome/free-solid-svg-icons"

console.log(Users);

library.add(faCircleNotch, faUpload, faDownload, faPlay, faPause, faBars, faMagnifyingGlass, faCircleExclamation, 
    faCircleCheck, faCircleInfo, faUser);

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const route = useLocation();

    const [showMsg, setShowMsg] = useState(false);
    const [msgType, setMsgType] = useState("confirm");
    const [msgContent, setMsgContent] = useState("Foo bar");

    let msgTimeoutId = undefined;

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [route]);

    useEffect(() => {
        console.log({username : Cookies.get("sessionUsername"), accessToken : Cookies.get("accessToken")});
        fetch("/validateUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollPosition]);

    function handleScroll() { 
        setScrollPosition(window.scrollY)
    };

    async function logout() {
        Cookies.remove("sessionUsername");
        Cookies.remove("accessToken");
        setIsLoggedIn(false, toggleMessage("info", "You have been logged out"));
    }

    function toggleMessage(type, content, length=5000) {
        
        setShowMsg(true);
        setMsgType(type);
        setMsgContent(content);

        if(length >= 0) {
            msgTimeoutId = setTimeout(() => {
                setShowMsg(false);
                msgTimeoutId = undefined;
            }, length);
        }
    }

    return (
        <React.Fragment>
            <Header 
                show = {route.pathname != "/" || scrollPosition > 200} 
                isLoggedIn = {isLoggedIn} 
                logout = {logout} 
                toggleMessage = {(type, content) => toggleMessage(type, content)}
                scrollPosition = {scrollPosition}
            />
            <Routes>
                <Route path="/"                 element={<Landing isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="signup"            element={<Signup  isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="login"             element={<Login   isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="browse"            element={<Browse  isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="users/:username"   element={<Users  isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="*"                 element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            <MessageModal showing={showMsg} type={msgType} content={msgContent}></MessageModal>
        </React.Fragment>
    )        
}

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);