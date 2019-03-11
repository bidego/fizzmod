
let url = "https://jsonplaceholder.typicode.com/";

async function buscarComentarios() {
    let users_res = await fetch(url+'users');
    let users = await users_res.json();
    let posts_res = await fetch(url+"posts?userId="+users[7].id);
    let posts = await posts_res.json();
    console.log(posts);
    let comments_res = await Promise.all( async function() {
        return posts.map(post => await fetch(url+"comments?postId="+post.id));
    });
    let comments = await comments_res.json();
    console.log(comments);
    
    //render(comments);
}
buscarComentarios();

const render = function(comments) {
    let div = document.createElement("div");
    comments.forEach( msg => {
        let span = document.createElement("span");
        let br = document.createElement("br");
        span.innerHTML = msg.id + ": " +msg.body;
        div.appendChild(span);
        div.appendChild(br);
    })
    document.body.appendChild(div);
}