import DropBox from './Dropbox.js';
import ContentCard from './ContentCard.js';
import { Link } from 'react-router-dom';

function LandingContent(props) {
    return (
        <main className="main">

            <section className="contentArea dark">
                <div className="container">
                    <article className="contentBox">
                        <h1>Upload Sound Files</h1>
                        <DropBox />
                    </article>
                    
                </div>
            </section>

            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1520 121">
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
                
            <section className="contentArea">
                <div className="container">
                    <article className="contentBox">
                        <h1>Popular Sounds</h1>
                    </article>
                </div>
            </section>

        </main>
    )
}

export default LandingContent;

/*

                    <div className='contentCardGrid' id='hot'>
                        <ContentCard title="Sound 1" author="John" id={0} />
                        <ContentCard title="Sound 2" author="Mary" id={1} />
                        <ContentCard title="Sound 3" author="John" id={2} />
                        <ContentCard title="Sound 4" author="Anna" id={3} />
                    </div>

*/