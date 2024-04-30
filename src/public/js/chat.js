Swal.fire({

    title: "Write your name",
    input: "text",
    inputValidator: (value) => {
        return !value && "You must enter a name...!!!";
    },
    allowOutsideClick: false

}).then(data => {
    
    let name = data.value;
    document.title = name;

    let inputMessage = document.getElementById("message");
    let divMessages = document.getElementById("messages");
    inputMessage.focus();

    const socket = io();

    socket.emit("id", name);

    socket.on("newUser", name => {

        Swal.fire({
            text: `${name} has logged in!!!`,
            toast: true,
            position: "top-right"
        });

    });

    socket.on("previousMessages", messages => {

        messages.forEach(m => {
            divMessages.innerHTML += `<span class="message"><strong>${m.name}</strong> says: <i>${m.message}</i></span><br>`;
            divMessages.scrollTop = divMessages.scrollHeight;
        });

    });

    socket.on("userExits", name => {

        divMessages.innerHTML += `<span class="message"><strong>${name}</strong> has left the chat </span><br>`;
        divMessages.scrollTop = divMessages.scrollHeight;

    });

    inputMessage.addEventListener("keyup", e => {
        e.preventDefault();

        if (e.code === "Enter" && e.target.value.trim().length > 0) {
            socket.emit("message", name, e.target.value.trim());
            e.target.value = "";
            e.target.focus();
        }
    });

    socket.on("newMessage", (name, message) => {

        divMessages.innerHTML += `<span class="message"><strong>${name}</strong> says: <i>${message}</i></span><br>`;
        divMessages.scrollTop = divMessages.scrollHeight;

    });
});
