import ContentCard from './ContentCard.js';
import React, { useState, useEffect } from 'react';

/*  MISSION PLAN:
        Render the ContentCards with a callback, which allows us to wait
        until we receive their information from the server.      
*/

function BrowseContent(props) {
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
            let newSoundFileNames = [];

            for(var i=0; i<data.Contents.length; i++) {
                if(data.Contents[i].Key.split('sounds/')[1].length !== 0 ) {
                    newSoundFileNames.push(data.Contents[i].Key.split("sounds/")[1]);
                }
            }

            setSoundFileNames(newSoundFileNames);
            setContentCards(newSoundFileNames.map((fileName, index) => <ContentCard title={fileName} author={"Dude " + index} id={index} key={index} />));
        })
        .catch(error => {
            console.log(error);
            return null;
        })
    },[])

    return (
        <main className="main">
            <div className="contentArea">

                <div className="toolbar">
                    <span>Filters section</span>
                </div>

                <section className="contentWrapper" id="contentWrapper_sounds">
                    <div className='contentCardGrid' id='sounds'>
                        {contentCards}
                    </div>
                </section>

            </div>


        </main>
    )
}

export default BrowseContent;