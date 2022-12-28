import DropBox from './Dropbox.js';
import ContentCard from './ContentCard.js';
import { Link } from 'react-router-dom';

function LandingContent(props) {
    function getResource() {
        var formData = {"username" : "someUser", "url" : "https://wavsurf-files.s3.amazonaws.com/sounds/jolt.wav"};

        fetch('/getResource', {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <main className="main">
            <div className="contentArea">
                
                <section className="contentWrapper waveBox" id="contentWrapper_dropBox">
                    <h1>Upload Sound Files</h1>
                    <DropBox />
                </section>

                <div className="waves"></div>

                <section className="contentWrapper" id="contentWrapper_hot">
                    <h1>Popular Sounds</h1>
                    <div className='contentCardGrid' id='hot'>
                        <ContentCard title="Sound 1" author="John" id={0} />
                        <ContentCard title="Sound 2" author="Mary" id={1} />
                        <ContentCard title="Sound 3" author="John" id={2} />
                        <ContentCard title="Sound 4" author="Anna" id={3} />
                    </div>
                </section>

            </div>


        </main>
    )
}

export default LandingContent;