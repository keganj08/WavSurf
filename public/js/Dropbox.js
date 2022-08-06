function DropBox(props) {

    function clickHandler(e) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.wav,.WAV';
        input.multiple= true;
        input.onchange = (e) => {
            var files = e.target.files;
            uploadAudio(files);
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

        uploadAudio(files);
    }

    function uploadAudio(audioFiles) {
        var formData = new FormData();

        formData.append('audioFile1', audioFiles[0]);

        console.log('data in formdata: ', formData.get('audioFile1'));


        console.log('Client attempting /uploadAudio POST of formdata');
        fetch('http://127.0.0.1:3001/uploadAudio', {
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