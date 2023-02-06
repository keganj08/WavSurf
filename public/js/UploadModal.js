import Loader from "./Loader.js";
import React, { useState, useEffect } from "react";
import EntryForm from "./EntryForm.js";
import Cookies from "js-cookie";

// UPLOADMODAL: A modal for configuring a sound file"s data before uploading it
    // showing: Boolean
    // file: File object to be uploaded
    // Title: Original file title
    // isLoggedIn: Boolean
    // close: A callback function to hide the modal
    // toggleMessage: A callback function to use MessageModal
export default function UploadModal(props) {
    const [loading, setLoading] = useState(false);

    // Attempt to push a file to S3
    function uploadAudioFile(values) {
        setLoading(true);
        const originalFile = props.file;
        const title = values.title;
        const author = values.author;

        const newFile = new File([originalFile], title + ".wav", {type: originalFile.type});

        let uploadData = new FormData();
        uploadData.append("audioFile", newFile);
        uploadData.append("author", author);
        uploadData.append("accessToken", Cookies.get("accessToken"));

        console.log("Client attempting /uploadAudio POST of " + title + " by " + author);

        fetch("/uploadAudio", {
            method: "POST",
            body: uploadData
        })
        .then(response => {
            if(!response.ok){
                setLoading(false);
                props.toggleMessage("error", "Server refused upload");
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {

            setLoading(false);
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
            setLoading(false);
            props.toggleMessage("error", "Error while trying to contact server");
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
                                "readOnly": false,
                                "placeholder": props.file.name.split(".")[0]
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
                    {loading && <Loader />}
                </div>
            </div>}
        </React.Fragment>
    );
}