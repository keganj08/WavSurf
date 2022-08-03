'use strict';

function buildScrollPanel(rootId) {

    const root = ReactDOM.createRoot(
        document.getElementById(rootId)
    );
    
    let buffer = [];
    
    for(var i=0; i<16; i++) {
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
    var component = 
        <section className='contentBlock'>
            {buffer}
        </section>;

    root.render(component);
}

buildScrollPanel('hot');



/*
const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
*/