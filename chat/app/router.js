const fs = require('fs')
const { ContentType, Status } = require('./enums/')
const { Endpoints } = require('./endpoints')

module.exports = (req,res) => {    
    let headers = (type) => { return {
            "content-type":type,
            "Access-Control-Allow-Headers":"*",
            'Access-Control-Allow-Origin': '*'
        }
    }

    function fetchFile(r) {
        let file = fs.createReadStream(__dirname + "/front/" + r.path);
        res.writeHead(Status.OK.code,headers(r.type))
        file.pipe(res);    
    }

    function renderHtml(Route) {
        fs.readFile(__dirname + '/front/' + Route.path, 'utf8', async function(err, html){
            let out = html;
            for ( let child of Route.childs) {
                let childHtml = fs.readFileSync(__dirname + '/front/' + child.path, 'utf8');
                out = out.replace(child.selector,childHtml)
            }
            res.writeHead(Status.OK.code,headers(Route.type))
            res.end(out);
        });
    }

    let index = function() {
        renderHtml(Endpoints.indexHtml);
    };

    let noPage = function() {
        let url = req.url.slice(1,req.url.length);
        let arr = url.split(".");
        let name = arr[0];
        let ext = arr[1]
        try {
            ext = ext[0].toUpperCase() + ext.slice(1,ext.length)
            let endpoint = Endpoints[name+ext];
            fetchFile(endpoint);
        } catch(e) {
            setTimeout(function() {
                res.writeHead(Status.NO_PAGE.code,headers(ContentType.JSON))
                res.end("ERROR: " + e);
            },5000);
        }
    }

    let routes = new Map();
    routes.set('/app.js', Endpoints.appJs )
    routes.set('/', index)
    let route = routes.get(req.url)
    
    let getRoute = new Map()
    .set('object', function() { fetchFile(route) } )
    .set('function', route )
    .set('undefined', noPage )
    let callback = getRoute.get(typeof route)

    if (typeof callback === 'function')
        callback();
}
