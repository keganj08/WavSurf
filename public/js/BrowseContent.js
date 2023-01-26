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
            let soundFiles = [];

            for(var i=0; i<data.Contents.length; i++) {

                if(data.Contents[i].Key.indexOf("sounds/") != -1) {
                    let authorPath = data.Contents[i].Key.split('sounds/')[1];
                    if(authorPath.indexOf("/") !=  -1) {
                        console.log(authorPath);
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
                    <section className="contentBox centered">
                        <div className="toolbar">
                            <span>Filters section</span>
                        </div>
                    </section>

                    <section className="contentBox">
                        <h1>Browse Sounds</h1>
                        <div className='contentCardWrapper' id='sounds'>
                            {contentCards}
                        </div>
                    </section>

                </div>
            </div>
        </main>
    )
}



export default BrowseContent;