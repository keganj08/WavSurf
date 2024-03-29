import Loader from "./Loader.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EntryForm from "./EntryForm.js";
import Cookies from "js-cookie";

// UPLOADMODAL: A modal for configuring a sound file"s data before uploading it
    // showing: Boolean
    // file: File object to be uploaded
    // Title: Original file title
    // close: A callback function to hide the modal
    // toggleMessage: A callback function to use MessageModal
export default function UploadModal(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Attempt to push a file to S3
    function uploadAudioFile(values) {
        if(values.author == "Anonymous") {
            props.toggleMessage("info", "Log in to upload your sounds");
            props.close();
            navigate("/login");

        } else if(!values.title) {
            props.toggleMessage("info", "Please give your sound a title");

        } else {
            setLoading(true);

            const originalFile = props.file;
            const title = values.title;
            const author = values.author;
    
            const newFile = new File([originalFile], title + ".wav", {type: originalFile.type});
    
            let uploadData = new FormData();
            uploadData.append("audioFile", newFile);
            uploadData.append("author", author);
            uploadData.append("accessToken", Cookies.get("accessToken"));
            console.log(uploadData);
    
            console.log(Cookies.get("accessToken"));
            console.log("Client attempting /soundFiles POST of " + title + " by " + author);
    
            fetch("/soundFiles", {
                method: "POST",
                body: uploadData
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

                console.log(`HTTP Success: ${response.status}`);
                props.toggleMessage("confirm", "Sound successfully uploaded!");
                props.close();
            });

        }
    }

    function getUsername() {
        const username = Cookies.get("sessionUsername");
        if(username) { return username; } 
        else { return "Anonymous"; }
    }

    return (
        <React.Fragment>
            {props.showing && <div className="modalBackground">
                <div className="contentBox centeredBox contentCard">
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