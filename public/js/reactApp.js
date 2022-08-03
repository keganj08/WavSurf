import ReactDOM from 'react-dom/client';
import { 
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
);