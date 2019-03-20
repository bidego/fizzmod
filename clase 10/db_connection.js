const http = require("http")
var mysql = require('mysql');
const fs = require("fs")

const port = 9000;
const Status = { OK: 200, E400: 400, E404: 404, E500: 500 }
const StatusMsg = { OK: "OK", E400: "Error", E404: "Invalid page", E500: "Internal server error" }

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty89",
  database: "chat_fizzmod"
});

const QUERY = {
    USERS: {
        STATUS: "SELECT u.nombre_de_usuario, s.description FROM usuarios u INNER JOIN estados_usuario s ON u.id_estado = s.id",
        ADD: function(name) {
            return `INSERT INTO usuarios (nombre_de_usuario) VALUES ('${name}')`;
        },
        EDIT: function(u,f,l) {
            return `UPDATE usuarios SET nombre,apellido VALUES ('${f}','${l}') WHERE nombre_de_usuario = '${u}'`;
        }
    },
    MESSAGES: {
        NEW: function(message,id_user) {
            return `INSERT INTO mensajes (cuerpo,id_usuario) VALUES ('${message}',${id_user})`;
        }
    }
}

const server = http.createServer( (req,res) => {
    let data = []
    req.on('data', chunk => {
        data.push(chunk)
    })
    req.on('end', ()=> {
        console.log(data);
        let actionStrategy = new Map();
        actionStrategy.set('create', QUERY.USERS.ADD.bind(this,parseValue(req),2));
    //    crud.set('read', QUERY.USERS.READ.bind("usuario"));
    //    crud.set('update', QUERY.USERS.UPDATE.bind("user","nombre","apellido"));
    //    crud.set('delete', QUERY.USERS.DELETE.bind("user"));    
        actionStrategy.set('feed', QUERY.MESSAGES.NEW.bind(this,parseValue(req),1));
        let u = req.hasOwnProperty("data") ? req.data.user : "";
        let f = req.hasOwnProperty("data") ? req.data.firstname : "";
        let l = req.hasOwnProperty("data") ? req.data.lastname : "";
        actionStrategy.set('profile', QUERY.USERS.EDIT.bind(this,u,f,l));
        let query = actionStrategy.get(parseModule(req))();

        console.log(query);
        con.query(query, (err,result,fields) => {
            if (err) {
                console.log(err)
                res.writeHead(Status.E400, StatusMsg.E400, { "content-type": "application/json"})
                res.end("Error");
            } else {
                //console.table(fields);
                //console.table(result);
                res.writeHead(Status.OK, StatusMsg.OK, { "content-type": "application/json"})
                res.end("Ok");
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
function parseModule(req) {
    let u = req.url.split("/")[1].split("=")[0];
    if(u.length>1 && u[0] =="?") {
        u = u.split("?")[1];
    }
    console.log(u)
    return u;
}
function parseValue(req) {
    return req.url.split("=")[1];
}
