let wrong = 0;
let currentPass = "";
let currentName = "";

function getMessages() {
    const messagesRef = firebase.database().ref();
    messagesRef.on("value", (snapshot) => {
        const messages = snapshot.val();
        validateMessages(messages);
    })
}

function validateMessages(messages) {
    const passcodeAttempt = document.querySelector("#passcode").value;
    currentPass = passcodeAttempt;
    const name = document.querySelector("#name").value;
    currentName = name;
    let passwordCorrect = false;
    let allMessages = [];
    for (message in messages) {
        console.log(message);
        const messageData = messages[message];
        if (messageData.password.toString() == sha256(passcodeAttempt)) {
            console.log("correct")
            allMessages.push([messageData.message, messageData.name]);
            console.log(allMessages);
            passwordCorrect = true;
        }
    }
    if (passwordCorrect == false) {
        if (validPass(passcodeAttempt) && passcodeAttempt.length > 5) {
            wrong++;
            firebase.database().ref().push({
                "message": "you made a chat room",
                "password": sha256(passcodeAttempt),
                "name": currentName
            })
            renderMessageAsHTML([["you made a chat room", currentName]]);
            if (wrong == 5) {
                const passField = document.querySelector("#passcode")
                passField.disabled = true;
                const button = document.querySelector("#viewMsg");
                button.disabled = true;
            }
        } else {
            alert("your password needs to have an uppercase letter & number & has to be at least 5 long");
        }
    } else {
        renderMessageAsHTML(allMessages);
    }
}

function renderMessageAsHTML(messageContent) {
    console.log(messageContent);
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "none";
    passcodeInput.value = "";
    const messageDiv = document.querySelector("#messageDisplay");
    const messageDisplay = document.querySelector("#messageList");
    messageDisplay.innerHTML = `<li></li>`;
    console.log(messageDisplay);    
    messageContent.forEach( item => {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(item[0] + " - " + item[1]));
        messageDisplay.appendChild(li);
    })
    console.log(messageDisplay);
    messageDiv.style.display = "block";
}

function back() {
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "block";
    const messageDiv = document.querySelector("#messageDisplay");
    messageDiv.style.display = "none";
}

function send() {
    const message = document.querySelector("#newMessage");
    console.log(message.value);
    firebase.database().ref().push({
        "message": message.value,
        "password": sha256(currentPass),
        "name": currentName
    })
    document.querySelector("#newMessage").value = "";
}

function validPass(str) {
    return (/[A-Z]/.test(str) && /[0-9]/.test(str));
}