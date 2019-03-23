'use strict';

const http = require("http")
const fs = require("fs")

const port = 8000;

const Status = { OK: 200, E404: 404, E500: 500 }
const StatusMsg = { OK: "OK", E404: "Invalid page", E500: "Internal server error" }

const client = http.createServer( (req,res) => {
    //res.write("Hola")
    //res.write("Mundo")
    //res.end("!")
    /*
        Content-Type

        - CLIENTE > SERVIDOR
            multipart/formdata
            application/x-www-url-encoded (method get)

        - SERVIDOR > CLIENTE
            text/html text/plai, text/css
            application/json
            application/javascript
            image/jpeg
            image/gif
            image/png
            image/svg+xml
            video/mp4
            video/webm
            audio/mp3
            audio/ogg
    */

    // Status code default: 200
    //res.statusCode = 200
    //res.setHeader("content-type", "text/html")    

    //res.writeHead(Status.OK, StatusMsg.OK, { "content-type":"text/html" })
    //res.end("<span style='font-size:2em; color:#f00'>go go go!</span>")

    /*
    fs.readFile(`${__dirname}/index.html`,(err,data)=>{
        if (err) {
            console.error(err);
            res.writeHead(Status.E500, StatusMsg.E500)
        } else {
            res.writeHead(Status.OK, StatusMsg.OK, { "content-type": "text/html"})
            res.end(data)
        }
    })
    */
    fs.readFile(`${__dirname}/pexels-videos-1720234.mp4`, (err,data) => {
        if (err) {
            console.error(err);
            res.writeHead(Status.E500, StatusMsg.E500)
        } else {
            res.writeHead(Status.OK, StatusMsg.OK, { "content-type": "video/mp4"})
            res.end(data)
        }
    })

})

client.on("error", () => {})

console.log(`http listening in port ${port}`)
client.listen(port);
