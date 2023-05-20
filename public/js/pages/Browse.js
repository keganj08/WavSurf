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
        console.log("Attempting GET /soundFiles");

        fetch("/soundFiles", {
            method: "GET"
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
            // Sound files retrieved successfully
            console.log(`HTTP Success: ${response.status}`);
            return response.json()
                .then(data => {
                    let soundFiles = [];
                    if(data.soundFiles) { soundFiles = data.soundFiles; }
                    setAllSounds(soundFiles);
                });
        });
    }, []);

    // When the sounds are first retrieved, and when the user changes their search, update displayedSounds
    useEffect(() => {
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
            <section className="sectionWrapper">
                <div className="container stack">
                    <section className="contentBox">
                        <div className="contentRow">
                            <h1>Browse Sounds</h1>
                            <div id="soundSearchBar" className="searchBar" type="text">
                                <FontAwesomeIcon className="icon" icon="fa-solid fa-magnifying-glass" />
                                <input id="soundSearchInput" placeholder="Search" onChange={(e) => handleSearchChange(e)}/>
                            </div>
                        </div>

                        <div className="audioCardWrapper" id="sounds">
                            {audioCards}
                            {loading && <Loader />}
                            {!loading && displayedSounds.length == 0 && <span>Hmm, didn't find any sounds.</span>}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    )
}