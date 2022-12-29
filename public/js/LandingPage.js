import LandingContent from './LandingContent.js';
import Header from './Header.js';
import Footer from './Footer.js';
import { Link } from 'react-router-dom';

function LandingPage(props) {

    return (
        <div className="page">
            <Header currentPage = {"landing"} />
            <LandingContent />
            <Footer />
        </div>
    );
}

export default LandingPage;