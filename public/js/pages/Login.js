import Loader from "../components/Loader.js";
import EntryForm from "../components/EntryForm.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// LOGIN: Main content of "/login" route; Contains form to log in to an existing account
    // toggleMessage: A callback function to use MessageModal
export default function Login(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function attemptLogin(values) {
        setLoading(true);

        if(values.username && values.password) {
            console.log("Attempting POST /sessions");

            const userData = JSON.stringify({"username" : String(values.username), "password" : String(values.password)});
            fetch("/sessions", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: userData
            })
            .then(response => {
                setLoading(false);
                if(!response.ok) {
                    return response.json()
                        .then(data => {
                            // Valid response with error 
                            if(data.info) {
                                props.toggleMessage("error", data.info);
                            } else {
                                props.toggleMessage("error", "Unknown error");
                            }
                        })
                        .catch(error => {
                            // Unexpected or unreadable response
                            props.toggleMessage("error", "Error while trying to contact server");
                            throw new Error(response.status);
                        });
                }
                // Login session created successfuly
                console.log(`HTTP Success: ${response.status}`);
                navigate("/");
                props.toggleMessage("confirm", "You have been successfully logged in");

                
            });

        } else {
            setLoading(false);
            props.toggleMessage("error", "Please enter a username and password"); 
        }


    }

    return (
        <main className="main dark">
            <div className="container">
                <div className="sectionWrapper">
                    <section className="contentBox centeredBox contentCard" id="contentWrapper_Login">
                        <h2>Log In</h2>
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
            </div>

        </main>
    )
}