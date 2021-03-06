const http = require("http")
var mysql = require('mysql')
const port = 9000;
const Status = { OK: 200, E400: 400, E404: 404, E500: 500 }
const StatusMsg = { OK: "OK", E400: "Error", E404: "Invalid page", E500: "Internal server error" }
const { QUERY, ConfigDB } = require("./")

const con = mysql.createConnection(ConfigDB.CONNECTION);

const server = http.createServer( (req,res) => {
    let data = []
    req.on('data', chunk => {
        data.push(chunk)
    })
    req.on('end', ()=> {
        let r = {}
        try {
            r = JSON.parse(data.toString('utf8'));
        } catch (e) {
            console.log(e)
        }

        r = preventSQLInjection(r);

        let serviceStrategy = new Map();
        serviceStrategy.set('register', QUERY.USERS.ADD.bind(this,r.user,r.firstname,r.lastname,r.email,2));
        serviceStrategy.set('login', QUERY.login.bind(this,r.user,r.email));
        serviceStrategy.set('connect', QUERY.connect.bind(this,r.id));
        serviceStrategy.set('disconnect', QUERY.disconnect.bind(this,r.id));
        serviceStrategy.set('feed', QUERY.MESSAGES.NEW.bind(this,r.id_user,r.message,1));
        serviceStrategy.set('profile', QUERY.USERS.GET.bind(this,r.id_user));
        serviceStrategy.set('editProfile', QUERY.USERS.EDIT.bind(this,r.user,r.firstname,r.lastname));
        serviceStrategy.set('userlist', QUERY.getUsers.bind(this,r.all));
        let query = serviceStrategy.get(getSecuredRoute(req))();
        
        con.query(query, (err,result,fields) => {
            console.log(query);
            if (err) {
                console.log(err)
                res.writeHead(Status.E400, StatusMsg.E400, { "content-type": "application/json"})
                res.end("Error");
            } else {
                console.table(result);
                res.writeHead(Status.OK, StatusMsg.OK, { "content-type": "application/json"})
                res.end(JSON.stringify(result));
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
function getSecuredRoute(req) {
    let u = req.url.split("/")[1].split("=")[0];
    if(u.length>1 && u[0] =="?") {
        u = u.split("?")[1];
    }
    return u;
}
function preventSQLInjection(r) {
    Object.keys(r).forEach( e => {
        if (typeof r[e] === 'string') {
            r[e] = r[e].replace(/['"]/g,"");
            console.log(r[e])
        }
    })
    return r;
}