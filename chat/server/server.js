const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)

const HttpService = require('./services/http-service')
const middServices = require('./services/midd-service')
const routerService = require('./router')
const { Status } = require('./enums/status-enum')

async function serverHandler(req,res) {
    routerService(req,res)
    middServices(req,res)
}

io.on("connection", socket => {
    socket.broadcast.emit("user_in", {status:"ok", payload:"Alguien se unio"});
    
    socket.on("login", (name,msg) => {
        socket.broadcast.emit("new_message", {status:Status.OK.message,
            body: {
                feed: {
                    from: name,
                    msg: msg
                }
            }
        });
    })

    socket.on("message", (name,msg) => {
        socket.broadcast.emit("new_message", {status:Status.OK.message,
            body: {
                feed: {
                    from: name,
                    msg: msg
                }
            }
        });
    
        let httpreq = HttpService.feed(null, function (response) {
            response.setEncoding('utf8');
            try {
                response.on('data', function (chunk) {
                    console.log("body: " + chunk);
                });
            } catch(e) {
                throw new Error(e);
            }
        });
        httpreq.end(JSON.stringify({ id_user: name, message: msg}));
    })
})

server.listen(8080)