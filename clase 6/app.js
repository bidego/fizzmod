/**
 * Stream : El modulo solamente nos da la abstraccion de streams en las interfaces de sus clases : 
 * 
 *  - Writable : Son de solo escritura
 *  - Readable : Son de solo lectura
 *  - Duplex : Son de lectura y escritura
 *  - Transform : Son un tipo especial de Duplex en donde el output se calcula en base a una transformacion del input
 */

//FyleSystem
const fs = require("fs")
//fs.readFileSync(__filename)
/*
fs.readFile(__filename,(err,data)=>{
    console.log(data.toString())
})
*/

//Inicia un stream en modo pausado(paused)
//Los streams pueden estar en dos modos : paused o flowing
let archivo = fs.createReadStream(__dirname+"/index.html")
let nuevo = fs.createWriteStream(__dirname+"/output.txt")
//El evento data de un Readable se dispara cuando nos llega un chunk a traves del stream en forma de Buffer
//TODOS los streams de tipo Readable tienen el evento "data"
/*
archivo.on("data",chunk=>{
    console.log("Nuevo Chunk",chunk)
    //TODOS los streams de tipo Writable implementan el metodo write para escribir por stream
    nuevo.write(chunk)
})
//TODOS los streams de tipo readable implementan el evento de tipo "end" y se dispara cuando ya no hay mas info para leer 
archivo.on("end",()=>{
    nuevo.end()
})
*/

//PIPES
archivo.pipe(nuevo)


//https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93


/**
 * NET / HTTP
 * 
 * 
 * TCP/IP
 * 
 * HTTP
 * 
 * Request (Cliente)
 * METODO  URL  VERSION
 * Headers
 * Body
 * 
 * POST /index.html http/1.1
 * Host : www.google.com
 * Content-Type : text/plain
 * Body
 *     nombre : horacio
 * 
 * 
 * Response (Servidor)
 * VERSION CODIGO MENSAJE
 * Headers
 * Body
 *  
 * Http/1.1 200 OK
 * Content-type : text/html
 * Content-length : 124
 * Access-Content-Allow-Origin : *
 * Access-Content-Allow-Origin : google.com
 * Access-Content-Allow-Origin : localhost
 * 
 * 
 * CORS : Cross Origin Resource Sharing es una politica de seguridad para compartir recursos a traves de dominios
 * JSONP 
 * 
 */
