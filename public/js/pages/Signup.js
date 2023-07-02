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

        if(values.username && values.password) {
            console.log("Attempting POST /users");
    
            const userData = JSON.stringify({"username" : String(values.username), "password" : String(values.password)});
            fetch("/users", {
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
                // User account created successfully
                console.log(`HTTP Success: ${response.status}`);
                navigate("/login");
                props.toggleMessage("confirm", "Account created. You may now log in");
            });

        } else {
            setLoading(false);
            props.toggleMessage("error", "Please enter a username and password");
        }

    }

    return (
        <main className="main dark">
            <div className="sectionWrapper">
                <div className="container">
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
            </div>

        </main>
    )
}