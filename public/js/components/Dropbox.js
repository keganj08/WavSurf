import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// DROPBOX: Accepts and passes along file input by the user, either by browsing or dragging and dropping
    // returnFile: A callback function to be used once the file has been receieved
export default function DropBox(props) {
    function clickHandler(e) {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = ".wav,.WAV";
        input.multiple= false;
        input.onchange = (e) => {
            var files = e.target.files;
            validateAudioFiles(files);
        }
        input.click();
    }

    function dragOverHandler(e) {
        e.preventDefault();
        e.target.classList.add("highlighted");
    }

    function dragLeaveHandler(e) {
        e.target.classList.remove("highlighted");
    }

    function dropHandler(e) {
        e.stopPropagation();
        e.preventDefault();

        e.target.classList.remove("highlighted");

        let dt = e.dataTransfer;
        let files = dt.files;

        validateAudioFiles(files);
    }

    function validateAudioFiles(files) {
        if(files.length != 1) {
            console.log("ERROR: Audio file array is of invalid size.");
        } else {
            props.returnFile(files[0]);
        }
    }

    return (
        <div className="dropbox contentCard" id="dropbox" onClick={clickHandler} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
            <FontAwesomeIcon id="uploadIcon" className="icon" icon="fa-solid fa-upload" />
            <p id="dropboxCaption">Drop .wav files here or click to browse</p>
        </div>
    );
}