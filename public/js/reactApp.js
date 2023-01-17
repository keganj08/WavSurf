import ReactDOM from 'react-dom/client';
import { 
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';
import LandingPage from './LandingPage.js';
import SignupPage from './SignupPage.js';
import LoginPage from './LoginPage.js';
import BrowsePage from './BrowsePage.js';

import LandingContent from './LandingContent.js';
import SignupContent from './SignupContent.js';
import LoginContent from './LoginContent.js';
import BrowseContent from './BrowseContent.js';


import Header from './Header.js';
import Footer from './Footer.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDownload, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie';

library.add(faDownload, faPlay, faPause)

console.log(Cookies.get("accessToken"));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<LandingContent />} />
            <Route path="signup" element={<SignupContent />} />
            <Route path="login" element={<LoginContent />} />
            <Route path="browse" element={<BrowseContent />} />
        </Routes>
        <Footer />
    </BrowserRouter>
);