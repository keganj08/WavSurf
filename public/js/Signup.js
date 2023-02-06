import EntryForm from "./EntryForm.js";
import { Link } from "react-router-dom";

// SIGNUP: Main content of "/signup" route; Contains form to create an account
    // toggleMessage: A callback function to use MessageModal
export default function SignupContent(props) {

    function updateAccount(values) {
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
                throw new Error("HTTP error: " + response.status)
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
                </section>
            </div>

        </main>
    )
}