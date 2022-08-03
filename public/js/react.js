'use strict';

class ContentCard extends React.Component {
    constructor(props) {
        super(props);
        this.data = {
            title: props.title,
            author: props.author,
            id: "contentCard_" + props.id,
        }
    }

    render() {
        return (
            <article id={this.data.id} className="contentCard">
                <h2>{this.data.title}</h2>
                <div className="soundImage"></div>
                <p>by <a href="/">{this.data.author}</a></p>
            </article>
        );
    }
}

class MainContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="main">

                <section className="outerContentWrapper" id="contentWrapper_dropBox">
                    <h1>Upload Sound File</h1>
                    <div className="contentBlock" id="dropbox">

                    </div>
                </section>

                <section className="outerContentWrapper" id="contentWrapper_hot">
                    <h1>Popular Sounds</h1>
                    <div className='contentBlock' id='hot'>
                        <ContentCard title="Sound 1" author="John" id={0} />
                        <ContentCard title="Sound 2" author="Mary" id={1} />
                        <ContentCard title="Sound 3" author="John" id={2} />
                        <ContentCard title="Sound 4" author="Anna" id={3} />
                    </div>

                </section>

            </main>
        )
    }
}

class Page extends React.Component {
    render() {
        return (
            <div className="page">
                <header className="pageHeader">
                    <img id="logo" src="res/logo.svg"></img>
                    
                    <nav>
                        <a id="loginLink" onClick={login} href="/">Log in</a>
                    </nav>
                </header>

                <MainContent />

                <footer className="pageFooter">

                </footer>
            </div>
        );
    }
}

function login(e) {
    e.preventDefault();

    fetch('http://127.0.0.1:3001/login', {
        method: 'POST'
        
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

    alert('Sent request... Check consoles');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Page/>);