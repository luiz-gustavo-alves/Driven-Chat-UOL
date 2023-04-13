let messages = [];
let userName;

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
        setInterval(() => {

            const renderMessagesPromise = axios.get(msgURL);

            renderMessagesPromise.then(res => {
                console.log(res.data);
                messages = res.data;
                renderMessages();
            });

            renderMessagesPromise.catch(err => {
                console.log(err);
            });

        }, 3000);

        /* Check if user is still online */
        setInterval(() => {

            const userStatus = {
                name: userName
            };

            axios.post(userStatusURL, userStatus);

        }, 5000);
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

userAuth();