import Loader from "../components/Loader.js";
import AudioCard from "../components/AudioCard.js";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';

export default function Users(props) {
    const [loading, setLoading] = useState(true);
    const [allSounds, setAllSounds] = useState([]);
    const [displayedSounds, setDisplayedSounds] = useState([]);
    const [audioCards, setAudioCards] = useState([]);
    const [editable, setEditable] = useState(false);
    const { username } = useParams();
    const navigate = useNavigate();

    // Check if the user should be able to request edits on this profile
    useEffect(() => {
        if(Cookies.get("sessionUsername") == username) { 
            setEditable(true);
        }
    }, []); 

    // On initial mount, retrieve all sounds
    useEffect(() => {
        fetch(`/soundFiles/${username}`, {
            method: "GET"
        })
        .then(response => {
            console.log(response.status);
            if(response.ok){
                console.log(`HTTP Success: ${response.status}`);
            } else {
                props.toggleMessage("error", "Server error");
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let soundFiles = [];
            if(data.soundFiles) { soundFiles = data.soundFiles; }
            setAllSounds(soundFiles);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
            props.toggleMessage("error", "Error while trying to contact server");
        })
    }, []);

    // When the sounds are retrieved update displayedSounds
    useEffect(() => {
        setDisplayedSounds(allSounds);
    }, [allSounds]);

    // When displayedSounds changes, update the audio cards
    useEffect(() => {
        loadAudioCards(displayedSounds);
    }, [displayedSounds]);

    function loadAudioCards(soundFiles) {
        setAudioCards(
            soundFiles.map((fileData, index) => 
            <AudioCard 
                title={fileData.title} 
                author={fileData.author} 
                id={"audioCard-" + index} 
                key={"audioCard-" + index} 
                deletable={editable}
            />
        ));
    }

    // Send an account deletion request
    function deleteAccount() {
        fetch(`/users/${username}`, { // Validate uesr's JWT
            headers: { "Cookie": "name=value" },
            method: "DELETE",
        })
        .then(response => {
            if(response.ok) {
                console.log(`HTTP Success: ${response.status}`);
                navigate("/");
                props.toggleMessage("info", "Your account has been deleted");
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            //return response.json();
        })
        .then(data => {
            // Currently unused
        })
        .catch(error => {
            console.log(err);
        });
    }

    return (
        <main className="main">
            <section className="sectionWrapper">
                <div className="container stack">
                    <article id="profile" className="contentBox">
                        <div className="contentRow" id="userHeaderContainer">
                            <FontAwesomeIcon className="userIcon" icon="fa-solid fa-user" />
                            <h1>{username}</h1>
                            {editable && <button id="deleteAccountButton" className="navButton" onClick={() => deleteAccount()}>Delete Account </button>}
                        </div>
                    </article>

                    <div className="audioCardWrapper" id="sounds">
                        {audioCards}
                        {!loading && displayedSounds.length == 0 && <span>Hmm, didn't find any sounds by that user.</span>}
                        {loading && <Loader />}
                    </div>
                </div>

            </section>
        </main>
    )
}

/*

*/