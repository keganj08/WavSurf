import Loader from "../components/Loader.js";
import EntryForm from "../components/EntryForm.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// SIGNUP: Main content of "/signup" route; Contains form to create an account
    // toggleMessage: A callback function to use MessageModal
export default function Signup(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function createUser(values) {
        setLoading(true);

        if(values.username != undefined && values.password != undefined) {
            console.log("Attempting POST /users");
    
            const userData = JSON.stringify({"username" : String(values.username), "password" : String(values.password)});
            fetch("/users", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: userData
            })
            .then(response => {
                setLoading(false);

                if(response.ok) {
                    console.log(`HTTP Success: ${response.status}`);
                    navigate("/login");
                    props.toggleMessage("confirm", "Account created. You may now log in");
                } else {
                    throw new Error("HTTP error: " + response.status);
                }
            })
            .then(data => {
                // Currently unused
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
                <section className="contentBox centeredBox contentCard" id="contentWrapper_Signup">
                    <h1>Sign Up</h1>
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
                        submitText = "Sign Up"
                        submitFunction = {(values) => createUser(values)}
                    />
                    <p>Already have an account? <Link to="/login" className="textLink">Log in.</Link></p>
                    {loading && <Loader />}
                </section>
            </div>

        </main>
    )
}