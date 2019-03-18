'use strict';

const http = require("http")
const fs = require("fs")

const port = 9000;

const Status = { OK: 200, E404: 404, E500: 500 }
const StatusMsg = { OK: "OK", E404: "Invalid page", E500: "Internal server error" }

const server = http.createServer( (req,res) => {
    let archivo = fs.createReadStream(`${__dirname}/pexels-videos-1720234.mp4`)
    res.writeHead(Status.OK, StatusMsg.OK, { "content-type": "video/mp4"})
    archivo.pipe(res)
})

server.on("error", () => {})

console.log(`http listening in port ${port}`)
server.listen(port);
