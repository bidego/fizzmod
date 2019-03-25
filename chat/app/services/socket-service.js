const { Status, Evt } = require('../enums/')
module.exports = function(io) {
    let clients = []
    io.on(Evt.CONNECTION, socket => {
        clients.push(socket)

        socket.on(Evt.DISCONNECT, function() {
            let i = clients.indexOf(socket);
            let cli = clients.splice(i, 1)[0];
            const { HttpService } = require('../')
            
            if (cli.data) {
                let httpreq = HttpService.disconnect(JSON.stringify({id: cli.data}),function(data) {
                    console.log(data)
                    socket.broadcast.emit(Evt.NOTIFY_USER_LIST, { status: Status.OK.code, body: { notify: true }});
                })
                httpreq.end(JSON.stringify({id: cli.data}));
            }
            console.log("sockets: " +clients.length)
        })

        socket.broadcast.emit(Evt.USER_IN, {status:"ok", payload:"Alguien se unio"});
        
        socket.on(Evt.LOGIN, function(data) {
            let i = clients.indexOf(socket);
            let cli = clients.splice(i, 1)[0];
            cli.data = data;
            clients.push(cli);
            socket.broadcast.emit(Evt.NOTIFY_USER_LIST, { status: Status.OK.code, body: { notify: true }});
        })

        socket.on(Evt.MESSAGE, (userId,username,msg) => {
            const { HttpService } = require('../')
            socket.broadcast.emit(Evt.NEW_MESSAGE, buildMessage(userId,username,msg));
        
            let httpreq = HttpService.feed(null, function (response) {
                response.setEncoding('utf8');
                response.on(Evt.DATA, function (chunk) {
                    console.log("body: " + chunk);
                });
            });
            httpreq.end(JSON.stringify({ id_user: userId, message: msg}));
        })
    })
    const buildMessage = (userId,username,msg) => {
        return {
            status: Status.OK.message,
            body: {
                feed: { userId: userId, username: username, msg: msg }
            }
        }
    }
}