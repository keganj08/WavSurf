import DropBox from './Dropbox.js';
import ContentCard from './ContentCard.js';

function LandingContent(props) {

    return (
        <main className="main">

            <section className="contentWrapper" id="contentWrapper_dropBox">
                <h1>Upload Sound Files</h1>
                <DropBox />
            </section>

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
    )
}

export default LandingContent;