document.getElementById('loginLink').addEventListener('click', e => {
    
    e.preventDefault();
    alert('clicked me...');


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