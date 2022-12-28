import LandingContent from './LandingContent.js';
import { Link } from 'react-router-dom';

function LandingPage(props) {

    /* REMOVE THIS */
    function testRequest() {

        console.log('Client attempting /listUsers GET of formdata');
        fetch('/listSounds', {
            /*headers: { 'Content-Type': 'application/json' },*/
            method: 'GET'
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div className="page">
            <header className="pageHeader">
                <Link id="logoLink" to="/"> <img id="logo" src="res/logo.svg"></img> </Link>
                
                <nav>
                    <Link id="browseLink" className="transparentButton" to="/browse">Browse Sounds</Link>
                    <Link id="singupLink" to="/login">Log In</Link>
                </nav>
            </header>

            <LandingContent />

            <footer className="pageFooter dark">

            </footer>
        </div>
    );
}

export default LandingPage;