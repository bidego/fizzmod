const { Status, Evt } = require('../enums/')
class MessageModel {
    constructor(Model) {
        this.userId = Model.userId;
        this.username = Model.username;
        this.message = Model.message;
    }
}
class ClientModel {
    constructor(userId, username){
        this.userId = userId;
        this.username = username;
    }
}
module.exports = function(io,console) {
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

        socket.on(Evt.NEW_OSC, (data) => {
            console.log(data);
            socket.broadcast.emit(Evt.NOTIFY_OSC, {
                status: Status.OK.message,
                body: {
                    feed: { data }
                }
            });
            
            /* DB REST COMM
            const { HttpService } = require('../')
            let httpreq = HttpService.feed(null, function (response) {
                response.setEncoding('utf8');
                response.on(Evt.DATA, function (chunk) {
                    console.log("body: " + chunk);
                });
            });
            httpreq.end(JSON.stringify({ id_user: userId, message: msg}));
            */
        })

        socket.on(Evt.OSC_CHANGE, (data) => {
            socket.broadcast.emit(Evt.NOTIFY_OSC_CHANGE, {
                status: Status.OK.message,
                body: {
                    feed: { data }
                }
            });
        });

        socket.on(Evt.KEY_EVENT, (data) => {
            console.log(data)
            socket.broadcast.emit(Evt.NOTIFY_KEY_EVENT, {
                status: Status.OK.message,
                data: data
            });
        });

        socket.on(Evt.MESSAGE, (data) => {
            let {userId,username,message:msg} = new MessageModel(data)
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