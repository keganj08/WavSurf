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
                        props.toggleMessage("error", "Error while contacting server");
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

    // When the sounds are retrieved update displayedSounds
    useEffect(() => {
        console.log(allSounds);
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
                id={`audioCard-${fileData.title}-${fileData.author}`} 
                key={`audioCard-${fileData.title}-${fileData.author}`}
                isDeletable={editable}
                deleteSoundFile={(author, title) => deleteSoundFile(author, title)}
            />
        ));
    }

    // Send an account deletion request
    function deleteAccount() {
        fetch(`/users/${username}`, {
            headers: { "Cookie": "name=value" },
            method: "DELETE",
        })
        .then(response => {
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
            // Account successfully deleted
            console.log(`HTTP Success: ${response.status}`);
            navigate("/");
            props.toggleMessage("confirm", "Your account has been deleted");
        });
    }

    function deleteSoundFile(author, title) {
        fetch(`/soundFiles/${author}/${title}`, {
            headers: { "Cookie": "name=value" },
            method: "DELETE",
        })
        .then(response => {
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
            // Sound file successfully deleted
            console.log(`HTTP Success: ${response.status}`);
            setAllSounds(allSounds.filter(sound => sound.title != title));
            props.toggleMessage("confirm", "Sound file deleted");
        });
    }

    return (
        <main className="main">
            <section className="sectionWrapper">
                <div className="container stack">
                    <article id="profile" className="contentBox">
                        <div className="contentRow" id="userHeaderContainer">
                            <FontAwesomeIcon className="userIcon" icon="fa-solid fa-user" />
                            <h2 id="username" className="shrinkable">{username}</h2>
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