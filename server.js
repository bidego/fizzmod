const http = require("http");
const app = http.createServer((res,req)=>{})
app.listen(8000);
const appBO = http.createServer((res,req)=>{})
app.listen(9000);

http.get({
	hostname: 'localhost',
	port: "80",
	path: "",
	agent: false
}, (r) => {});