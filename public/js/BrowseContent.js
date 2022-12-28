import ContentCard from './ContentCard.js';


function BrowseContent(props) {

    function getSoundNames(filters) {
        console.log('Client attempting /listSounds for Browse page');
        fetch('/listSounds', {
            /*headers: { 'Content-Type': 'application/json' },*/
            method: 'GET'
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            for(var i=0; i<data.length; i++) {
                console.log(i);
                console.log(data[i]);
            }
        })
        .catch(error => {
            console.log(error);
        })

    }

    getSoundNames();

    return (
        <main className="main">
            <div className="contentArea">

                <div className="toolbar">
                    <span>Filters section</span>
                </div>

                <section className="contentWrapper" id="contentWrapper_sounds">
                    <div className='contentCardGrid' id='hot'>
                        <ContentCard title="Sound 1" author="John" id={0} />
                        <ContentCard title="Sound 2" author="Mary" id={1} />
                        <ContentCard title="Sound 3" author="John" id={2} />
                        <ContentCard title="Sound 4" author="Anna" id={3} />
                        <ContentCard title="Sound 1" author="John" id={0} />
                        <ContentCard title="Sound 2" author="Mary" id={1} />
                        <ContentCard title="Sound 3" author="John" id={2} />
                        <ContentCard title="Sound 4" author="Anna" id={3} />
                        <ContentCard title="Sound 1" author="John" id={0} />
                        <ContentCard title="Sound 2" author="Mary" id={1} />
                        <ContentCard title="Sound 3" author="John" id={2} />
                        <ContentCard title="Sound 4" author="Anna" id={3} />
                    </div>
                </section>

            </div>


        </main>

        /*
        <main className="main">

            <section className="contentWrapper" id="contentWrapper_hot">
                <h1>Popular Sounds</h1>
                <div className='contentCardGrid' id='hot'>
                    <ContentCard title="Sound 1" author="John" id={0} />
                    <ContentCard title="Sound 2" author="Mary" id={1} />
                    <ContentCard title="Sound 3" author="John" id={2} />
                    <ContentCard title="Sound 4" author="Anna" id={3} />
                </div>
            </section>

        </main>
        */
    )
}

export default BrowseContent;