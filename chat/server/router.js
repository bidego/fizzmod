const fs = require('fs')
const { Status } = require('./enums/')
const { Endpoints } = require('./endpoints')

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

    async function renderHtml(Route) {
        // In progress: Lectura de templates para inyectar componentes
        fs.readFile(__dirname + '/' + Route.path, 'utf8', async function(err, html){
            let out = html;
            for ( let child of Route.childs) {
                let childHtml = fs.readFileSync(__dirname + '/' + child.path, 'utf8');
                console.log(child.selector)
                out = out.replace(child.selector,childHtml)
            }
            console.log(out)
            res.writeHead(Status.OK.code,headers(Route.type))
            res.end(out);
        });
    }

    let index = function() {
        renderHtml(Endpoints.indexHtml);
    };

    let routes = new Map();
    routes.set('/app.js', Endpoints.appJs )
    routes.set('/styles.css', Endpoints.stylesCss )
    routes.set('/index.html', Endpoints.indexHtml)
    routes.set('/', index)
    let route = routes.get(req.url)
    
    let getRoute = new Map()
    .set('object', function() { fetchFile(route) })
    .set('function', function () { route() })
    let callback = getRoute.get(typeof route)

    if (typeof callback === 'function')
        callback();
}
