const connectedUserDialog = document.querySelector('.connected-users-dialog');


const printAllUsers = (users) => {
    connectedUserDialog.innerHTML = ''; // Clear the existing user list

    for (const userID in users) {
        if (Object.hasOwnProperty.call(users, userID)) {
            const createConnectedUserCard = document.createElement('div');
            const createConnectedUserAvatar = document.createElement('h2');
            const createConnectedUsername = document.createElement('h4');

            const name = users[userID];
            console.log("user: ", name);
            createConnectedUserAvatar.textContent = name[0].toUpperCase();
            createConnectedUserAvatar.classList.add('connected-users-avatar');

            if (name.length > 8) {
                const newName = name.slice(0, 8) + "...";
                createConnectedUsername.textContent = newName;
                createConnectedUsername.title = name; // Set the full name as the tooltip text
            } else {
                createConnectedUsername.textContent = name;
            }

            createConnectedUsername.addEventListener('click', () => {
                navigator.clipboard.writeText(name)
            });

            createConnectedUsername.classList.add('connected-users-username');
            createConnectedUserCard.classList.add('connected-users-card');

            createConnectedUserCard.appendChild(createConnectedUserAvatar);
            createConnectedUserCard.appendChild(createConnectedUsername);

            connectedUserDialog.appendChild(createConnectedUserCard);
        }
    }
}

socket.on('active-users', (users) => {
    printAllUsers(users);
})

socket.on('disconnected-users', (users) => {
    printAllUsers(users);
})


