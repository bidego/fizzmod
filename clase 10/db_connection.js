const http = require("http")
var mysql = require('mysql');
const fs = require("fs")

const port = 8000;
const Status = { OK: 200, E404: 404, E500: 500 }
const StatusMsg = { OK: "OK", E404: "Invalid page", E500: "Internal server error" }

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_fizzmod"
});

const QUERY = {
    USERS: {
        STATUS: "SELECT u.name, s.description FROM users u INNER JOIN statuses s ON u.id_status = s.id",
        ADD: function(name,id_country) {
            return `INSERT INTO users (name,id_country) VALUES (${name},${id_country})`;
        }
    }
}

const server = http.createServer( (req,res) => {
    con.query(QUERY.USERS.STATUS, (err,result,fields) => {
        if (err) {
            res.writeHead(400, {"conent-type":"text/plain"});
            res.end("Error");
        } else {
            console.table(fields);
            console.table(result);
        }
        fs.readFile(`${__dirname}/index.html`,(err,data)=>{
            if (err) {
                console.error(err);
                res.writeHead(Status.E500, StatusMsg.E500)
            } else {
                res.writeHead(Status.OK, StatusMsg.OK, { "content-type": "text/html"})
                res.end(data)
            }
        })
    })
})

con.connect(function(err) {
  if (err) throw err;
  console.log("DB online");
  server.listen(port, () => {
    console.log("Server online");
  })
});
