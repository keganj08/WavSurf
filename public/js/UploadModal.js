import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function UploadModal(props) {

    function uploadAudioFile(title, author) {
        const newFile = new File([props.file], title + ".wav", {type: props.file.type});

        var formData = new FormData();
        formData.append("audioFile", newFile);
        formData.append("author", author);
        formData.append("accessToken", Cookies.get("accessToken"));

        console.log("Client attempting /uploadAudio POST of " + title + " by " + author);

        fetch('/uploadAudio', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            console.log("Response data: ");
            console.log(data);

            if(!data.loginValid){
                props.toggleMessage("error", "Authentication failed, please log in again");
                props.close();
            } else if(!data.uploadSuccess) {
                props.toggleMessage("error", "Server upload failed, please try again");
                props.close();
            } else {
                props.toggleMessage("confirm", "Sound successfully uploaded!");
                props.close();
            }
        })
        .catch(error => {
            console.log("Response error: ");
            console.log(error);
            props.close();
        })
    }

    function UploadForm() {
        const [values, setValues] = useState({
            title: "",
            submit: "",
            author: "",
        });
        const [submitted, setSubmitted] = useState(false);

        useEffect(() => {
            //Update username
            setValues((values) => ({
                ...values,
                author: getUsername(),
            }));
        }, []);

        function getUsername() {
            if(props.isLoggedIn) { 
                return Cookies.get("sessionUsername");
            } else {
                return "Anonymous";
            }
        }

        const handleTitleInputChange = (event) => {
            event.persist();
            setValues((values) => ({
                ...values, // spread operator
                title: event.target.value,
            }));
        }

        const handleSubmit = (event) => {
            event.preventDefault();
            uploadAudioFile(values.title, values.author);
            setSubmitted(true);
        }

        return (
            <form className="formGrid" onSubmit={handleSubmit}>
                
                <label id="uploadTitleLabel" className="formGridLabel">Title:</label>
                <input
                    id = "uploadTitleInput"
                    className = "formGridInput" 
                    type = "text"
                    placeholder = {props.title.split(".")[0]}
                    value = {values.title} 
                    onChange={handleTitleInputChange} 
                />

                <label id="uploadAuthorLabel" className="formGridLabel">Author:</label>
                <input 
                    id = "uploadAuthorInput"
                    className = "formGridInput"
                    disabled
                    type = "text" 
                    placeholder = "Author"
                    value = {values.author}
                    readOnly = {true}
                />

                <input 
                    id = "uploadSubmit"
                    className = "formGridSubmit"
                    type = "submit" 
                    value = "Upload"
                />
                
                {submitted && <p>Uploading...</p>}

            </form>
        );
    }

    return (
        <React.Fragment>
            {props.showing && <div className="modalBackground">
                <div className="contentBox centeredBox wide">
                    <h1>Upload Your Sound</h1>
                    <UploadForm />
                </div>
            </div>}
        </React.Fragment>
    );
}