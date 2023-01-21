import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header(props) {
    const route = useLocation().pathname;

    return (
        <header className="pageHeader">
            <Link id="logo Link" to="/"> 
                <img id="logo" src="res/logo.svg"></img> 
            </Link>
            
            <nav>
                {route != "/browse" &&
                    <Link id="browseLink" className="navButton transparentButton" to="/browse">Browse Sounds</Link>}

                {!props.isLoggedIn && route != "/login" && route != "/signup" &&
                    <Link id="singupLink" className="navButton" to="/login">Log In</Link>}

                {props.isLoggedIn && <button className="navButton" onClick={props.logout}>Log Out</button>}
            </nav>
        </header>
    );
}

export default Header;