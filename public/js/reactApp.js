import ReactDOM from 'react-dom/client';
import { 
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import LandingPage from './LandingPage.js';
import SignupPage from './SignupPage.js';
import LoginPage from './LoginPage.js';
import BrowsePage from './BrowsePage.js';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDownload, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie';

library.add(faDownload, faPlay, faPause)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="browse" element={<BrowsePage />} />
        </Routes>
    </BrowserRouter>
);