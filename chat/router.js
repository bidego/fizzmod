
module.exports = async (req,res) => {
    function appJs() {
        let app = fs.createReadStream(__dirname+"/app.js");
        res.writeHead(Status.OK.code,{
            "content-type":"application/javascript",
            "Access-Control-Allow-Headers":"*",
            'Access-Control-Allow-Origin': '*'
        })
        app.pipe(res);    
    }
    function indexHtml() {
        let index = fs.createReadStream(__dirname+"/index-ws.html");
        res.writeHead(Status.OK.code,{
            "content-type":"text/html",
            "Access-Control-Allow-Headers":"*",
            'Access-Control-Allow-Origin': '*'
        })
        index.pipe(res);    
    }
    let routes = new Map();
    routes.set('/app.js', appJs)
    routes.set('/index-ws.js', indexHtml)
    routes.set('/', indexHtml)
    let route = routes.get(req.url)
    if (typeof route === 'function')
        route()
}
