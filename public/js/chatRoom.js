// holds the current password for the room the user is in
let currentPass = "";
// holds the user's current name
let currentName = "";

function getMessages() {
    // gets the messages from firebase
    const messagesRef = firebase.database().ref();
    messagesRef.on("value", (snapshot) => {
        const messages = snapshot.val();
        validateMessages(messages);
    })
}

function validateMessages(messages) {
    // checks the messages to find the ones that match the current password
    // if the password is valid and not in use it creates a new room
    // if the password is in use it creates an array with the messages and names
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
        if (validPass(passcodeAttempt) && passcodeAttempt.length >= 5) {
            firebase.database().ref().push({
                "message": "you made a chat room",
                "password": sha256(passcodeAttempt),
                "name": currentName
            })
            renderMessageAsHTML([["you made a chat room", currentName]]);
        } else {
            alert("your password needs to have an uppercase letter & number & has to be at least 5 long");
        }
    } else {
        renderMessageAsHTML(allMessages);
    }
}

function renderMessageAsHTML(messageContent) {
    // takes in the messages and the names and displays them
    console.log(messageContent);
    document.querySelector("#topText").innerHTML = "You entered a chat room!";
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "none";
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
    messageDiv.style.display = "flex";
}

function back() {
    // takes one back to the chat room entry page
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "flex";
    const messageDiv = document.querySelector("#messageDisplay");
    messageDiv.style.display = "none";
    document.querySelector("#topText").innerHTML = "Enter a chat room!";
}

function send() {
    // adds the message to the database
    const message = document.querySelector("#newMessage");
    console.log(message.value);
    if (message != "") {
        firebase.database().ref().push({
            "message": message.value,
            "password": sha256(currentPass),
            "name": currentName
        })
        document.querySelector("#newMessage").value = "";
    }
}

function validPass(str) {
    // ensures the password has a capital letter and a num
    return (/[A-Z]/.test(str) && /[0-9]/.test(str));
}