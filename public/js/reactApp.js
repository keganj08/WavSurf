import ReactDOM from "react-dom/client";
import { 
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import React, { useState, useEffect, useLayoutEffect } from "react";

import Landing from "./Landing.js";
import Signup from "./Signup.js";
import Login from "./Login.js";
import Browse from "./Browse.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import MessageModal from "./MessageModal.js";

import { library } from "@fortawesome/fontawesome-svg-core"
import { faUpload, faDownload, faPlay, faPause, faBars, faMagnifyingGlass, faCircleExclamation, faCircleCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import Cookies from "js-cookie";

library.add(faUpload, faDownload, faPlay, faPause, faBars, faMagnifyingGlass, faCircleExclamation, faCircleCheck, faCircleInfo);

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
                toggleMessage={(type, content) => toggleMessage(type, content)}
            />
            <Routes>
                <Route path="/"      element={<Landing isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="signup" element={<Signup  isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="login"  element={<Login   isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
                <Route path="browse" element={<Browse  isLoggedIn={isLoggedIn} toggleMessage={(type, content, length) => toggleMessage(type, content, length)}/>} />
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