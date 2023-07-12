import AudioCards from "../components/AudioCards.js";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';

export default function Users(props) {
    const [isEditable, setisEditable] = useState(false);
    const { username } = useParams();
    const navigate = useNavigate();

    // Check if the user should be able to request edits on this profile
    useEffect(() => {
        if(Cookies.get("sessionUsername") == username) { 
            setisEditable(true);
        }
    }, []); 

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
                            {isEditable && <button id="deleteAccountButton" className="navButton" onClick={() => deleteAccount()}>Delete Account </button>}
                        </div>
                    </article>

                    <AudioCards 
                            constraints = {{"author": username}}
                            filterValue = "" 
                            toggleMessage = {(type, content, length) => props.toggleMessage(type, content, length)}
                            deleteSoundFile = {(author, title) => deleteSoundFile(author, title)}
                            isDeletable = {isEditable}
                    />
                </div>

            </section>
        </main>
    )
}