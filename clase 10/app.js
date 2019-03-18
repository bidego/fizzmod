const net = require("net");

let port = 8000;

let socketsMap = new Map();
let sockets = [];


// socket es DUPLEX
const servidor = net.createServer(socket=>{
    let { localAddress, localPort, remoteAddress, remotePort } = socket;
    socket.id = `Socket_${(Math.random()*1000).toFixed(0)}`
    sockets.push(socket)

    socket.write("Se contectó alguien\n\r")
    socket.on("data",data=>{
        let regex = /[\n\r]/
        if (regex.test(data)) {
            console.log(`${socket.id} entered`);
            console.log(`Local: ${localAddress}:${localPort}`);
            console.log(`Remote: ${remoteAddress}:${remotePort}`);
        } else {
            console.log(data)
        }

    })
    let buffer = []
    socket.on("data", data => {
        buffer.push(data);
        if (data == "enter") {
            buffer = Buffer.concat(buffer);
        }
    })
    socket.on("error",data=>{
        let regex = /[\n\r]/

        if (regex.test(data)) {
            console.log("Error!")
        } else {
            console.log(data)
        }

    })

})

servidor.listen(port)