import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Header(props) {
    const route = useLocation().pathname;

    return (
        <header className="pageHeader">

            <div id="navContainer" className="container">
                <Link id="logo Link" to="/"> 
                        <img id="logo" src="res/logo.svg"></img> 
                    </Link>

                    <nav className="headerNav">
                        {route != "/browse" &&
                            <Link id="browseLink" className="navButton transparentButton" to="/browse">Browse Sounds</Link>}

                        {!props.isLoggedIn && route != "/login" && route != "/signup" &&
                            <Link id="singupLink" className="navButton" to="/login">Log In</Link>}

                        {props.isLoggedIn && <button className="navButton" onClick={props.logout}>Log Out ({Cookies.get("sessionUsername")})</button>}
                        
                    </nav>
            </div>
        </header>
    );
}

export default Header;





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