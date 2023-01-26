import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function UploadModal(props) {

    function uploadAudioFile(file) {
        console.log("Author: " + file.author);
        const newFile = new File([file], file.input + ".wav", {type: file.type});

        var formData = new FormData();
        formData.append('audioFile', newFile);
        formData.append('author', file.author);

        console.log('Client attempting /uploadAudio POST of formdata');
        //console.log(formData);
        //console.log(newFile.author);

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
            props.close();
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
            props.file.input = values.title;
            props.file.author = values.author;
            uploadAudioFile(props.file);
            setSubmitted(true);
        }

        return (
            <form onSubmit={handleSubmit}>

                <label>Title:</label>
                <input 
                    id = "newUploadTitle"
                    type = "text"
                    placeholder = {props.title.split(".")[0]}
                    value = {values.title} 
                    onChange={handleTitleInputChange} 
                />

                <label>Author:</label>
                <input 
                    id = "newUploadAuthor"
                    type = "text" 
                    placeholder = "Author"
                    value = {values.author}
                    readOnly = {true}
                />

                <input 
                    id = "newUploadSubmit"
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