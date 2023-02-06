import React, { useState, useEffect } from 'react';
import EntryForm from './EntryForm.js';
import Cookies from 'js-cookie';

export default function UploadModal(props) {

    function uploadAudioFile(values) {
        
        const newFile = new File([props.file], values.title + ".wav", {type: props.file.type});

        var formData = new FormData();
        formData.append("audioFile", newFile);
        formData.append("author", values.author);
        formData.append("accessToken", Cookies.get("accessToken"));

        console.log("Client attempting /uploadAudio POST of " + values.title + " by " + values.author);

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

    function getUsername() {
        if(props.isLoggedIn) { 
            return Cookies.get("sessionUsername");
        } else {
            return "Anonymous";
        }
    }

    return (
        <React.Fragment>
            {props.showing && <div className="modalBackground">
                <div className="contentBox centeredBox wide">
                    <h1>Upload Your Sound</h1>
                    <EntryForm 
                        fields = {[
                            {
                                "title": "title", 
                                "type": "text",
                                "showLabel": true,
                                "readOnly": false
                            },

                            {
                                "title": "author", 
                                "type": "text",
                                "showLabel": true,
                                "readOnly": true,
                                "value": getUsername()
                            }
                        ]}
                        submitText = "Upload"
                        submitFunction = {(values) => uploadAudioFile(values)}
                    />
                </div>
            </div>}
        </React.Fragment>
    );
}