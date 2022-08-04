function DropBox(props) {

    function clickHandler(e) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.wav,.WAV';
        input.multiple= true;
        input.onchange = (e) => {
            var files = e.target.files;
            for(var i=0; i<files.length; i++) {
                console.log('Loaded', files[i].name);
            }
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

        console.log("Drop!");
    }

    return (
        <article className="dropbox" id="dropbox" onClick={clickHandler} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler}>
            <img id="uploadIcon" className="icon" src="res/uploadIcon.svg"></img>
            <p>Drop .wav files here or click to browse</p>
        </article>
    );
}

export default DropBox;