
const socket = io("http://localhost:8080")

socket.on("connect", function() {
    //socket.send('hi');
})
socket.on("user_in", () => {
    console.log("saaa")
})
socket.on("new_message", data => {
    console.log(data);
    digest(data.body.feed.from,data.body.feed.msg);
})
function digest(user,msg) {
    let feed = document.createElement('li');
    feed.innerHTML = `${user}: ${msg}`;
    document.getElementById("chatfeed").appendChild(feed);
}
window.onload = function() {
    document.getElementById("buttonChat").addEventListener('click', submitFeed);
    document.getElementById("buttonEnter").addEventListener('click', login);
    function login(event) {
        event.preventDefault();
        let user = document.forms['login'].user.value;
        fetch('http://localhost:8080/?login='+user)
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }

            document.getElementById('chatlogin').style.display = "none";
            document.getElementById('chatview').style.display = "block";

            // Examine the text in the response
            response.json().then(function(data) {
                console.log(data);
            });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }
    function submitFeed(event) {
        event.preventDefault();
        let user = document.forms['login'].user.value;
        let msg = document.forms['messageform'].message.value
        socket.emit("message",user,msg, function(data) {
            console.log(data);
        })
        digest(user,msg)
    }
}