import Cookies from 'js-cookie';

function DropBox(props) {

    function clickHandler(e) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.wav,.WAV';
        input.multiple= false;
        input.onchange = (e) => {
            var files = e.target.files;
            validateAudioFiles(files);
        }
        input.click();
    }

    function dragOverHandler(e) {
        e.preventDefault();
        e.target.classList.add('highlighted');
        console.log("Dragover");
    }

    function dragLeaveHandler(e) {
        e.target.classList.remove('highlighted');
    }

    function dropHandler(e) {
        e.stopPropagation();
        e.preventDefault();

        e.target.classList.remove('highlighted');

        let dt = e.dataTransfer;
        let files = dt.files;

        console.log(files);

        validateAudioFiles(files);
    }

    function validateAudioFiles(files) {
        if(files.length != 1) {
            console.log('ERROR: Audio file array is of invalid size.');
        } else {
            console.log("Dropbox received:");
            console.log(files[0]);
            props.triggerModal(files[0], Cookies.get("sessionUsername"));
            //uploadAudioFiles(files);
        }
    }

    return (
        <div className="dropbox" id="dropbox" onClick={clickHandler} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
            <img id="uploadIcon" className="icon" src="res/uploadIcon.svg"></img>
            <p id="dropboxCaption">Drop .wav files here or click to browse</p>
        </div>
    );
}

export default DropBox;