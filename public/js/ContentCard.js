function ContentCard(props) {
    return (
        <article id={props.id} className="contentCard">
            <h2>{props.title}</h2>
            <div className="soundImage"></div>
            <p>by <a href="/">{props.author}</a></p>
        </article>
    );
}

export default ContentCard;