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
        setTimeout(function() {
            res.writeHead(Status.NO_PAGE.code,headers(ContentType.JSON))
            res.end("ERROR");
        },5000);
    }

    let routes = new Map();
    routes.set('/app.js', Endpoints.appJs )
    routes.set('/styles.css', Endpoints.stylesCss )
    routes.set('/index.html', index)
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
