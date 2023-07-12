import Loader from "./Loader.js";
import AudioCard from "./AudioCard.js";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

// AUDIOCARDS: A displayed list of AudioCard elements
    // filterValue: A string indicating how to filter which sounds to display
    // toggleMessage: A callback function to use MessageModal
export default function AudioCards(props) {
    const [loading, setLoading] = useState(true);
    const [allSounds, setAllSounds] = useState([]);
    const [displayedSounds, setDisplayedSounds] = useState([]);
    const [audioCards, setAudioCards] = useState([]);

    // On initial mount, retrieve all sounds
    useEffect(() => {
        console.log("Attempting GET /soundFiles");

        let queryString = "/soundFiles";
        if(props.constraints && Object.keys(props.constraints).length >= 1) {
            queryString += "?";
            for(const [constraint, value] of Object.entries(props.constraints)) {
                queryString += `${constraint}=${value}&`;
            }
            queryString = queryString.slice(0, -1);
        }

        fetch(queryString, {
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
        if(props.filterValue.length >= 2) {
            setDisplayedSounds(
                allSounds.filter((sound) => sound.title.includes(props.filterValue) || sound.author.includes(props.filterValue))
            );
        } else {
            setDisplayedSounds(allSounds);
        }
    }, [props.filterValue, allSounds]);

    function deleteSound(author, title) {
        props.deleteSoundFile(author, title);
        setAllSounds(allSounds.filter(sound => !(sound.author == author && sound.title == title)));
    }

    // When displayedSounds changes, update the audio cards
    useEffect(() => {
        loadAudioCards(displayedSounds);
    }, [displayedSounds]);

    function loadAudioCards(soundFiles) {
        setAudioCards(
            soundFiles.map((fileData, index) => 
            <AudioCard 
                sid={fileData.sid}
                title={fileData.title} 
                author={fileData.author} 
                id={`audioCard-${fileData.sid}`} 
                key={`audioCard-${fileData.sid}`} 
                toggleMessage={(type, content, length) => props.toggleMessage(type, content, length)}
                currentUser = {Cookies.get("sessionUsername")}
                isDeletable = {props.isDeletable}
                deleteSoundFile = {(author, title) => deleteSound(author, title)}
            />
        ));
    }

    return (
        <div className="audioCardWrapper" id="sounds">
            {audioCards}
            {loading && <Loader />}
            {!loading && displayedSounds.length == 0 && <span>Hmm, didn't find any sounds.</span>}
        </div>
    )
}