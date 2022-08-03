document.getElementById('loginLink').addEventListener('click', e => {

    e.preventDefault();

    fetch('http://127.0.0.1:3001/login', {
        method: 'POST'
        
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

    alert('Sent request... Check consoles');
} );

var scrollButtons = document.getElementsByClassName('scrollButton');
console.log(scrollButtons);
scrollButtons.forEach(e => {
    console.log('Hey');
    let panel = e.target.parentElement.querySelector('.scrollPanel');
    console.log(panel);
    triggerPanelScroll(panel, 'left');
});

/*
document.getElementById('scrollHotButton').addEventListener('click', e => {
    let panel = e.target.parentElement.querySelector('.scrollPanel');
    console.log(panel);
    triggerPanelScroll(panel, 'left');
});
*/