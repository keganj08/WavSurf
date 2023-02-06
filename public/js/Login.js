import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EntryForm from './EntryForm.js';
import Cookies from 'js-cookie';

export default function LoginContent(props) {
    const navigate = useNavigate();

    function attemptLogin(values) {
        var formData = {"username" : String(values.username), "password" : String(values.password)};

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
                Cookies.set("sessionUsername", values.username, {sameSite: 'none', secure: true});
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

    return (
        <main className="main dark">
            <div className="contentArea">
                <section className="contentBox centeredBox" id="contentWrapper_Login">
                    <h1>Log In</h1>
                    <EntryForm 
                        fields = {[
                            {
                                "title": "username", 
                                "type": "text",
                                "showLabel": false,
                                "readOnly": false
                            },

                            {
                                "title": "password", 
                                "type": "password",
                                "showLabel": false,
                                "readOnly": false
                            },
                        ]}
                        submitText = "Log In"
                        submitFunction = {(values) => attemptLogin(values)}
                    />
                    <p>Don't have an account? <Link to="/signup" className="textLink">Sign up!</Link></p>
                </section>
            </div>

        </main>
    )
}