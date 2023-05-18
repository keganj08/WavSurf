import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";

// HEADER: Displays logo and navigation buttons at the top of every page
    // isLoggedIn: Boolean
    // logout: Callback function to log the user out of their account
export default function Header(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const route = useLocation().pathname;
    let classes = "pageHeader";

    // When route changes, hide dropdown menu
    useEffect(() => {
        setShowDropdown(false);
    }, [route]);

    function toggleDropdown() {
        setShowDropdown(!showDropdown);
    }

    if(props.scrollPosition > 5) {
        classes += " shadowUnderlined";
    }

    return (
        <header className={classes}>

            <div id="navContainer" className="container">
                <Link id="logoLink" to="/"> 
                    <img id = "logo" src = "/res/logo.svg"></img> 
                </Link>

                <nav className="headerNav">
                    <button 
                        id="dropdownButton" 
                        className="navButton transparentButton" 
                        onClick={() => toggleDropdown()}
                    >
                        <span id="dropdownButtonText">{Cookies.get("sessionUsername") ? Cookies.get("sessionUsername") : "Log In"}</span> 
                        <FontAwesomeIcon id="dropdownButtonIcon" icon="fa-solid fa-angle-down"/>
                    </button>
                </nav>
            </div>
            
            {showDropdown && <div id="dropdownContainer" className="container">
                <ul>
                    {!Cookies.get("sessionUsername") && route != "/login" &&
                        <li><Link id="loginLink" className="dropdownItem" to="/login">Log In</Link></li>
                    }
                    {!Cookies.get("sessionUsername") && route != "/signup" &&
                        <li><Link id="signupLink" className="dropdownItem" to="/signup">Sign Up</Link></li>
                    }
                    {Cookies.get("sessionUsername") &&
                       <li><Link id="profileLink" className="dropdownItem" to={`/users/${Cookies.get("sessionUsername")}`}>Profile</Link></li>}
                    {Cookies.get("sessionUsername") && 
                        <li>
                            <button className="dropdownItem" 
                                onClick={() => {
                                    setShowDropdown(false);
                                    props.logout();
                                }}
                            >
                                Log Out <span id="logoutBtnUsername">({Cookies.get("sessionUsername")})</span>
                            </button>
                        </li>}
                </ul>
            </div>}
        </header>
    );
}





/*
const [useMobileNav, setUseMobileNav] = useState(false);
const [showMobileNavMenu, setShowMobileNavMenu] = useState(false);
const [mobileNavContainerHeight, setMobileNavContainerHeight] = useState(0);

const ref = React.useRef(null);

useEffect(() => {
    setShowMobileNavMenu(false);
}, [route]);

useEffect(() => {
    if(showMobileNavMenu){
        setMobileNavContainerHeight(ref.current.offsetHeight);
    } else {
        setMobileNavContainerHeight(0);
    }
}, [showMobileNavMenu]);

function toggleMobileNavMenu() {
    setShowMobileNavMenu(!showMobileNavMenu);
}
*/

/*
<div id="mobileNavContainer" className="container" ref={ref} style={{maxHeight: mobileNavContainerHeight}}>
<nav id="mobileNavMenu">
    {route != "/browse" && 
        <Link to="/browse">Browse Sounds</Link>}

    {!props.isLoggedIn && route != "/login" && route != "/signup" &&
        <Link to="/login">Log In</Link>}

    {props.isLoggedIn && 
        <a href="/" onClick={props.logout}>Log Out ({Cookies.get("sessionUsername")})</a>}
</nav>
</div>
*/

/*
                        <button className="mobileNavButton" onClick={() => toggleMobileNavMenu()}>
                            <FontAwesomeIcon icon="fa-solid fa-bars" />
                        </button>
*/