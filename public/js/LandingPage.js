import LandingContent from './LandingContent.js';
import { Link } from 'react-router-dom';

function LandingPage(props) {
    return (
        <div className="page">
            <header className="pageHeader">
                <Link id="logoLink" to="/"> <img id="logo" src="res/logo.svg"></img> </Link>
                
                <nav>
                    <Link id="loginLink" to="/login">Log in</Link>
                </nav>
            </header>

            <LandingContent />

            <footer className="pageFooter">

            </footer>
        </div>
    );
}

export default LandingPage;