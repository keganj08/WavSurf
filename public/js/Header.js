import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Header({theme, currentPage}) {
    const route = useLocation().pathname;

    return (
        <header className="pageHeader">
            <Link id="logo Link" to="/"> 
                <img id="logo" src="res/logo.svg"></img> 
            </Link>
            
            <nav>
                {route != "/login" && route != "/signup" &&
                    <Link id="singupLink" to="/login">Log In</Link>}

                {route != "/browse" &&
                    <Link id="browseLink" className="transparentButton" to="/browse">Browse Sounds</Link>}
            </nav>
        </header>
    );
}

export default Header;