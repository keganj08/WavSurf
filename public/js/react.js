'use strict';

function buildPage(rootId) {

    // Prepare content cards
    const root = ReactDOM.createRoot(
        document.getElementById(rootId)
    );
    
    let buffer = [];
    
    for(var i=0; i<12; i++) {
        var title = 'Sound ' + i;
        var author = 'Kegan';
        var id = 'soundCard_' + i;
        var key = 'soundCard_' + i;
    
        buffer.push(
            <article id={id} className="contentCard" key={key}>
                <h2>{title}</h2>
                <div className="soundImage"></div>
                <p>by <a href="/">{author}</a></p>
            </article>
        );
    }

    // Generate the page
    var page = 
        <div class="wrapper">
            <header class="pageHeader">
            <img id="logo" src="res/logo.svg"></img>
            
            <nav>
                <a id="loginLink" href="/login.html">Log in</a>
            </nav>
            </header>

            <main class="main">

                <section class="outerContentWrapper" id="contentWrapper_dropBox">
                    <h1>Upload Sound File</h1>
                    <div class="innerContentWrapper" id="dropbox">

                    </div>
                </section>

                <section class="outerContentWrapper" id="contentWrapper_hot">
                    <h1>Popular Sounds</h1>
                    <div class="innerContentWrapper" id="hot">
                        <section className='contentBlock'>
                            {buffer}
                        </section>
                    </div>

                </section>

            </main>

            <footer class="pageFooter">

            </footer>
        </div>;
    
    root.render(page);
}

buildPage('root');