import SignupContent from './SignupContent.js';
import { Link } from 'react-router-dom';

function SignupPage(props) {

    return (
        <div className="page">
            <header className="pageHeader">
            <Link id="logoLink" to="/"> <img id="logo" src="res/logo.svg"></img> </Link>
                
                <nav>
                    <Link id="browseLink" className="transparentButton" to="/browse">Browse Sounds</Link>
                </nav>
            </header>

            <SignupContent />

            <footer className="pageFooter dark">

            </footer>
        </div>
    )
}

export default SignupPage;