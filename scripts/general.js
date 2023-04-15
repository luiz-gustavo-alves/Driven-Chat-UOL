let messages = [];
let usersList = [];
let userName;
let currentSelectedUser = 'Todos';
let currentMsgVisibility;
let currentLastMessage;
let newLastMessage = document.querySelector(".chat" + " li");

const userURL = 'https://mock-api.driven.com.br/api/vm/uol/participants';
const userStatusURL = 'https://mock-api.driven.com.br/api/vm/uol/status';
const msgURL = 'https://mock-api.driven.com.br/api/vm/uol/messages';
const token = 'uno6r9oP7lrt17ZaOROMIr8i';

axios.defaults.headers.common['Authorization'] = token;

function sendMessage() {

    const messageInput = document.querySelector(".message-input");

    /* Check is messageInput is empty */
    if (!messageInput.value.trim()) {
        
        console.log("Empty message!");
        messageInput.value = '';
        return;
    }

    let messageType;

    if (currentMsgVisibility === 'Reservadamente') {
        messageType = 'private_message';
    }
    else {
       messageType = 'message';
    }

    const message = {
        from: userName,
        to: currentSelectedUser,
        text: messageInput.value,
        type: messageType
    };

    messageInput.value = '';

    axios.post(msgURL, message)
    .then(() => {
        checkMessages();
        console.log("Message sent!");
    })
    .catch(() => {
        alert("Message not sent - User offline!");
        window.location.reload(true);
    });
}

/* Send message by pressing enter */
const messageInput = document.querySelector(".message-input");
messageInput.addEventListener("keyup", event => {

    if (event.key === "Enter") {
        sendMessage();
    }
});

function renderMessages() {

    const chat = document.querySelector(".chat");
    chat.innerHTML = '';

    for (let i = 0; i < messages.length; i++) {

        let message = messages[i];

        if (message.type === 'status') {
            
            chat.innerHTML += `
                <li class="status" data-test="message">
                    <span class="timestamp">(${message.time})</span> 
                    <span class="username">${message.from}</span> 
                    <span class="text">${message.text}</span> 
                </li>
            `;
        }

       else if (message.type === 'message') {

            chat.innerHTML += `
                <li class="normal-message" data-test="message">
                    <span class="timestamp">(${message.time})</span> 
                    <span class="username">${message.from}</span>
                    <span class="text">para</span>
                    <span class="everyone">${message.to}:</span>
                    <span class="text">${message.text}</span>
                </li>
            `;
       }

       else if (message.type === 'private_message') {

            if (message.from === userName || message.to === userName) {

                chat.innerHTML += `
                    <li class="direct-message" data-test="message">
                        <span class="timestamp">(${message.time})</span> 
                        <span class="username">${message.from}</span>
                        <span class="text">reservadamente para</span>
                        <span class="everyone">${message.to}:</span>
                        <span class="text">${message.text}</span>
                    </li>
                `;
            }
       }
    }
    
    const allMessages = document.querySelectorAll(".chat li");
    currentLastMessage = allMessages[allMessages.length - 1];

    if (currentLastMessage.innerHTML != newLastMessage.innerHTML) {

        newLastMessage = currentLastMessage;
        newLastMessage.scrollIntoView();
        console.log("New message in chat");
    }
}

function renderUsersList() {

    const onlineUsersList = document.querySelector(".online-users");

    onlineUsersList.innerHTML = `
        <li class="user-content" onclick="selectChatOption('.online-users', this)" data-test="all">
            <ion-icon name="people"></ion-icon>
            <h3>Todos</h3>
            <div class="check hidden" data-test="check">
                <ion-icon name="checkmark"></ion-icon>
            </div>
        </li>
    `;

    for (let i = 0; i < usersList.length; i++) {

        let user = usersList[i];

        onlineUsersList.innerHTML += `
            <li class="user-content" onclick="selectChatOption('.online-users', this)" data-test="participant">
                <ion-icon name="person-circle"></ion-icon>
                <h3>${user.name}</h3>
                <div class="check hidden" data-test="check">
                    <ion-icon name="checkmark"></ion-icon>
                </div>
            </li>
        `;
    }

    const usersContentList = onlineUsersList.querySelectorAll(".user-content");
    let offlineUser = true;
    
    /* Check if current selected user is online and check that user*/
    for (let i = 0; i < usersList.length; i++) {

        if (usersList[i].name === currentSelectedUser) {

            console.log(`Selecting user: ${currentSelectedUser}`);

            const selectedUser = usersContentList[i + 1];
            const check = selectedUser.querySelector(".check");

            selectedUser.classList.add("selected-option");
            check.classList.remove("hidden");
            
            offlineUser = false;
            break;
        }
    }

    /* If current selected user is offline, select user: Everyone */
    if (offlineUser) {

        console.log("Offline User! - Selecting user: Todos");
         
        const everyoneUser = usersContentList[0];
        const check = everyoneUser.querySelector(".check");

        everyoneUser.classList.add("selected-option");
        check.classList.remove("hidden");

        currentSelectedUser = 'Todos';
    }
    console.log("User list render");
}

function checkMessages() {

    axios.get(msgURL)
    .then(res => {
        messages = res.data;
        renderMessages();
    })
    .catch(err => {
        console.log(err);
    });
}

function checkUserList() {

    axios.get(userURL)
    .then(res => {
        usersList = res.data;
        renderUsersList();
    })
    .catch( err => {
        console.log(err);
    });
}

function loadChat() {

    checkMessages();
    checkUserList();

    const userAuthContent = document.querySelector(".user-auth-content");
    const loadingContent = document.querySelector(".loading-content");

    userAuthContent.classList.add("hidden");
    loadingContent.classList.remove("hidden");

    setTimeout(() => {

        const userAuthContainer = document.querySelector(".user-auth-container");
        userAuthContainer.classList.add("hidden");

    }, 3000);

    /* Check and render chat messages */
    setInterval(checkMessages, 3000);

    /* Check if user is still online */
    setInterval(() => {

        axios.post(userStatusURL, {name: userName})
        .catch(err => {

            if (err.response.status === 400) {
                window.location.reload(true);
            }
        })
    }, 5000);

    /* Check user list */
    setInterval(checkUserList, 10000);
}

function userAuth() {

    const userNameInput = document.querySelector(".username-input");
    userName = userNameInput.value;

    axios.get(userURL)
    .then( res => {
        
        const onlineUsers = res.data;
        if (onlineUsers.find( user => user.name === userName)) {

            alert("Username already taken, please choose another.");
            window.location.reload(true);
        }

        axios.post(userURL, {name: userName})
        .then(() => {
    
            console.log("User authenticated.");
            loadChat();
        })
        .catch(err => {
    
            alert("Invalid user.");
            if (err.response.status === 400) {
                window.location.reload(true);
            }
        });
    });
}

/* Send message by pressing enter */
document.querySelector(".username-input").addEventListener("keyup", event => {

    if (event.key === "Enter") {
        userAuth();
    }
});

function toggleSidebar() {

    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hidden");
}

function selectChatOption(optionType, selector) {

    const option = document.querySelector(optionType + " .selected-option");

    if (option !== null) {

        const lastCheckOption = option.querySelector(".check");
        lastCheckOption.classList.add("hidden");
        option.classList.remove("selected-option");
    }

    const currentCheckOption = selector.querySelector(".check");
    currentCheckOption.classList.remove("hidden");
    selector.classList.add("selected-option");

    if (optionType === '.online-users') {
        
        currentSelectedUser = selector.querySelector("h3").innerHTML;
        console.log(`Selecting user: ${currentSelectedUser}`);
    }

    if (optionType === '.chat-visibility') {

        currentMsgVisibility = selector.querySelector("h3").innerHTML;
        console.log(`Selecting message visibility: ${currentMsgVisibility}`);
    }

    const messageReceiver = document.querySelector(".message-receiver");
    messageReceiver.innerHTML = `Enviando para ${currentSelectedUser}`;

    if (currentMsgVisibility === 'Reservadamente') {
        messageReceiver.innerHTML += ` (reservadamente)`;
    }
}