import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";


// AUDIOCARD: An interactive element for displaying, playing, and downloading a sound file
    // title: Audio file title- Must be the same as the file's title on S3
    // author: Audio file uploader
export default function AudioCard(props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentTimeText, setCurrentTimeText] = useState("0:00");
    const [durationText, setDurationText] = useState("0:00");
    const [isDeletable, setIsDeletable] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const audio = useRef(new Audio("https://d30lofdjjrvqbo.cloudfront.net/sounds/" + props.author + "/" + props.title));
    const interval = useRef(0);
    const isReady = useRef(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        if(props.isDeletable) { setIsDeletable(true); }

        updateIsLiked();
    }, []);

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

    // Update slider colors when currentTime changes
    useEffect(() => {
        const min = sliderRef.current.min;
        const max = sliderRef.current.max;
        const breakPoint = ((currentTime - min)*100 / (max-min));
        const colorLightGunmetal = "#27646e";
        const colorMintCream = "#F5F5F5";
        sliderRef.current.style.background = `linear-gradient(to right, ${colorLightGunmetal} ${breakPoint}%, ${colorMintCream} ${breakPoint}%)`
    }, [currentTime]);


    // Initialize time tracker
    audio.current.addEventListener('loadedmetadata', function() {
        setDurationText(formatTime(audio.current.duration));
    });

    function updateIsLiked() {
        // Check if the logged-in user has liked this sound
        if(props.currentUser) {
            fetch(`/likes/${props.sid}/${props.currentUser}`, {
                method: "GET"
            })
            .then(response => {
                if(!response.ok) {
                    return response.json()
                    .then(data => {
                        // Valid response with error 
                        if(data.info) {
                            props.toggleMessage("error", data.info);
                        } else {
                            props.toggleMessage("error", "Unknown error");
                        }
                    })
                    .catch(error => {
                        // Unexpected or unreadable response
                        props.toggleMessage("error", "Error while trying to contact server");
                        throw new Error(response.status);
                    });
                } else {
                    // Retrieved data successfully
                    console.log(`HTTP Success: ${response.status}`);
                    return response.json()
                    .then(data => {
                        if(data.isLiked != undefined) {
                            setIsLiked(data.isLiked);
                        }
                    });
                }
            });
        }
    }

    function formatTime(rawTime) {
        let minutes = (String)(Math.floor(rawTime / 60)).padStart(1, "0");
        let seconds = (String)((rawTime % 60).toFixed(0)).padStart(2, "0");
        return(minutes + ":" + seconds);
    }

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

    function onScrub(value) {
        clearInterval(interval.current);
        audio.current.currentTime = value;
        setCurrentTime(audio.current.currentTime);
        setCurrentTimeText(formatTime(audio.current.currentTime));
    }


    function handleLikeClick() {
        console.log("Attempting like...");
        fetch(`/soundFiles/${props.author}/${props.title}/likes/${Cookies.get("sessionUsername")}`, {
            method: "PUT",
        })
        .then(response => {
            if(!response.ok) {
                return response.json()
                .then(data => {
                    // Valid response with error
                    if(data.info) {
                        props.toggleMessage("error", data.info);
                    } else {
                        props.toggleMessage("error", "Unknown error");
                    }
                })
                .catch(error => {
                    // Unexpected or unreadable response
                    props.toggleMessage("error", "Error while trying to contact server");
                    throw new Error(response.status);
                })
            } else {
                console.log(`Like HTTP Success: ${response.status}`);
                updateIsLiked();
            }
        })
    }
    
    const onScrubEnd = () => {
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

    let likeIcon;
    if(isLiked) {
        likeIcon = <FontAwesomeIcon className="likeIconSolid" icon="fa-solid fa-heart" />
    } else {
        likeIcon = <FontAwesomeIcon className="likeIconReg" icon="fa-regular fa-heart" />
    }

    return (
        <article id={props.id} className="audioCard contentCard">
            
            <h2 className="soundTitle">{props.title.split(".wav")[0]}</h2>
            {!isDeletable && <span className="soundAuthor"> 
                (<Link className="authorLink" to={"/users/" + props.author}>{props.author}</Link>)
            </span>}
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
                    ref={sliderRef}
                />
            </span>
            <span className="soundTimeText">
                {currentTimeText}/{durationText}
            </span>
            {!isDeletable && <span className="soundLikeBtn">
                <button className="likeBtn iconButton" onClick={() => handleLikeClick(props.author, props.title)}>
                    {likeIcon}
                </button>
            </span>}
            {isDeletable && <span className="soundDeleter">
                <button className="soundDeleteButton" onClick={() => props.deleteSoundFile(props.author, props.title)}>Delete</button>
            </span>}
            <span className="soundDownloadBox">
                <a href={"https://d30lofdjjrvqbo.cloudfront.net/sounds/" + props.author + "/" + props.title}>
                    <FontAwesomeIcon className="iconButton" icon="fa-solid fa-download" />
                </a>
            </span>
        </article>
    );
}