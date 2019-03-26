const fs = require('fs')
const { ContentType, Status } = require('./enums')
const { Endpoints } = require('./endpoints')

module.exports = (req,res) => {    
    const { routes:MiddRoutes } = require('./').MiddService;
    let headers = (type) => { return {
            "content-type":type,
            "Access-Control-Allow-Headers":"*",
            'Access-Control-Allow-Origin': '*'
        }
    }

    function fetchFile(r) {
        let file = fs.createReadStream(__dirname + "/front/" + r.path);
        console.log(`serving ${r.path}...`)
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

    let checkEndpoints = function() {
        let url = req.url.slice(1,req.url.length);
        let arr = url.split(".");
        let name = arr[0];
        let ext = arr[1]
        try {
            let Ext = ext[0].toUpperCase() + ext.slice(1,ext.length)
            let endpoint = Endpoints[name+Ext] || { path: req.url, type: ContentType[ext]};
            fetchFile(endpoint);
        } catch(e) {
            let route = /[?]/g.test(req.url) ? req.url.split("?")[1].split("=")[0] : req.url;
            if (!MiddRoutes.includes(route)) {
                console.log('path not found: "' +req.url+ '". error 404')
                setTimeout(function() {
                    res.writeHead(Status.NO_PAGE.code,headers(ContentType.JSON))
                    fetchFile(Endpoints.NO_PAGE);
                },3000);
            }
        }
    }

    let virtualHost = new Map();
    virtualHost.set('/app.js', Endpoints.appJs )
    virtualHost.set('/descargaApp.js', Endpoints.appJs)
    virtualHost.set('/', index)
    virtualHost.set('/superChat', index)

    let route = virtualHost.get(req.url)
    
    let getRoute = new Map()
    .set('object', function() { fetchFile(route) } ) // virtual route
    .set('function', route )                         // virtual route function
    .set('undefined', checkEndpoints )
    let callback = getRoute.get(typeof route)

    if (typeof callback === 'function')
        callback();
}
