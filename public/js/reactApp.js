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
    faCircleCheck, faCircleInfo, faUser, faAngleDown, faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faRegHeart } from "@fortawesome/free-regular-svg-icons" 

library.add(faCircleNotch, faUpload, faDownload, faPlay, faPause, faBars, faMagnifyingGlass, faCircleExclamation, 
    faCircleCheck, faCircleInfo, faUser, faAngleDown, faSolidHeart, faRegHeart);

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const route = useLocation();

    const [showingMsg, setShowingMsg] = useState(false);
    const [msgTimer, setMsgTimer] = useState("");
    const [msgType, setMsgType] = useState("confirm");
    const [msgContent, setMsgContent] = useState("Foo bar");

    // Go to top of page on route change
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [route]);

    // Keep track of current scroll position
    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollPosition]);

    function handleScroll() { 
        setScrollPosition(window.scrollY)
    };

    // Request that the server delete the current session
    async function logout() {
        if(Cookies.get("sessionUsername")) {
            fetch(`/sessions/${Cookies.get("sessionUsername")}`, {
                method: "DELETE",
            })
            .then(response => {
                if(!response.ok) {
                    return response.json()
                        .then(data => {
                            // Valid response with error 
                            if(data.info) {
                                props.toggleMessage("error", data.info);
                            } else {
                                props.toggleMessage("error", "Unknown error");
                            }
                        })
                        .catch(error => {
                            // Unexpected or unreadable response
                            props.toggleMessage("error", "Error while trying to contact server");
                            throw new Error(response.status);
                        });
                }
                // Successfully logged out
                console.log(`HTTP Success: ${response.status}`);
                window.location.reload();
                //toggleMessage("info", "You have been logged out");
            });
        }
    }

    // Toggle the information modal
    function toggleMessage(type, content, length=5000) {
        let delayTime = 0;

        if(showingMsg) {
            clearTimeout(msgTimer);
            setShowingMsg(false);
            setMsgTimer("");
            delayTime = 250;
        }

        setTimeout(() => {
            setShowingMsg(true);
            setMsgType(type);
            setMsgContent(content);
    
            if(length >= 0) {
                setMsgTimer(setTimeout(() => {
                    setShowingMsg(false);
                }, length));
            }
        }, delayTime);
    }

    return (
        <React.Fragment>
            <Header 
                show = {route.pathname != "/" || scrollPosition > 200} 
                logout = {logout} 
                toggleMessage = {(type, content) => toggleMessage(type, content)}
                scrollPosition = {scrollPosition}
            />
            <Routes>
                <Route path="/" element={
                    <Landing   
                        toggleMessage={(type, content, length) => toggleMessage(type, content, length)}
                    />
                }/>
                <Route path="signup" element={
                    <Signup
                        toggleMessage={(type, content, length) => toggleMessage(type, content, length)}
                    />
                }/>
                <Route path="login" element={
                    <Login
                        toggleMessage={(type, content, length) => toggleMessage(type, content, length)}
                    />
                }/>
                <Route path="browse" element={
                    <Browse
                        toggleMessage={(type, content, length) => toggleMessage(type, content, length)}
                    />
                }/>
                <Route path="users/:username" element={
                    <Users
                        toggleMessage={(type, content, length) => toggleMessage(type, content, length)}
                    />
                }/>
                <Route path="*" element={
                    <Navigate to="/" replace />
                }/>
            </Routes>
            <Footer />
            <MessageModal showing={showingMsg} type={msgType} content={msgContent}></MessageModal>
        </React.Fragment>
    )        
}

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);