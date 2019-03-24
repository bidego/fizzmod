module.exports = function(req,res) {
    const { HttpService } = require('../');
    const { Status, Evt } = require('../enums/')

    let data = [];
    req.on(Evt.DATA, chunk => {
        data.push(chunk);
    })
    req.on(Evt.END, () => {
        let body = {}
        if (req.method == 'POST') {
            try {
                body = JSON.parse(data.toString('utf8'));
            } catch(e) {
                console.error(e)
            }
        }
        let router = new Map();
        router.set('register',register);
        router.set('login',login);
        router.set('profile',profile);
        
        let url = parseRoute(req);
        let route = router.get(url);
        if (typeof route === 'function') {
            route(req);
        }
        function login(){
            let dataEncoded = JSON.stringify({
                user: body.user
            })
        
            let httpreq = HttpService.login(dataEncoded,  function(r) {
                let buffers = [];
                let reject = (err) => {
                    console.error(`${r.statusCode}: ${data.toString('utf8')}`);
                    res.writeHead(Status.ERROR.code, { "content-type": "application/json"})
                    res.end(err) 
                }
                r.on(Evt.ERROR, reject);
                r.on(Evt.DATA, buffer => buffers.push(buffer));
                r.on(Evt.END,
                    () =>
                        r.statusCode === Status.OK.code
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
            let httpreq = HttpService.register(dto,function(r) {
                let buffers = [];
                let reject = (err) => {
                    console.error(`${r.statusCode}: ${r.statusMessage}`);
                    res.writeHead(r.statusCode, { "content-type": "application/json"})
                    res.end(err)
                }
                r.on(Evt.ERROR, reject);
                r.on(Evt.DATA, buffer => buffers.push(buffer));
                r.on(Evt.END,
                    () =>
                        r.statusCode === Status.OK.code
                        ? resolve(Buffer.concat(buffers))
                        : reject(Buffer.concat(buffers))
                    );
                }
            );
            console.log("sending to dao: " +dto)
            httpreq.write(dto)
            httpreq.end();
        }
        function profile(){
            let dataEncoded = JSON.stringify(body)

            let httpreq = HttpService.profile(dataEncoded,function(r) {
                let buffers = [];
                let reject = (err) => {
                    console.error(err); 
                }
                r.on(Evt.ERROR, reject);
                r.on(Evt.DATA, buffer => buffers.push(buffer));
                r.on(Evt.END,
                    () =>
                        r.statusCode === 200
                        ? resolve(Buffer.concat(buffers))
                        : reject(Buffer.concat(buffers))
                    );
                }
            );
            httpreq.write(dataEncoded)
            httpreq.end();
        }
        function resolve(data) {
            console.log(`${Status.OK.code}: ${data.toString('utf8')}`);
            res.writeHead(Status.OK.code, { "content-type": "application/json"})
            res.end( JSON.stringify({ body: JSON.parse(data.toString('utf8')) }) )
        }
    })

}

function parseRoute(req) {
    let url = req.url.split("=")[0];
    return url.substr(2,url.length);
}