const { Status, Evt } = require('../enums/')
module.exports = function(req,res,io) {
    
    let data = [];
    req.on(Evt.DATA, chunk => {
        data.push(chunk);
    })
    req.on(Evt.END, () => {
        const { HttpService } = require('../');
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
        router.set('userlist',userlist);
        
        let url = parseRoute(req);
        let route = router.get(url);
        if (typeof route === 'function') {
            route(req);
        }
        function login(){
            let dataEncoded = JSON.stringify({
                user: body.user,
                email: body.email
            })
        
            let httpreq = HttpService.login(dataEncoded,loginOK);
            console.log("sending to db: " +dataEncoded)
            httpreq.write(dataEncoded);
            httpreq.end();
        }
        function loginOK(r) {
            let buffers = [];
            let reject = (err) => {
                console.error(err); 
            }
            let resolve = function(data) {
                let body = JSON.parse(data.toString('utf8'));
                if (body.length > 0) {
                    let httpreq = HttpService.connect(JSON.stringify({id: body[0].id}),callback);
                    httpreq.write(JSON.stringify({id: body[0].id}));
                    httpreq.end();
                    res.writeHead(Status.OK.code, { "content-type": "application/json"})
                    res.end( JSON.stringify({ body: JSON.parse(data.toString('utf8')) }) )
                }
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

        function register(){
            let dto = JSON.stringify({
                user: body.user,
                firstname:body.firstname,
                lastname: body.lastname,
                email: body.email
            })
            let httpreq = HttpService.register(dto,callback);
            console.log("sending to dao: " +dto)
            httpreq.write(dto)
            httpreq.end();
        }
        function profile(){
            let dataEncoded = JSON.stringify(body)
            if (body.firstname) {
                let httpreq = HttpService.editProfile(dataEncoded,callback);   
                httpreq.write(dataEncoded)
                httpreq.end();
            } else {
                let httpreq = HttpService.profile(dataEncoded,callback);   
                httpreq.write(dataEncoded)
                httpreq.end();
            }
        }
        function userlist(){
            let dataEncoded = JSON.stringify(body)
            let httpreq = HttpService.userlist(dataEncoded,callback);
            httpreq.write(dataEncoded)
            httpreq.end();
        }
        function resolve(data) {
            console.log(`${Status.OK.code}: ${data.toString('utf8')}`);
            res.writeHead(Status.OK.code, { "content-type": "application/json"})
            res.end( JSON.stringify({ body: JSON.parse(data.toString('utf8')) }) )
        }


        function callback(r) {
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

        function parseRoute(req) {
            let url = req.url.split("=")[0];
            return url.substr(2,url.length);
        }
    })
}