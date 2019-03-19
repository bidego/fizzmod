// npm install --save socket.io socket.io-client
const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)
const fs = require('fs')

function serverHandler(req,res) {

    // Start MIDDLEWARE o PROXIES (ejemplo .use de express)
    
    // End MIDD
    
    setImmediate(()=>{
        let archivo = fs.createReadStream(__dirname+"/index-ws.html");
        res.writeHead(200, {"content-type":"text/html"})
        archivo.pipe(res);
    });
}
io.on("connection", socket => {
    socket.emit("nueva_conexion", {status:"ok", payload:"Conectado!"});
    socket.broadcast.emit("broadcast",{status:"ok", payload: "Conectose alguien"})
})
server.listen(8080)