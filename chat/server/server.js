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

io.on(Evt.CONNECTION, socket => {

    let headers = (name,msg) => {
        return {status:Status.OK.message,
            body: {
                feed: {
                    from: name,
                    msg: msg
                }
            }
        }
    }

    socket.broadcast.emit(Evt.USER_IN, {status:"ok", payload:"Alguien se unio"});
    
    socket.on(Evt.LOGIN, (name,msg) => {
        socket.broadcast.emit(Evt.NEW_MESSAGE, headers(name,msg));
    })

    socket.on(Evt.MESSAGE, (name,msg) => {
        socket.broadcast.emit(Evt.NEW_MESSAGE, headers(name,msg));
    
        let httpreq = HttpService.feed(null, function (response) {
            response.setEncoding('utf8');
            response.on(Evt.DATA, function (chunk) {
                console.log("body: " + chunk);
            });
        });
        httpreq.end(JSON.stringify({ id_user: name, message: msg}));
    })
})

server.listen(8080)