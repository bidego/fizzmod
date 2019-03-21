// npm install --save socket.io socket.io-client
const http = require('http');

const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)
const fs = require('fs')

function serverHandler(req,res) {

    middServices(req,res)
    // End MIDD
    
    let archivo = fs.createReadStream(__dirname+"/index-ws.html");
    res.writeHead(200,{
        "content-type":"text/html",
        "Access-Control-Allow-Headers":"*",
        'Access-Control-Allow-Origin': '*'
    })
    archivo.pipe(res);

}
io.on("connection", socket => {
    socket.broadcast.emit("user_in", {status:"ok", payload:"Alguien se unio"});
    
    socket.on("login", (name,msg) => {
        socket.broadcast.emit("new_message", {status:"ok",
            body: {
                feed: {
                    from: name,
                    msg: msg
                }
            }
        });
    })

    socket.on("message", (name,msg) => {
        socket.broadcast.emit("new_message", {status:"ok",
            body: {
                feed: {
                    from: name,
                    msg: msg
                }
            }
        });
        let options = {
            host: 'localhost',
            port: 9000,
            path: '/?feed',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
        };
    
        let httpreq = http.request(options, function (response) {
            response.setEncoding('utf8');
            try {
                response.on('data', function (chunk) {
                    console.log("body: " + chunk);
                });
            } catch(e) {
                throw new Error(e);
            }
        });
        httpreq.end(JSON.stringify({ id_user: name, message: msg}));
    })
})

function parseModule(req) {
    let url = req.url.split("=")[0];
    return url.substr(2,url.length);
}

const middServices =
    (req,res) => {
        let data = [];
        req.on("data", chunk => {
            data.push(chunk);
        })
        req.on("end", () => {
            let body = {}
            try {
                body = JSON.parse(data.toString('utf8'));
            } catch(e) {
                console.error(e)
            }
            let router = new Map();
            router.set('register',register);
            router.set('login',login);
            router.set('profile',profile);
            
            let url = parseModule(req);
            let route = router.get(url);
            if (typeof route === 'function') {
                route(req);
            }
            function login(){
                let dataEncoded = JSON.stringify({
                    user: body.user
                })
                let options = {
                    host: 'localhost',
                    port: 9000,
                    path: '/?login',
                    method: 'POST',
                    headers: {
                        'Content-Length': dataEncoded.length,
                        'Content-Type': 'application/json',
                    }
                };
            
                let httpreq = http.request(options,  res => {
                    let buffers = [];
                    let reject = (err) => {
                        console.error(err); 
                    }
                    let resolve = (data) => {
                        console.log(data);
                    }
                    res.on('error', reject);
                    res.on('data', buffer => buffers.push(buffer));
                    res.on('end',
                        () =>
                            res.statusCode === 200
                            ? resolve(Buffer.concat(buffers))
                            : reject(Buffer.concat(buffers))
                        );
                    }
                );
                console.log("sending to db: " +dataEncoded)
                httpreq.write(dataEncoded);
                httpreq.end();
            }
            function register(){
                let dto = JSON.stringify({
                    user: body.user,
                    firstname:body.firstname,
                    lastname: body.lastname,
                    email: body.email
                })
                let options = {
                    host: 'localhost',
                    port: 9000,
                    path: '/?register',
                    method: 'POST',
                    headers: {
                        'Content-Length': dto.length,
                        'Content-Type': 'application/json',
                    }
                };
            
                let httpreq = http.request(options,  res => {
                    let buffers = [];
                    let reject = (err) => {
                        console.error(err); 
                    }
                    let resolve = (data) => {
                        console.log(data);
                    }
                    res.on('error', reject);
                    res.on('data', buffer => buffers.push(buffer));
                    res.on('end',
                        () =>
                            res.statusCode === 200
                            ? resolve(Buffer.concat(buffers))
                            : reject(Buffer.concat(buffers))
                        );
                    }
                );
                console.log("sending to dao: " +dto)
                httpreq.write(dto);
                httpreq.end();
            }
            function profile(){
                let dataEncoded = JSON.stringify(body)
                let options = {
                    host: 'localhost',
                    port: 9000,
                    path: '/profile',
                    method: 'POST',
                    headers: {
                        'Content-Length': dataEncoded.length,
                        'Content-Type': 'application/json'
                    }
                };
                
                let httpreq = http.request(options,  res => {
                    let buffers = [];
                    let reject = (err) => {
                        console.error(err); 
                    }
                    let resolve = (data) => {
                        console.log(data);
                    }
                    res.on('error', reject);
                    res.on('data', buffer => buffers.push(buffer));
                    res.on('end',
                        () =>
                            res.statusCode === 200
                            ? resolve(Buffer.concat(buffers))
                            : reject(Buffer.concat(buffers))
                        );
                    }
                );
                httpreq.write(dataEncoded);
                httpreq.end();
            }
        })

    }
    
server.listen(8080)