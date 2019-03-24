const { ContentType } = require('./enums/')
module.exports = {
    Endpoints: {
        appJs: { path: "scripts/app.js", type: ContentType.JS },
        stylesCss: { path: "views/styles.css", type: ContentType.CSS },
        indexHtml: { path: "views/index.html", type: ContentType.HTML, childs: [
            { path: "views/register.html", selector: "<chatregister>" },
            { path: "views/login.html", selector: "<chatlogin>"},
            { path: "views/profile.html", selector: "<chatprofile>"},
            { path: "views/feed.html", selector: "<chatfeed>"}
        ] }
    }
}