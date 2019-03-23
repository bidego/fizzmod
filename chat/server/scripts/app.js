window.onload = function() {
    if (typeof fetch !== 'function') alert("Navegador incompatible");

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
    socket.on(Event.USER_IN, function() {
        console.log("se conectó un")
    })
    socket.on(Event.NEW_MESSAGE, function(data) {
        digest(data.body.feed);
    })

    const digest = function(data) {
        let { userId, username, msg } = data;
        let feed = eL('li');
        feed.innerHTML = username +": "+ msg;
        feed.style.paddingRight = '20px';
        if (username.match(localStorage.getItem('username'))) {
            feed.className = 'user';
        } else {
            feed.className = 'nouser';
        }
        jQ("chatfeed").appendChild(feed);
    }

    const Scene = {
        LOGIN: 'chatlogin',
        REGISTER: 'chatregister',
        CHATFEED: 'chatview',
        PROFILE: 'chatprofile'
    }

    
    jQ("buttonGoProfile").addEventListener(Event.CLICK, function(){
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
                    console.log("NOT OK: "+response.status);
                    return;
                }
                response.json().then((data)=>{
                    if (data.user.length > 0) {
                        jQ(Scene.LOGIN).style.display = "none";
                        jQ(Scene.CHATFEED).style.display = "block";
                        localStorage.setItem("userId",data.user[0].id)
                        localStorage.setItem("username",data.user[0].nombre_de_usuario)
                    }                    
                })    
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
                response.json().then(function(r) {
                    jQ(Scene.REGISTER).style.display = "none";
                    jQ(Scene.CHATFEED).style.display = "block";
                    localStorage.setItem('userId',r.insertId)
                    localStorage.setItem('username',data.user)
                    F('login').user.value = data.user;
                    F('login').email.value = data.email;
                    F('profile').firstname.value = data.firstname;
                    F('profile').lastname.value = data.lastname;
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
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
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
                    console.log("NOT OK: "+response.status);
                    return;
                }
                console.log("rta: " + response.body.length)
                if (response.body.length > 0) {
                    jQ(Scene.PROFILE).style.display = "none";
                    jQ(Scene.CHATFEED).style.display = "block";
                }
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
        let userId = localStorage.getItem('userId');
        let username = localStorage.getItem('username');
        let msg = F('messageform').message.value
        socket.emit("message",userId,username,msg, function(data) {
            console.log(data);
        })
        digest({ userId: userId, username: username, msg: msg})
    }
}