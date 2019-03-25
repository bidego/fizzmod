const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)
const {
    Config, SocketService,
    MiddService: middServices,
    RouterService: routerService
} = require('./')

function serverHandler(req,res) {
    routerService(req,res)
    middServices(req,res,io)
}
SocketService(io)
server.listen(Config.APP.port)