import AudioCard from "../components/AudioCard.js";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Users(props) {
    const { username } = useParams();
    console.log(username);

    return (
        <main className="main">
            <div className="contentArea">
                <div className="container stack">
                    <section className="contentBox profile">
                        <div className="container" id="userHeaderContainer">
                            <FontAwesomeIcon className="userIcon" icon="fa-solid fa-user" />
                            <h1>{username}</h1>
                        </div>

                        <div className="container profileStats">
                        
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

/*

*/