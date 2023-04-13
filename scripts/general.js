let messages = [];

const userURL = 'https://mock-api.driven.com.br/api/vm/uol/participants';
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
                    <span class="everyone">Todos:</span>
                    <span class="text">${message.text}</span>
                </li>
            `;
       }
    }
}

function userAuth() {

    const username = prompt("Qual é o seu nome?");

    const authUser = {
        name: username
    };

    const promise = axios.post(userURL, authUser);
    promise.then(res => {
            
            console.log("usuario-logado");
            console.log(res);
        }
    )
    promise.catch(err => {
            console.log("usuario-ja-logado");
            userAuth();
        }
    )
}

userAuth();

setInterval(() => {
    const promise = axios.get(msgURL);
    promise.then(res => {
            console.log(res);
            messages = res.data;
            renderMessages();
        }
    )
    promise.catch(err => {
            console.log(err);
        }
    )
}
, 3000);