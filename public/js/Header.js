import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Header(props) {
    const route = useLocation().pathname;
    const [useMobileNav, setUseMobileNav] = useState(false);
    const [showMobileNavMenu, setShowMobileNavMenu] = useState(false);

    useEffect(() => {
        setShowMobileNavMenu(false);
    }, [route]);

    function toggleMobileNavMenu() {
        setShowMobileNavMenu(!showMobileNavMenu);
    }

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
                        
                        <button className="mobileNavButton" onClick={() => toggleMobileNavMenu()}>
                            <FontAwesomeIcon icon="fa-solid fa-bars" />
                        </button>
                    </nav>
            </div>

            {showMobileNavMenu && <div id="mobileNavContainer" className="container">
                <nav id="mobileNavMenu">
                    {route != "/browse" && 
                        <Link to="/browse">Browse Sounds</Link>}

                    {!props.isLoggedIn && route != "/login" && route != "/signup" &&
                        <Link to="/login">Log In</Link>}

                    {props.isLoggedIn && 
                        <a href="/" onClick={props.logout}>Log Out ({Cookies.get("sessionUsername")})</a>}
                </nav>
            </div>}

        </header>
    );
}

export default Header;