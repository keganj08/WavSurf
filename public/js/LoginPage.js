import LoginContent from './LoginContent';


function LoginPage(props) {

    return (
        <div className="page">
            <header className="pageHeader">
                <img id="logo" src="res/logo.svg"></img>
                
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