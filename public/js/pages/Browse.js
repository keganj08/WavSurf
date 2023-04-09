import Loader from "../components/Loader.js";
import AudioCard from "../components/AudioCard.js";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// BROWSE: Main content of "/browse" route; Displays uploaded sound files 
    // toggleMessage: A callback function to use MessageModal
export default function Browse(props) {
    const [loading, setLoading] = useState(true);
    const [allSounds, setAllSounds] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [displayedSounds, setDisplayedSounds] = useState([]);
    const [audioCards, setAudioCards] = useState([]);

    // On initial mount, retrieve all sounds
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
            // Get the titles and authors of each sound file
            
            let soundFiles = data;
            console.log(data);
            /*
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
            */

            setAllSounds(soundFiles);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
            props.toggleMessage("error", "Error while trying to contact server");
            return null;
        })
    }, []);

    // When the sounds are first retrieved, and when the user changes their search, update displayedSounds
    useEffect(() => {
        console.log("Filter: " + filterValue);
        if(filterValue.length >= 2) {
            setDisplayedSounds(
                allSounds.filter((sound) => sound.title.includes(filterValue)).concat(
                    allSounds.filter((sound) => sound.author.includes(filterValue))
                )
            );
        } else {
            setDisplayedSounds(allSounds);
        }
    }, [filterValue, allSounds]);

    // When displayedSounds changes, update the audio cards
    useEffect(() => {
        console.log(displayedSounds);
        loadAudioCards(displayedSounds);
    }, [displayedSounds]);

    
    const handleSearchChange = (event) => {
        event.persist();
        setFilterValue(event.target.value);
    }

    function loadAudioCards(soundFiles) {
        setAudioCards(
            soundFiles.map((fileData, index) => 
            <AudioCard 
                title={fileData.title} 
                author={fileData.author} 
                id={"audioCard-" + index} 
                key={"audioCard-" + index} 
            />
        ));
    }

    return (
        <main className="main">
            <div className="contentArea">
                <div className="container stack">
                    <section className="contentBox">
                        <div className="container doubleHeader">
                            <h1>Browse Sounds</h1>
                            <div id="soundSearchBar" className="searchBar" type="text">
                                <FontAwesomeIcon className="icon" icon="fa-solid fa-magnifying-glass" />
                                <input id="soundSearchInput" placeholder="Search" onChange={(e) => handleSearchChange(e)}/>
                            </div>
                        </div>

                        <div className="audioCardWrapper" id="sounds">

                            {audioCards}
                            {!loading && displayedSounds.length == 0 && <span>Hmm, didn't find anything.</span>}
                        </div>
                    </section>
                </div>
            </div>
            {loading && <Loader />}
        </main>
    )
}