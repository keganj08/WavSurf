import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignupContent(props) {

    function updateAccount(username, password) {
        var formData = {"username" : String(username), "password" : String(password)};

        console.log(formData.username, formData.password);

        console.log('Client attempting /updateAccount POST of formdata');
        fetch('/updateAccount', {
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
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    
    function SignupForm(props) {
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
            <form className="formGrid" onSubmit={handleSubmit}>
                <input 
                    id = "newUsernameInput"
                    className = "formGridInput"
                    type = "text"
                    placeholder = "Username"
                    value = {values.username} 
                    onChange={handleUsernameInputChange} 
                />
                <input 
                    id = "newPasswordInput"
                    className = "formGridInput"
                    type = "password" 
                    placeholder = "Password"
                    value = {values.password} 
                    onChange = {handlePasswordInputChange}
                />
                <input 
                    id = "newAccountSubmit"
                    className = "formGridSubmit"
                    type = "submit" 
                    value = "Sign Up"
                />
            </form>
        );
    }

    return (
        <main className="main dark">

            <div className="contentArea">
                <section className="contentBox centeredBox" id="contentWrapper_Signup">
                    <h1>Sign Up</h1>
                    <SignupForm />
                    <p>Already have an account? <Link to="/login" className="textLink">Log in.</Link></p>
                </section>
            </div>

        </main>
    )
}