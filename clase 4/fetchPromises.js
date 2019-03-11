
let url = "https://jsonplaceholder.typicode.com/";

fetch(url+'users')
.then(data => data.json())
.then(data=> fetch(url+"posts?userId="+data[6].id))
.then(data=> data.json())
.then(data => Promise.all(data.map(p => fetch(url+"comments?postId="+p.id))))
.then(data => Promise.all(data.map(comment=>comment.json())))
.then(data => console.log(data))
.catch(err => console.error(err))
