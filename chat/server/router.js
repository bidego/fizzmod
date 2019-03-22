const fs = require('fs')
const { Status } = require('./enums/status-enum')

module.exports = async (req,res) => {
    let headers = {
        "content-type":"text/html",
        "Access-Control-Allow-Headers":"*",
        'Access-Control-Allow-Origin': '*'
    }
    function appJs() {
        let app = fs.createReadStream(__dirname+"/scripts/app.js");
        res.writeHead(Status.OK.code,headers)
        app.pipe(res);    
    }
    function indexHtml() {
        let index = fs.createReadStream(__dirname+"/views/index.html");
        res.writeHead(Status.OK.code,headers)
        index.pipe(res);    
    }
    let routes = new Map();
    routes.set('/app.js', appJs)
    routes.set('/index.html', indexHtml)
    routes.set('/', indexHtml)
    let route = routes.get(req.url)
    if (typeof route === 'function')
        route()
}
