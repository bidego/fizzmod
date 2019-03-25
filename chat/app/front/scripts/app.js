window.onload = function() {
    if (typeof fetch !== 'function') alert("Navegador incompatible");

    const jQ = function(id) { return document.getElementById(id) }
    const qS = function(q,all) { return all ? document.querySelectorAll(q) : document.querySelector(q) }
    const eL = function(el) { return document.createElement(el) }
    const F = function(name) { return document.forms[name] }
    const AppConfig = {
        SOCKET_URL: "http://localhost:8080"
    }
    const Event = {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        USER_IN: 'user_in',
        NEW_MESSAGE: 'new_message',
        CLICK: 'click',
        NOTIFY_USER_LIST: 'notify_user_list'
    }

    const socket = io(AppConfig.SOCKET_URL)        

    initialize()

    socket.on(Event.CONNECT, function() {
        //socket.send('hi');
    })
    socket.on(Event.DISCONNECT, function() {
        let userId = localStorage.getItem('userId');
        let username = localStorage.getItem('username');
        let msg = F('messageform').message.value
        socket.emit("message",userId,username,msg, function(data) {
            console.log(data);
        })
    })
    socket.on(Event.USER_IN, function(data) {
        console.log("se conectó un")
    })

    socket.on(Event.NOTIFY_USER_LIST, function(data) {
        if ( data.body.notify ) buildList();
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
        jQ("feedwindow").scroll({top:jQ("feedwindow").scrollHeight, left:0,behavior: 'smooth' })

    }

    const Scene = {
        LOGIN: 'chatlogin',
        REGISTER: 'chatregister',
        CHATFEED: 'chatview',
        PROFILE: 'chatprofile',
        USERLIST: 'userlist'
    }

    
    qS(".go-profile",true).forEach(e => e.addEventListener(Event.CLICK, function(){
        jQ(Scene.CHATFEED).style.display = 'none';
        jQ(Scene.USERLIST).style.display = 'none';
        jQ(Scene.PROFILE).style.display = 'block';
        qS('#chatprofile .user').innerHTML = F('login').user.value;
    }));

    qS(".go-userlist",true).forEach(e => e.addEventListener(Event.CLICK, function(){
        jQ(Scene.CHATFEED).style.display = 'none';
        jQ(Scene.PROFILE).style.display = 'none';
        jQ(Scene.USERLIST).style.display = 'block';

        buildList();
    }));

    function buildList() {
        jQ('contacts').innerHTML = "";
        let req = {}

        fetch('http://localhost:8080/?userlist', {
            method: 'POST', body: JSON.stringify(req),
            headers:{ 'Content-Type': 'application/json' }
        })
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log("NOT OK: "+response.status);
                    return;
                }
                response.json().then((data)=>{
                    if (data.body.length > 0) {
                        let userlist = data.body;
                        for (let user of userlist) {
                            let li = eL('li');
                            let { nombre_de_usuario: username, estado } = user;
                            li.innerHTML = username;
                            li.className = estado;
                            jQ("contacts").appendChild(li);
                        }
                    }                    
                })    
            }
        )
        .catch(function(err) {
            console.log('Fetch Error: ', err);
        });
}

    jQ("buttonRegister").addEventListener(Event.CLICK, register);
    jQ("buttonChat").addEventListener(Event.CLICK, submitFeed);
    jQ("buttonEnter").addEventListener(Event.CLICK, login);
    jQ("buttonEditProfile").addEventListener(Event.CLICK, editProfile);
    qS(".go-login",true).forEach( e => e.addEventListener(Event.CLICK, goLogin) );
    qS(".go-chat",true).forEach( e => e.addEventListener(Event.CLICK, goChat) );
    qS(".go-register",true).forEach(e => e.addEventListener(Event.CLICK, goRegister));

    function goChat() {
        jQ(Scene.LOGIN).style.display = "none";
        jQ(Scene.PROFILE).style.display = "none";
        jQ(Scene.USERLIST).style.display = "none";
        jQ(Scene.CHATFEED).style.display = "block";
    }
    function goRegister() {
        jQ(Scene.LOGIN).style.display = 'none';
        jQ(Scene.REGISTER).style.display = 'block';
    }

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
                    if (data.body.length > 0) {
                        let { id: userId, nombre_de_usuario: username } = data.body[0];
                        localStorage.setItem("userId",userId)
                        localStorage.setItem("username",username)
                        goChat();
                        socket.emit("login",userId,username, function(data) {
                            console.log(data);
                        })
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
                    localStorage.setItem('userId',r.body.insertId)
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
            user: localStorage.getItem('username'),
            firstname: F('profile').firstname.value,
            lastname: F('profile').lastname.value
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
                response.json().then(function(data) {
                    if (data.body && data.body.affectedRows > 0) {
                        goChat();
                    }
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

    function initialize() {
        jQ('chatregister').style.display = 'block';
    }
}