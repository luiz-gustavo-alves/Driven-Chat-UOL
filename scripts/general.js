let messages = [];
let usersList = [];
let userName;
let currentSelectedUser;
let currentSelectedVisibility;

const userURL = 'https://mock-api.driven.com.br/api/vm/uol/participants';
const userStatusURL = 'https://mock-api.driven.com.br/api/vm/uol/status';
const msgURL = 'https://mock-api.driven.com.br/api/vm/uol/messages';
const token = 'uno6r9oP7lrt17ZaOROMIr8i';

axios.defaults.headers.common['Authorization'] = token;

function renderMessages() {

    const chat = document.querySelector(".chat");
    chat.innerHTML = "";

    for (let i = 0; i < messages.length; i++) {

        let message = messages[i];

        if (message.type === 'status') {
            
            chat.innerHTML += `
                <li class="status">
                    <span class="timestamp">(${message.time})</span> 
                    <span class="username">${message.from}</span> 
                    <span class="text">${message.text}</span> 
                </li>
            `;
        }

       if (message.type === 'message') {

            chat.innerHTML += `
                <li class="normal-message">
                    <span class="timestamp">(${message.time})</span> 
                    <span class="username">${message.from}</span>
                    <span class="text">para</span>
                    <span class="everyone">${message.to}:</span>
                    <span class="text">${message.text}</span>
                </li>
            `;
       }
    }
}

function renderUsersList() {

    const onlineUsers = document.querySelector(".online-users");
    currentSelectedUser = onlineUsers.querySelector(".selected-option" + " h3");

    let hidden = 'hidden';
    let selectedOption = '';

    if (currentSelectedUser != null) {

        currentSelectedUser = currentSelectedUser.innerHTML;

        if (currentSelectedUser=== 'Todos') {

            hidden = '';
            selectedOption = 'selected-option';
        }
    }

    onlineUsers.innerHTML = `
        <div class="user-content ${selectedOption}" onclick="selectChatOption('.online-users', this)">
            <ion-icon name="people"></ion-icon>
            <h3>Todos</h3>
            <div class="check ${hidden}">
                <ion-icon name="checkmark"></ion-icon>
            </div>
        </div>
    `;

    for (let i = 0; i < usersList.length; i++) {

        let user = usersList[i];

        if (hidden === '') {
            
            hidden = 'hidden';
            selectedOption = '';
        }

        if (currentSelectedUser != null) {

            currentSelectedUser = currentSelectedUser.innerHTML;

            if (currentSelectedUser === user.name) {
                hidden = '';
                selectedOption = 'selected-option';
            }
        }

        onlineUsers.innerHTML += `
            <div class="user-content ${selectedOption}" onclick="selectChatOption('.online-users', this)">
                <ion-icon name="person-circle"></ion-icon>
                <h3>${user.name}</h3>
                <div class="check ${hidden}">
                    <ion-icon name="checkmark"></ion-icon>
                </div>
            </div>
        `;
    }

    console.log("User list render");
}

function checkMessages() {

    const renderMessagesPromise = axios.get(msgURL);

    renderMessagesPromise.then(res => {
        messages = res.data;
        renderMessages();
    });

    renderMessagesPromise.catch(err => {
        console.log(err);
    });
}

function checkUserList() {

    const renderUserListPromise = axios.get(userURL);

    renderUserListPromise.then(res => {
        usersList = res.data;
        renderUsersList();
    });

    renderUserListPromise.catch( err => {
        console.log(err);
    });
}

function userAuth() {

    userName = prompt("Qual é o seu nome?");

    const authUser = {
        name: userName
    };

    const userAuthPromise = axios.post(userURL, authUser);

    /* User authenticated */
    userAuthPromise.then(() => {   

        console.log("User authenticated.");

        /* Check and render chat messages */
        setInterval(checkMessages, 3000);

        /* Check if user is still online */
        setInterval(() => {

            const userStatus = {
                name: userName
            };

            axios.post(userStatusURL, userStatus).catch(() => {
                window.location.reload();
            })
        }, 5000);

        /* Check user list */
        setInterval(checkUserList, 10000);
    });

    /* User not authenticated*/
    userAuthPromise.catch(() => {

        console.log("User not authenticated.");
        userAuth();
    });
}

function sendMessage() {

    const messageInput = document.querySelector(".message-input");

    const message = {
        from: userName,
        to: "Todos",
        text: messageInput.value,
        type: "message"
    };

    messageInput.value = '';

    const sendMessagePromise = axios.post(msgURL, message);

    sendMessagePromise.then(() => {
        console.log("Message sent!");
    });

    sendMessagePromise.catch(() => {
        console.log("Message not sent - User offline!");
        window.location.reload();
    });
}

checkMessages();
checkUserList(); 
userAuth(); 

function toggleSidebar() {

    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hidden");
}

function selectChatOption(optionType, selector) {

    const option = document.querySelector(optionType + " .selected-option");

    if (option != null) {

        const lastCheckOption = option.querySelector(".check");

        lastCheckOption.classList.add("hidden");
        option.classList.remove("selected-option");
    }

    selector.classList.add("selected-option");

    const currentCheckOption = selector.querySelector(".check");
    currentCheckOption.classList.remove("hidden");

    if (optionType === '.chat-visibility') {

        currentSelectedVisibility = selector.querySelector("h3").innerHTML;
    }
}