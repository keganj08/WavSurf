import BrowseContent from './BrowseContent.js';
import { Link } from 'react-router-dom';

function BrowsePage(props) {

    return (
        <div className="page">
            <header className="pageHeader">
            <Link id="logoLink" to="/"> <img id="logo" src="res/logo.svg"></img> </Link>
                
                <nav>
                    <Link id="singupLink" to="/login">Log In</Link>
                </nav>
            </header>

            <BrowseContent />

            <footer className="pageFooter">

            </footer>
        </div>
    )
}

export default BrowsePage;