console.log("cargado")
const jQ = function(id) { return document.getElementById(id) }
    const qS = function(q) { return document.querySelector(q) }
    const eL = function(el) { return document.createElement(el) }
    const F = function(name) { return document.forms[name] }
    const AppConfig = {
        SOCKET_URL: "http://localhost:8080"
    }
    const Event = {
        CONNECT: 'connect',
        USER_IN: 'user_in',
        NEW_MESSAGE: 'new_message',
        CLICK: 'click'
    }

    const socket = io(AppConfig.SOCKET_URL)        
    socket.on(Event.CONNECT, function() {
        //socket.send('hi');
    })
    socket.on(Event.USER_IN, () => {
        console.log("se conectó un")
    })
    socket.on(Event.NEW_MESSAGE, data => {
        console.log(data);
        digest(data.body.feed.from,data.body.feed.msg);
    })
    function digest(user,msg) {
        let feed = eL('li');
        feed.innerHTML = `${user}: ${msg}`;
        jQ("chatfeed").appendChild(feed);
    }

    const Scene = {
        LOGIN: 'chatlogin',
        REGISTER: 'chatregister',
        CHATFEED: 'chatview',
        PROFILE: 'chatprofile'
    }

    window.onload = function() {
        
        jQ("buttonGoProfile").addEventListener(Event.CLICK, ()=>{
            jQ(Scene.CHATFEED).style.display = 'none';
            jQ(Scene.PROFILE).style.display = 'block';
            qS('#chatprofile .user').innerHTML = F('login').user.value;
        });

        jQ("buttonRegister").addEventListener(Event.CLICK, register);
        jQ("goLogin").addEventListener(Event.CLICK, goLogin);
        jQ("buttonChat").addEventListener(Event.CLICK, submitFeed);
        jQ("buttonEnter").addEventListener(Event.CLICK, login);
        jQ("buttonEditProfile").addEventListener(Event.CLICK, editProfile);

        function goLogin() {
            jQ(Scene.LOGIN).style.display = 'block';
            jQ(Scene.REGISTER).style.display = 'none';
        }
        function login(event) {
            event.preventDefault();
            let data = { user: F('login').user.value }
            fetch('http://localhost:8080/?login', {
                method: 'POST', body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`NOT OK: ${response.status}`);
                        return;
                    }
        
                    jQ(Scene.LOGIN).style.display = "none";
                    jQ(Scene.CHATFEED).style.display = "block";
        
                    response.json().then(function(data) {
                        console.log(data);
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error: ', err);
            });
        }
        function register(event) {
            event.preventDefault();
            let input = F('register');
            let data = { firstname: input.firstname.value,
                lastname: input.lastname.value,
                user: input.user.value,
                email: input.email.value
            }
            fetch('http://localhost:8080/?register', {
                method: 'POST', body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(
                function(response) {
                if (response.status !== 200) {
                    console.log('Error: ' +
                    response.status);
                    return;
                }

                jQ(Scene.REGISTER).style.display = "none";
                jQ(Scene.CHATFEED).style.display = "block";

                // Examine the text in the response
                response.json().then(function(data) {
                    console.log(data);
                });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error:', err);
            });
        }
        function editProfile(event) {
            event.preventDefault();
            let data = {
                user: F('login').user.value,
                firstname: F('profile').nombre.value,
                lastname: F('profile').apellido.value
            }
            fetch('http://localhost:8080/?profile', {
                method: 'POST', body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`NOT OK: ${response.status}`);
                        return;
                    }
        
                    jQ(Scene.PROFILE).style.display = "none";
                    jQ(Scene.CHATFEED).style.display = "block";
        
                    response.json().then(function(data) {
                        console.log(data);
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :', err);
            });
        }
        function submitFeed(event) {
            event.preventDefault();
            let user = F('login').user.value;
            let msg = F('messageform').message.value
            socket.emit("message",user,msg, function(data) {
                console.log(data);
            })
            digest(user,msg)
        }
    }