const fs = require('fs')
const { Status } = require('./enums/status-enum')
const { ContentType } = require('./enums/content-type-enum')

module.exports = async (req,res) => {
    
    let headers = (type) => { return {
            "content-type":type,
            "Access-Control-Allow-Headers":"*",
            'Access-Control-Allow-Origin': '*'
        }
    }

    function fetchFile(r) {
        let file = fs.createReadStream(__dirname + "/" + r.path);
        res.writeHead(Status.OK.code,headers(r.type))
        file.pipe(res);    
    }
    let routes = new Map();
    routes.set('/app.js', { path: "scripts/app.js", type: ContentType.JS })
    routes.set('/styles.css', { path: "views/styles.css", type: ContentType.CSS })
    routes.set('/index.html', { path: "views/index.html", type: ContentType.HTML })
    routes.set('/', { path: "views/index.html", type: ContentType.HTML })
    
    let route = routes.get(req.url)
    if (typeof route === 'object')
        fetchFile(route)
    else {
        res.writeHead(Status.NO_PAGE.code, Status.NO_PAGE.message)
        res.end("no file")
    }
}
