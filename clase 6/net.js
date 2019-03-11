//NET : Sirve para ahcer servidores de conexion por TCP 
const net = require("net")
//En un servidor de TCP recibimos una instancia de net.Socket el cual implementa la interfaz de Stream Duplex, osea que podemos consumirlo y escribirlo

let sockets = []

const servidor = net.createServer(socket=>{
    //En un servidor TCP o HTTP SIEMPRE hay que cerrar la respuesta del cliente, de lo contrario el mismo queda en TimeOut 
    sockets.push(socket)

    socket.write("Estableciendo conexion...\n\r")
    socket.write("Bienvenido!\n\r")
    //socket.end("Hola Mundo")
    socket.on("data",data=>{
        
        let regex = /[\n\r]/
        //console.log("Consola Servidor : ",data)
        //socket.write("Conexion Telnet : ",data)
        //socket.write(data)
        if (regex.test(data)) {
            console.log("Enter!")
        }else{
            console.log(data)
        }
        /*
        for (let index = 0; index < sockets.length; index++) {
            const s = sockets[index]
            s.write(data)
        }*/

    })

})

servidor.listen(8000)