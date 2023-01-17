import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function LoginContent(props) {

    const navigate = useNavigate();

    function updateAccount(username, password) {
        var formData = {"username" : String(username), "password" : String(password)};

        console.log('Client attempting /login POST of formdata');
        fetch('/login', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            if(data.loginSuccess) {
                Cookies.remove("accessToken");
                Cookies.remove("sessionUsername");
                Cookies.set("accessToken", data.accessToken, {sameSite: 'none', secure: true});
                Cookies.set("sessionUsername", username, {sameSite: 'none', secure: true});
                navigate("/");
                console.log(Cookies.get("accessToken") + ", " + Cookies.get("sessionUsername"));
            } else {
                // Password or username was incorrect.
            }

        })
        .catch(error => {
            console.log(error);
        })
    }

    
    function LoginForm(props) {
        const [values, setValues] = useState({
            username: '',
            password: '',
            submit: '',
        });
        const [submitted, setSubmitted] = useState(false);

        const handleUsernameInputChange = (event) => {
            event.persist();
            setValues((values) => ({
                ...values, // spread operator
                username: event.target.value,
            }));
        }
        const handlePasswordInputChange = (event) => {
            event.persist();
            setValues((values) => ({
                ...values, // spread operator
                password: event.target.value,
            }));
        }
        const handleSubmit = (event) => {
            event.preventDefault();
            updateAccount(values.username, values.password);
            setSubmitted(true);
        }

        return (
            <form onSubmit={handleSubmit}>
                <label>
                    <input 
                        id = "newAccountUsername"
                        type = "text"
                        placeholder = "Username"
                        value = {values.username} 
                        onChange={handleUsernameInputChange} 
                    />
                </label>
                <label>
                    <input 
                        id = "newAccountPassword"
                        type = "password" 
                        placeholder = "Password"
                        value = {values.password} 
                        onChange = {handlePasswordInputChange}
                    />
                </label>
                <input 
                    id = "newAccountSubmit"
                    type = "submit" 
                    value = "Sign Up"
                />
            </form>
        );
    }

    return (
        <main className="main dark">

            <section className="contentWrapper smallCenteredContentWrapper" id="contentWrapper_Login">
                <h1>Log In</h1>
                <LoginForm />
                <p>Don't have an account? <Link to="/signup" className="textLink">Sign up!</Link></p>
            </section>
        </main>
    )
}

export default LoginContent;