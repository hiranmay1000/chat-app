const socket = io("http://localhost:8000");
// const socket = io("https://mychatroom.vercel.app");

const displayProfileName = document.getElementById('display-profile-name');
const messageInp = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const newUser = document.getElementById('new-user');
const homeContainer = document.getElementById('home-container');
const mainContainer = document.getElementById('main-container');
const needHelpTipsPage = document.getElementById('need-help-tips');
const connnectedUserBox = document.getElementById('connected-users-box');
const ConnectedUserCard = document.getElementById('connected-users-card')
const roomContainerBox = document.getElementById('room-container-box')
const soundAlertBox = document.getElementById('sound-alert-box')
const alertUnmute = document.getElementById('alert-unmute')
const alertMute = document.getElementById('alert-mute')

const form = document.getElementById('send-container');
const joinBtn = document.getElementById('join-btn');
const exitBtn = document.getElementById('exit-btn');
const needHelpBtn = document.getElementById('need-help-btn');
const needHelpTipsCancelBtn = document.getElementById('need-help-tips-btn');




let receiverSound = new Audio();
receiverSound.src = './Assets/ringtones/message-received-elegant.mp3';

let senderSound = new Audio();
senderSound.src = './Assets/ringtones/message-sent-iphone.mp3';

let isToggled = false;
soundAlertBox.addEventListener('click', () => {
    isToggled = !isToggled;
    if (isToggled) {
        alertUnmute.style.display = 'none';
        alertMute.style.display = 'block';

        receiverSound = null;
        senderSound = null;

    } else {
        alertUnmute.style.display = 'block';
        alertMute.style.display = 'none';

        if (senderSound) {
            senderSound.play();
        }

        receiverSound = new Audio();
        receiverSound.src = './Assets/ringtones/message-received-elegant.mp3';

        senderSound = new Audio();
        senderSound.src = './Assets/ringtones/message-sent-iphone.mp3';
    }
})


// Check if the user has already joined the chat
const hasJoinedChat = localStorage.getItem('hasJoinedChat');

if (hasJoinedChat) {
    // User has already joined, show the chat interface directly
    homeContainer.style.display = 'none';
    mainContainer.style.display = 'flex';
    connnectedUserBox.style.display = 'flex';
    roomContainerBox.style.display = 'flex';

    // Parse the stored JSON data
    const userData = JSON.parse(hasJoinedChat);

    // Extract the username from the parsed data
    const username = userData.username;

    // Emit a "new-user-joined" event to inform others about reconnection
    socket.emit('new-user-joined', username);
}



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value.trimStart();
    if (validateSentence(message) && message !== "") {
        socket.emit('chat', message);
        appendMessageForSender("", message, 'right', prevSender);

        if (senderSound !== null) {
            senderSound.play();
        }
    }
    messageInp.value = "";
})



exitBtn.addEventListener('click', () => {
    socket.disconnect();
    console.log("Current user exited");

    sessionStorage.removeItem('hasJoinedChat');

    mainContainer.style.display = 'none';
    homeContainer.style.display = 'block';
    connnectedUserBox.style.display = 'flex';
    roomContainerBox.style.display = 'flex';

    location.reload();
})




joinBtn.addEventListener('click', () => {
    const uname = newUser.value.trim();
    displayProfileName.textContent = uname;

    if (uname !== "") {
        socket.emit('new-user-joined', uname);

        socket.on('user-joined', (uname, users) => {
            append(`${uname} joined the chat`);
        });


        // Store the flag indicating the user has joined the chat
        sessionStorage.setItem('hasJoinedChat', true);


        homeContainer.style.display = "none";
        mainContainer.style.display = "flex";
        connnectedUserBox.style.display = 'flex';
        roomContainerBox.style.display = 'flex';

        console.log(uname, "is joined");
    }
})




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



const append = (message) => {
    const newUserAlert = document.createElement('div')
    newUserAlert.innerText = message;
    newUserAlert.classList.add('new-user-notification');
    messageContainer.appendChild(newUserAlert);
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


socket.on('receive', data => {
    if (receiverSound !== null) {
        receiverSound.play();
    }
    console.log(data.mess);
    appendMessageForReciever(`${data.userName}\n`, `${data.mess}\n`, 'left', `${data.userID}`);

})

socket.on('leave', (userName) => {
    if (userName !== null) {
        append(`${userName} has left the chat`);
    }
})