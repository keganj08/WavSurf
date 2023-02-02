import ContentCard from './ContentCard.js';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Browse(props) {
    const [soundFileNames, setSoundFileNames] = useState([]);
    const [contentCards, setContentCards] = useState([]);

    useEffect(() => {
        
        console.log('Client attempting /listSounds for Browse page');
        fetch('/listSounds', {
            method: 'GET'
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            /* Get the titles of each sound file */
            let soundFiles = [];

            for(var i=0; i<data.Contents.length; i++) {

                if(data.Contents[i].Key.indexOf("sounds/") != -1) {
                    let authorPath = data.Contents[i].Key.split('sounds/')[1];
                    if(authorPath.indexOf("/") !=  -1) {
                        let title = authorPath.split("/")[1];
                        let author = authorPath.split("/")[0];
                        soundFiles.push({title, author});
                    }
                }

            }

            setSoundFileNames(soundFiles);
            setContentCards(
                soundFiles.map((fileData, index) => 
                <ContentCard 
                    title={fileData.title} 
                    author={fileData.author} 
                    id={index} 
                    key={index} 
                />
            ));
        })
        .catch(error => {
            console.log(error);
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

                        <div className='contentCardWrapper' id='sounds'>
                            {contentCards}
                        </div>
                    </section>

                </div>
            </div>
        </main>
    )
}