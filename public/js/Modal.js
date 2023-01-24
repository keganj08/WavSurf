import React, { useState, useEffect } from 'react';

export default function Modal(props) {

    console.log("Modal receieved:");
    console.log(props.file);
    console.log(props.title);

    function uploadAudioFiles(files) {
        var formData = new FormData();


        for(var i=0; i<files.length; i++) {
            const newFile = new File([files[i]], files[i].input + ".wav", {type: files[i].type});
            formData.append('audioFile', newFile);
        }

        console.log(files[0].input);

        console.log('Client attempting /uploadAudio POST of formdata');
        console.log(formData);

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
            console.log(data);
            props.close();
        })
        .catch(error => {
            console.log(error);
            props.close();
        })
    }

    function ModalForm() {
        const [values, setValues] = useState({
            title: "",
            author: "",
            submit: "",
        });
        const [submitted, setSubmitted] = useState(false);

        const handleTitleInputChange = (event) => {
            event.persist();
            setValues((values) => ({
                ...values, // spread operator
                title: event.target.value,
            }));
        }
        const handleSubmit = (event) => {
            event.preventDefault();
            console.log("UPLOAD: " + values.title + ", " + values.author + ", ");
            props.file.input = values.title;
            uploadAudioFiles([props.file]);
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
                    value = {props.author}
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
                    <h1>Upload Your Sound!</h1>
                    <ModalForm />
                </div>
            </div>}
        </React.Fragment>
    );
}