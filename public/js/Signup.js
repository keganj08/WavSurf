import { useState } from 'react';
import EntryForm from './EntryForm.js';
import { Link } from 'react-router-dom';

export default function SignupContent(props) {

    function updateAccount(values) {
        var formData = {"username" : String(values.username), "password" : String(values.password)};

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