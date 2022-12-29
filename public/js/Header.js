import { Link } from 'react-router-dom';

function Header({theme, currentPage}) {

    return (
        <header className="pageHeader">
            <Link id="logoLink" to="/"> 
                <img id="logo" src="res/logo.svg"></img> 
            </Link>
            
            <nav>
                <Link id="browseLink" className="transparentButton" to="/browse">Browse Sounds</Link>
                <Link id="singupLink" to="/login">Log In</Link>
            </nav>
        </header>
    );
}

export default Header;