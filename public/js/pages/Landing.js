import DropBox from "../components/Dropbox.js";
import AudioCards from "../components/AudioCards.js";
import UploadModal from "../components/UploadModal.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// LANDING: Main content of "/" route; Contains upload dropbox and example sound files
    // toggleMessage: A callback function to use MessageModal
export default function Landing(props) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({
        file: null,
        title: ""
    });

    function triggerUploadModal(newFile) {
        setUploadData({file: newFile, title: newFile.name});
        setShowUploadModal(true);
    }

    return (
        <main className="main">

            <UploadModal 
                id="soundUploadModal" 
                showing={showUploadModal} 
                file={uploadData.file} 
                title={uploadData.title}
                close={() => setShowUploadModal(false)}
                toggleMessage={props.toggleMessage}
            />

            <section className="sectionWrapper dark">
                <div id="landingBanner" className="container">
                    <div id="landingLogoBox" className="contentBox">
                        <h1 id="bigHeader">Find Your Sound,<br/>Share Your Sound.</h1>
                        <nav id="landingNav">
                            <Link className="navButton" to="/browse">Browse Sounds</Link>
                            {!Cookies.get("sessionUsername") && <Link id="singupLink" className="navButton outlineButton" to="/signup">Sign Up</Link>}
                        </nav>

                    </div>
                    <div className="contentBox">
                        <img id="graphic" src="res/cloudGraphic.svg"></img>
                    </div>
                    
                </div>
            </section>

            <svg className="separator" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1520 121">
                <g>
                    <linearGradient id="linear-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0" stopColor="#19323C" stopOpacity="1"/>
                        <stop offset="1" stopColor="#27646e" stopOpacity="1"/>
                    </linearGradient>
                    <path fill="url(#linear-gradient" d="M 0 19 C 3.5 19 -10.5 59 -7 59 L -7 59 L -7 0 L 0 0 Z" strokeWidth="0"></path> 
                    <path fill="url(#linear-gradient" d="M -8 59 C 219 59 219 116 446 116 L 446 116 L 446 0 L -8 0 Z" strokeWidth="0"></path> 
                    <path fill="url(#linear-gradient" d="M 445 116 C 698.5 116 698.5 25 952 25 L 952 25 L 952 0 L 445 0 Z" strokeWidth="0"></path>
                    <path fill="url(#linear-gradient" d="M 951 25 C 1098.5 25 1098.5 80 1246 80 L 1246 80 L 1246 0 L 951 0 Z" strokeWidth="0"></path>
                    <path fill="url(#linear-gradient" d="M 1245 80 C 1383.5 80 1383.5 46 1522 46 L 1522 46 L 1522 0 L 1245 0 Z" strokeWidth="0"></path>
                    <path fill="url(#linear-gradient" d="M 1521 46 C 1522 46 1518 76 1519 76 L 1519 76 L 1519 0 L 1521 0 Z" strokeWidth="0"></path>

                </g>
            </svg>
                
            <section className="sectionWrapper">
                <div className="container">
                    <div className="contentBox">
                        <h2>Upload Your Files</h2>
                        <DropBox returnFile = {(newFile, newAuthor) => triggerUploadModal(newFile, newAuthor)}/>
                    </div> 
                </div>
            </section>

            <section className="sectionWrapper">
                <div className="container">
                    <div className="contentBox">
                        <h2>Popular Sounds</h2>
                        <AudioCards 
                            constraints = {{"limitTopN": 5}}
                            filterValue = "" 
                            toggleMessage = {(type, content, length) => props.toggleMessage(type, content, length)}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}