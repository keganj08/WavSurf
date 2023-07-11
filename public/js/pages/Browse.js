import Loader from "../components/Loader.js";
import AudioCards from "../components/AudioCards.js";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// BROWSE: Main content of "/browse" route; Displays uploaded sound files 
    // toggleMessage: A callback function to use MessageModal
export default function Browse(props) {
    const [filterValue, setFilterValue] = useState("");

    const handleSearchChange = (event) => {
        event.persist();
        setFilterValue(event.target.value);
    }

    return (
        <main className="main">
            <section className="sectionWrapper">
                <div className="container stack">
                    <section className="contentBox">
                        <div className="contentRow">
                            <h2>Browse Sounds</h2>
                            <div id="soundSearchBar" className="searchBar" type="text">
                                <FontAwesomeIcon className="icon" icon="fa-solid fa-magnifying-glass" />
                                <input id="soundSearchInput" placeholder="Search" onChange={(e) => handleSearchChange(e)}/>
                            </div>
                        </div>

                        <AudioCards 
                            filterValue = {filterValue} 
                            toggleMessage = {(type, content, length) => props.toggleMessage(type, content, length)}
                            likedSounds = {props.likedSounds}
                            updateLikedSounds = {() => props.updateLikedSounds()}
                        />
                    </section>
                </div>
            </section>
        </main>
    )
}