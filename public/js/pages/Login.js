import Loader from "../components/Loader.js";
import EntryForm from "../components/EntryForm.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// LOGIN: Main content of "/login" route; Contains form to log in to an existing account
    // toggleMessage: A callback function to use MessageModal
export default function Login(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function attemptLogin(values) {
        setLoading(true);

        if(values.username != undefined && values.password != undefined) {
            console.log("Attempting POST /sessions");

            const userData = JSON.stringify({"username" : String(values.username), "password" : String(values.password)});
            fetch("/sessions", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: userData
            })
            .then(response => {
                setLoading(false);

                if(response.ok) {
                    console.log(`HTTP Success: ${response.status}`);
                    navigate("/");
                    props.toggleMessage("confirm", "You have been successfully logged in");
                } else {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            })
            .then(data => {
                // Currently unused; Data is not returned on success
            })
            .catch(error => {
                setLoading(false);
                props.toggleMessage("error", "Error while trying to contact server");
                console.log(error);
            });

        } else {
            setLoading(false);
            props.toggleMessage("error", "Please enter a username and password"); 
        }


    }

    return (
        <main className="main dark">
            <div className="sectionWrapper">
                <section className="contentBox centeredBox contentCard" id="contentWrapper_Login">
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