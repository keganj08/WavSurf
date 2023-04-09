import Loader from "../components/Loader.js";
import EntryForm from "../components/EntryForm.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// LOGIN: Main content of "/login" route; Contains form to log in to an existing account
    // toggleMessage: A callback function to use MessageModal
export default function LoginContent(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function attemptLogin(values) {
        setLoading(true);
        const enteredUsername = values.username;
        const enteredPassword = values.password;

        const uploadData = {"username" : String(enteredUsername), "password" : String(enteredPassword)};

        console.log("Client attempting /login POST");
        fetch("/login", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(uploadData)
        })
        .then(response => {
            if(!response.ok){
                props.toggleMessage("error", "Server error, please try again");
                setLoading(false);
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            if(data.loginSuccess) {
                Cookies.remove("accessToken");
                Cookies.remove("sessionUsername");
                Cookies.set("accessToken", data.accessToken, {sameSite: "none", secure: true});
                Cookies.set("sessionUsername", values.username, {sameSite: "none", secure: true});
                navigate("/");
                props.toggleMessage("confirm", "You have been successfully logged in");
                console.log(Cookies.get("accessToken") + ", " + Cookies.get("sessionUsername"));
            } else {
                props.toggleMessage("error", "Incorrect username or password");
            }
            setLoading(false);

        })
        .catch(error => {
            props.toggleMessage("error", "Error while trying to contact server");
            setLoading(false);
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
                    {loading && <Loader />}
                </section>
            </div>

        </main>
    )
}