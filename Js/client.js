// const socket = io('https://cdn.socket.io/4.3.2/socket.io.min.js');
const socket = io("https://mychatroom.vercel.app");

const displayProfileName = document.getElementById('display-profile-name');
const form = document.getElementById('send-container');
const messageInp = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const newUser = document.getElementById('new-user');
const joinBtn = document.getElementById('join-btn');
const homeContainer = document.getElementById('home-container');
const mainContainer = document.getElementById('main-container');
const needHelpBtn = document.getElementById('need-help-btn');
const needHelpTipsPage = document.getElementById('need-help-tips');
const needHelpTipsCancelBtn = document.getElementById('need-help-tips-btn');
const exitBtn = document.getElementById('exit-btn');
const roomLink = document.getElementById('room-link');




let isOpenTipsPage = true;
needHelpBtn.addEventListener('click', () => {
    if (isOpenTipsPage) {
        needHelpTipsPage.style.display = 'flex';
        isOpenTipsPage = false;
    } else {
        needHelpTipsPage.style.display = 'none';
        isOpenTipsPage = true;
    }
})

needHelpTipsCancelBtn.addEventListener('click', () => {
    needHelpTipsPage.style.display = 'none';
    isOpenTipsPage = true;
})

exitBtn.addEventListener('click', () => {
    socket.disconnect();
    console.log("Current user exited");
    mainContainer.style.display = 'none';
    homeContainer.style.display = 'block';
    location.reload();
})


const append = (message) => {
    const newUserAlert = document.createElement('div')
    newUserAlert.innerText = message;
    newUserAlert.classList.add('new-user-notification');
    messageContainer.appendChild(newUserAlert);
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

let prevSender = "";
let sender = false;

const appendMessageForReciever = (username, message, position, currentSender) => {
    const messageHolderDiv = document.createElement("div");
    const userName = document.createElement("div");
    const messageDiv = document.createElement("div");

    // Check if the current user is the same as the previous user
    if (currentSender !== prevSender || sender) {
        userName.textContent = username;
        userName.style.color = getDarkRandomColor();
        userName.classList.add("user-name");
        messageHolderDiv.appendChild(userName);
        sender = false;
    }

    userName.classList.add("user-message");
    messageDiv.textContent = message;

    messageHolderDiv.appendChild(messageDiv);
    messageHolderDiv.classList.add("message", position, `${position}-part`);
    if (currentSender !== prevSender && messageHolderDiv !== null) {
        messageHolderDiv.style.marginTop = "30px";
    }

    messageContainer.appendChild(messageHolderDiv);

    prevSender = currentSender;

};


const appendMessageForSender = (username, message, position, currentSender) => {
    const messageHolderDiv = document.createElement("div");
    const userName = document.createElement("div");
    const messageDiv = document.createElement("div");

    // Check if the current user is the same as the previous user
    if (currentSender !== prevSender) {
        userName.textContent = username;
        userName.style.color = getDarkRandomColor();
        userName.classList.add("user-name");
        messageHolderDiv.appendChild(userName);
    }

    userName.classList.add("user-message");
    messageDiv.textContent = message;

    messageHolderDiv.appendChild(messageDiv);
    messageHolderDiv.classList.add("message", position, `${position}-part`);
    if (currentSender !== prevSender && messageHolderDiv !== null || sender === false) {
        messageHolderDiv.style.marginTop = "30px";
    }

    messageContainer.appendChild(messageHolderDiv);

    prevSender = currentSender;
    sender = true;

};



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value.trimStart();
    if (validateSentence(message) && message !== "") {
        socket.emit('chat', message);
        appendMessageForSender("", message, 'right', prevSender);
    }
    messageInp.value = "";
})


joinBtn.addEventListener('click', () => {
    const uname = newUser.value.trim();
    displayProfileName.textContent = uname;

    if (uname !== "") {
        socket.emit('new-user-joined', uname);

        socket.on('user-joined', uname => {
            append(`${uname} joined the chat`);
        });
        homeContainer.style.display = "none";
        mainContainer.style.display = "block";
        console.log(uname, "is joined");
    }
})


socket.on('receive', data => {
    appendMessageForReciever(`${data.userName}\n`, `${data.mess}\n`, 'left', `${data.userID}`);
})

socket.on('leave', (userName) => {
    if (userName !== null) {
        append(`${userName} has left the chat`);
    }
})