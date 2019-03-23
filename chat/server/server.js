const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)

const HttpService = require('./services/http-service')
const middServices = require('./services/midd-service')
const routerService = require('./router')
const { Status } = require('./enums/status-enum')
const { Evt } = require('./enums/events-enum')

async function serverHandler(req,res) {
    routerService(req,res)
    middServices(req,res)
}
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

server.listen(8080)