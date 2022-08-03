function triggerPanelScroll(scrollPanel, direction) {
    var newScrollX;

    if(direction == 'left') { newScrollX = scrollPanel.scrollLeft - scrollPanel.offsetWidth; } 
    else if(direction == 'right') { newScrollX = scrollPanel.scrollLeft + scrollPanel.offsetWidth; }
    else {
        console.log('Error: Invalid scroll direction given');
        return -1;
    }

    scrollPanel.scroll({
        top: 0,
        left: newScrollX,
        behavior: 'smooth'
    });

    return 0;
}