import Loader from "./Loader.js";
import AudioCard from "./AudioCard.js";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// BROWSE: Main content of "/browse" route; Displays uploaded sound files 
    // toggleMessage: A callback function to use MessageModal
export default function Browse(props) {
    const [loading, setLoading] = useState(true);
    const [soundFileNames, setSoundFileNames] = useState([]);
    const [audioCards, setAudioCards] = useState([]);

    useEffect(() => {
        
        console.log("Client attempting /listSounds for Browse page");
        fetch("/listSounds", {
            method: "GET"
        })
        .then(response => {
            if(!response.ok){
                setLoading(false);
                props.toggleMessage("error", "Couldn't reach server");
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            /* Get the titles of each sound file */
            let soundFiles = [];

            for(var i=0; i<data.Contents.length; i++) {

                if(data.Contents[i].Key.indexOf("sounds/") != -1) {
                    let authorPath = data.Contents[i].Key.split("sounds/")[1];
                    if(authorPath.indexOf("/") !=  -1) {
                        let title = authorPath.split("/")[1];
                        let author = authorPath.split("/")[0];
                        soundFiles.push({title, author});
                    }
                }

            }

            setSoundFileNames(soundFiles);
            setAudioCards(
                soundFiles.map((fileData, index) => 
                <AudioCard 
                    title={fileData.title} 
                    author={fileData.author} 
                    id={"audioCard-" + index} 
                    key={"audioCard-" + index} 
                />
            ));

            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
            props.toggleMessage("error", "Error while trying to contact server");
            return null;
        })
    },[])

    return (
        <main className="main">
            <div className="contentArea">
                <div className="container stack">
                    <section className="contentBox">
                        <div className="container doubleHeader">
                            <h1>Browse Sounds</h1>
                            <div id="soundSearchBar" className="searchBar" type="text">
                                <FontAwesomeIcon className="icon" icon="fa-solid fa-magnifying-glass" />
                                <input id="soundSearchInput" placeholder="Search"/>
                            </div>
                        </div>

                        <div className="audioCardWrapper" id="sounds">

                            {audioCards}
                        </div>
                    </section>
                </div>
            </div>
            {loading && <Loader />}
        </main>
    )
}