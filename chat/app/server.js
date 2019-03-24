const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)
const {
    Config, SocketService,
    MiddService: middServices,
    RouterService: routerService
} = require('./')

async function serverHandler(req,res) {
    routerService(req,res)
    middServices(req,res)
}
SocketService(io)
server.listen(Config.APP.port)