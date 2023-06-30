
function getDarkRandomColor() {
    const minComponent = 10; // Minimum value for a color component

    let r, g, b;

    // Generate random values for the color components within the lower range
    r = Math.floor(Math.random() * (255 - minComponent) + minComponent);
    g = Math.floor(Math.random() * (255 - minComponent) + minComponent);
    b = Math.floor(Math.random() * (255 - minComponent) + minComponent);

    const color = `rgb(${r}, ${g}, ${b})`; // Combine components to create RGB color
    return color;
}


let validateSentence = (message) => {
    var cnt = 0;
    for (let i = 0; i < message.length; i++) {
        if (message[i] == ' ') {
            cnt++;
        }
    }

    if (message.length === cnt) {
        return false;
    }

    return true;
}