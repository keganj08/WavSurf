import LoginContent from './LoginContent';
import { Link } from 'react-router-dom';

function LoginPage(props) {

    return (
        <div className="page">
            <header className="pageHeader">
            <Link id="logoLink" to="/"> <img id="logo" src="res/logo.svg"></img> </Link>
                
                <nav>
                </nav>
            </header>

            <LoginContent />

            <footer className="pageFooter">

            </footer>
        </div>
    )
}

export default LoginPage;