import Loader from "../components/Loader.js";
import EntryForm from "../components/EntryForm.js";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// SIGNUP: Main content of "/signup" route; Contains form to create an account
    // toggleMessage: A callback function to use MessageModal
export default function SignupContent(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function updateAccount(values) {
        setLoading(true);
        const enteredUsername = values.username;
        const enteredPassword = values.password;

        const uploadData = {"username" : String(enteredUsername), "password" : String(enteredPassword)};

        console.log("Client attempting /updateAccount POST");
        fetch("/updateAccount", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(uploadData)
        })
        .then(response => {
            if(!response.ok){
                setLoading(false);
                props.toggleMessage("error", "Server error, please try again");
                throw new Error("HTTP error: " + response.status)
            }
            return response.json();
        })
        .then(data => {
            setLoading(false);
            console.log(data);

            if(data.uploadStatus == true) {
                props.toggleMessage("confirm", "Account created. You may now log in");
                navigate("/login");
            } else {
                props.toggleMessage("error", "Invalid username or password");
            }
        })
        .catch(error => {
            setLoading(false);
            props.toggleMessage("error", "Error while trying to contact server");
            console.log("Some server error...");
            console.log(error);
        })
    }

    return (
        <main className="main dark">

            <div className="contentArea">
                <section className="contentBox centeredBox" id="contentWrapper_Signup">
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
                        submitFunction = {(values) => updateAccount(values)}
                    />
                    <p>Already have an account? <Link to="/login" className="textLink">Log in.</Link></p>
                    {loading && <Loader />}
                </section>
            </div>

        </main>
    )
}