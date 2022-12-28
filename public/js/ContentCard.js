function ContentCard(props) {
    return (
        <article id={props.id} className="contentCard">
            <h2>{props.title}</h2>
            <div className="soundImage">
                <audio controls>
                    <source src="https://d30lofdjjrvqbo.cloudfront.net/sounds/jolt.wav" type="audio/wav"></source>
                </audio>
            </div>
            <p>by <a href="/">{props.author}</a></p>
        </article>
    );
}

export default ContentCard;