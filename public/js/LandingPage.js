import LandingContent from './LandingContent';
import { Link } from 'react-router-dom';

function LandingPage(props) {
    return (
        <div className="page">
            <header className="pageHeader">
                <img id="logo" src="res/logo.svg"></img>
                
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