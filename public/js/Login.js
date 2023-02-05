import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function LoginContent(props) {
    const navigate = useNavigate();

    function attemptLogin(username, password) {
        var formData = {"username" : String(username), "password" : String(password)};

        console.log('Client attempting /login POST of formdata');
        fetch('/login', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok){
                props.toggleMessage("error", "Server error, please try again");
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
                props.toggleMessage("confirm", "You have been successfully logged in");
                console.log(Cookies.get("accessToken") + ", " + Cookies.get("sessionUsername"));
            } else {
                console.log("Failure.");
                props.toggleMessage("error", "Incorrect username or password");
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
            attemptLogin(values.username, values.password);
            setSubmitted(true);
        }

        return (
            <form className="formGrid" onSubmit={handleSubmit}>

                <input 
                    id = "loginUsernameInput"
                    className = "formGridInput"
                    type = "text"
                    placeholder = "Username"
                    value = {values.username} 
                    onChange={handleUsernameInputChange} 
                />
                <input 
                    id = "loginPasswordInput"
                    className = "formGridInput"
                    type = "password" 
                    placeholder = "Password"
                    value = {values.password} 
                    onChange = {handlePasswordInputChange}
                />
                <input 
                    id = "loginSubmit"
                    className = "formGridSubmit"
                    type = "submit" 
                    value = "Log In"
                />
            </form>
        );
    }

    return (
        <main className="main dark">
            <div className="contentArea">
                <section className="contentBox centeredBox" id="contentWrapper_Login">
                    <h1>Log In</h1>
                    <LoginForm />
                    <p>Don't have an account? <Link to="/signup" className="textLink">Sign up!</Link></p>
                </section>
            </div>

        </main>
    )
}