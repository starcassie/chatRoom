console.log(sha256('Message to hash'));
console.log("script running viewMessages");
let wrong = 0;

function getMessages() {
    console.log("trying to view messages");
    const messagesRef = firebase.database().ref();
    console.log(messagesRef);
    messagesRef.on("value", (snapshot) => {
        const messages = snapshot.val();
        validateMessages(messages);
    })
}

function validateMessages(messages) {
    const passcodeAttempt = document.querySelector("#passcode").value;
    let passwordCorrect = false;
    for (message in messages) {
        console.log(message);
        const messageData = messages[message];
        if (messageData.password.toString() == sha256(passcodeAttempt)) {
            console.log("correct")
            renderMessageAsHTML(messageData.message);
            passwordCorrect = true;
        }
    }
    if (passwordCorrect == false) {
        alert("wrong!");
        wrong++;
        if (wrong == 5) {
            const passField = document.querySelector("#passcode")
            passField.disabled = true;
            const button = document.querySelector("#viewMsg");
            button.disabled = true;
        }
    }
}

function renderMessageAsHTML(messageContent) {
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "none";
    passcodeInput.value = "";
    const messageDiv = document.querySelector("#messageDisplay");
    console.log(messageDiv);
    const messageDisplay = document.querySelector("#message");
    messageDisplay.innerHTML = messageContent;
    messageDiv.style.display = "block";
}

function back() {
    console.log("back");
    const passcodeInput = document.querySelector("#passcodeInput");
    passcodeInput.style.display = "block";
    const messageDiv = document.querySelector("#messageDisplay");
    messageDiv.style.display = "none";
}