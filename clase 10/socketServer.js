// npm install --save socket.io socket.io-client
const http = require('http');

const server = require('http').createServer(serverHandler)
const io = require('socket.io')(server)
const fs = require('fs')

function serverHandler(req,res) {

    // Start MIDDLEWARE o PROXIES (ejemplo .use de express)
    ((req,res) => {
        let router = new Map();
        router.set('login',login);
        router.set('profile',profile);
        
        let url = parseModule(req);
        let route = router.get(url);
        if (typeof route === 'function') {
            route(req);
        }
        function login(req){
            let u = req.url;
            let usr = u.split("=")[1]

            let options = {
                host: 'localhost',
                port: 9000,
                path: '/?create='+usr,
                method: 'GET',
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
                    httpreq.end("end");
                } catch(e) {
                    throw new Error(e);
                }
            });
            httpreq.end();
            console.log(usr)
        }
        function profile(req){
            let u = req.url;
            let params = u.split("=")[1]
            let usr = params.split("%%")[0];
            let nom = params.split("%%")[1];
            let ape = params.split("%%")[2]
            let dataEncoded = JSON.stringify({
                user: usr, firstname: nom, lastname: ape
            })
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
            console.log(usr)
        }

    })(req,res)
    // End MIDD
    
    let archivo = fs.createReadStream(__dirname+"/index-ws.html");
    res.writeHead(200, {"content-type":"text/html"})
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
            path: '/?feed='+msg,
            method: 'GET',
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
                httpreq.end("end");
            } catch(e) {
                throw new Error(e);
            }
        });
        httpreq.end();
    })
})

function parseModule(req) {
    let url = req.url.split("=")[0];
    return url.substr(2,url.length);
}

server.listen(8080)