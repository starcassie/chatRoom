
// var messageNumber = 0;
var maxMessageLen = 16;
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var capLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function sendMessage() {
    // const messagesRef = firebase.database().ref();
    // console.log(messagesRef);
    // messagesRef.on("value", (snapshot) => {
    //     const messages = snapshot.val();
    //     if (Object.keys(messages).length === undefined) {
    //         messageNumber = 1;
    //     } else {
    //         messageNumber = Object.keys(messages).length + 1
    //     }
    //     console.log(messageNumber);
    // })
    // console.log(messageNumber + "**");
    // const password = document.querySelector("#passcode").value;
    // const message = document.querySelector("#message").value;
    // firebase.database().ref("msg" + messageNumber).set({
    //     "message": message,
    //     "password": password
    // })

    const password = document.querySelector("#passcode").value;
    const message = document.querySelector("#message").value;
        
    document.querySelector("#passcode").value = "";
    document.querySelector("#message").value = "";

    console.log(message.length);
    if (message.length > maxMessageLen) {
        alert("the length of your message is too long. It is " + message.length +
        " characters and needs to be 16 or less.");
    } else if (!validPass(password)) {
        alert("ERROR! You need a capital letter and a number please :)");
    } else {

        firebase.database().ref().push({
            "message": message,
            "password": sha256(password)
        })
    }
}

function validPass(str) {
    return (/[A-Z]/.test(str) && /[0-9]/.test(str));
}