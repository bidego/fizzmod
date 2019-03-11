const http = require("http")

const port = 8000;

const server = http.createServer( (req,res) => {
    res.write("Hola")
    res.write("Mundo")
    res.end("!")
})
console.log("http listening in port 8000")
server.listen(port);
