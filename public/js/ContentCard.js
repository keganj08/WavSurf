function ContentCard(props) {
    return (
        <article id={props.id} className="contentCard">
            <h2>{props.title.split(".wav")[0]}</h2>
            <div className="soundImage">
                <audio controls>
                    <source src={"https://d30lofdjjrvqbo.cloudfront.net/sounds/" + props.title} type="audio/wav"></source>
                </audio>
            </div>
            <p>by <a href="/">{props.author}</a></p>
        </article>
    );
}

export default ContentCard;