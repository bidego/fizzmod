//Node : .js .json .c
//app.js

//incluir módulos de manera sincrónica solo al principio
//require()

//exportar info de módulo
//module.exports = {}
//exports = {}  exports es una variable local del módulo (function(exports,...otrs) { })()

/*
Módulos nativos que siempre utiliza node.js por debajo
Buffer - Stream - EventEmmiter
*/
const { EventEmitter } = require("events");
const { nextTick } = process;

const Eventos = {
    CLICK: "click",
    BLUR: "blur"
}
class Emitter extends EventEmitter {    
}

let myEmitter = new Emitter();
myEmitter.on(Eventos.CLICK, log(Eventos.CLICK));
myEmitter.on(Eventos.BLUR, log(Eventos.BLUR));

myEmitter.emit(Eventos.CLICK,new Buffer(6));

console.log("segundo")

function log(a) {
    return (p) => {
        console.log(p)
        p.write("hola mundo");
        console.log(p);
        console.log(p.toString());
        setImmediate(() => console.log('ocurrió un '+a+'! setImmediate'));
        nextTick(() => console.log('ocurrió un '+a+'! nextTick'));
    };
}