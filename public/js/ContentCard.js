import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect, useRef } from 'react';

function ContentCard(props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTimeText, setCurrentTimeText] = useState("0:00");
    const [durationText, setDurationText] = useState("0:00");
    const audio = useRef(new Audio("https://d30lofdjjrvqbo.cloudfront.net/sounds/" + props.author + "/" + props.title));
    const interval = useRef(0);
    const isReady = useRef(false);

    // Pause and clean up on unmount
    useEffect(() => {
        return () => {
          audio.current.pause();
          clearInterval(interval.current);
        }
    }, []);

    // Wait until audio is ready to allow playback
    useEffect(() => {
        if(!isReady.current) {
            isReady.current = true;

        }
    }, [audio.current]);

    // Play/pause audio when isPlaying changes
    useEffect(() => {
        if(isReady.current) {
            if(isPlaying) { 
                audio.current.play();
                startTimer(); 
            } else { 
                clearInterval(interval.current);
                audio.current.pause(); 
            }
        }
    }, [isPlaying]);

    audio.current.addEventListener('loadedmetadata', function() {
        setDurationText(formatTime(audio.current.duration));
    });

    // On interval while sound is playing, update currentTime 
    function startTimer() {
        clearInterval(interval.current);

        interval.current = setInterval(() => {
            if (audio.current.ended) {
                clearInterval(interval.current);
                setIsPlaying(false);
                setCurrentTime(audio.current.duration);
            } else {
                setCurrentTime(audio.current.currentTime);
                setCurrentTimeText(formatTime(audio.current.currentTime));
            }
        }, [100]);
    }

    function handlePlayClick() { setIsPlaying(!isPlaying); }

    function formatTime(rawTime) {
        let minutes = (String)(Math.floor(rawTime / 60)).padStart(1, "0");
        let seconds = (String)((rawTime % 60).toFixed(0)).padStart(2, "0");
        return(minutes + ":" + seconds);
    }

    function onScrub(value) {
        clearInterval(interval.current);
        audio.current.currentTime = value;
        setCurrentTime(audio.current.currentTime);
        setCurrentTimeText(formatTime(audio.current.currentTime));
    }
    
    const onScrubEnd = () => {
        console.log("Fired onScrubEnd...");
        // If not already playing, start
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
    }

    let playIcon;
    if (!isPlaying) {
        playIcon = <FontAwesomeIcon icon="fa-solid fa-play" />
    } else {
        playIcon = <FontAwesomeIcon icon="fa-solid fa-pause" />
    }        

    return (
        <article id={props.id} className="contentCard">
            
            <h2 className="soundTitle">{props.title.split(".wav")[0]}</h2>
            <span className="soundPlayBox">
                <button className="iconButton" onClick={handlePlayClick}>{playIcon}</button>
            </span>
            <span className="soundSliderBox">
                <input 
                    type="range" 
                    className="soundSlider" 
                    onChange={(e) => onScrub(e.target.value)}
                    onPointerUp={onScrubEnd}
                    onTouchEnd={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    value={currentTime} 
                    step={audio.current.duration ? audio.current.duration/2500.0 : 1}
                    min="0"
                    max={audio.current.duration ? audio.current.duration : `${durationText}`}
                />
            </span>
            <span className="soundTimeText">
                {currentTimeText}/{durationText}
            </span>
            <span className="soundAuthor">By: <a className="authorLink" href="/">{props.author}</a></span>
            <span className="soundDownloadBox">
                <a href={"https://d30lofdjjrvqbo.cloudfront.net/sounds/" + props.author + "/" + props.title}>
                    <FontAwesomeIcon className="iconButton" icon="fa-solid fa-download" />
                </a>
            </span>
        </article>
    );
}

export default ContentCard;