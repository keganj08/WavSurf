function DropBox(props) {

    function clickHandler(e) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.wav,.WAV';
        input.multiple= true;
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
        if(files.length < 1 || files.length > 5) {
            console.log('ERROR: Audio file array is of invalid size.');
        } else {
            console.log(typeof (files[0]));
            uploadAudioFiles(files);
        }
    }

    function uploadAudioFiles(files) {
        var formData = new FormData();

        for(var i=0; i<files.length; i++) {
            formData.append('audioFile', files[i]);
        }
        //formData.append('audioFile', audioFiles);

        console.log('Client attempting /uploadAudio POST of formdata');
        fetch('/uploadAudio', {
            method: 'POST',
            body: formData
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
    }

    return (
        <article className="dropbox" id="dropbox" onClick={clickHandler} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
            <img id="uploadIcon" className="icon" src="res/uploadIcon.svg"></img>
            <p>Drop .wav files here or click to browse</p>
        </article>
    );
}

export default DropBox;