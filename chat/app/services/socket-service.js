module.exports = function(io) {
    const { Status, Evt } = require('../enums/')
    const { HttpService } = require('../')
    let clients = []
    io.on(Evt.CONNECTION, socket => {
        clients.push(socket)
        let headers = (userId,username,msg) => {
            return {status:Status.OK.message,
                body: {
                    feed: {
                        userId: userId,
                        username: username,
                        msg: msg
                    }
                }
            }
        }

        socket.on(Evt.DISCONNECT, function() {
            let i = clients.indexOf(socket);
            clients.splice(i, 1);
            console.log("sockets: " +clients.length)
        })

        socket.broadcast.emit(Evt.USER_IN, {status:"ok", payload:"Alguien se unio"});
        
        socket.on(Evt.LOGIN, (userId,username,msg) => {
            socket.broadcast.emit(Evt.NEW_MESSAGE, headers(userId,username,msg));
        })

        socket.on(Evt.MESSAGE, (userId,username,msg) => {
            socket.broadcast.emit(Evt.NEW_MESSAGE, headers(userId,username,msg));
        
            let httpreq = HttpService.feed(null, function (response) {
                response.setEncoding('utf8');
                response.on(Evt.DATA, function (chunk) {
                    console.log("body: " + chunk);
                });
            });
            httpreq.end(JSON.stringify({ id_user: userId, message: msg}));
        })
    })
}