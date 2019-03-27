const { ContentType } = require('./enums/')
module.exports = {
    _Endpoints: {
        appJs: { path: "scripts/app.js", type: ContentType.JS },
        stylesCss: { path: "views/styles.css", type: ContentType.CSS },
        loginCss: { path: "views/login.css", type: ContentType.CSS },
        feedCss: { path: "views/feed.css", type: ContentType.CSS },
        userlistCss: { path: "views/userlist.css", type: ContentType.CSS },
        indexHtml: {
        path: "views/index.html", type: ContentType.HTML, childs: [
            { path: "views/register.html", selector: "<chatregister>" },
            { path: "views/login.html", selector: "<chatlogin>" },
            { path: "views/profile.html", selector: "<chatprofile>" },
            { path: "views/feed.html", selector: "<chatfeed>" },
            { path: "views/user-list.html", selector: "<userlist>" }
        ]
        },
        NO_PAGE: {
            path: "views/no_page.html", type: ContentType.HTML
        },
        MIDD: {
            PROFILE: 'profile',
            REGISTER: 'register',
            LOGIN: 'login',
            USERLIST: 'userlist'
        },
        SOCKET: {
            LOGIN: 'login',
            CONNECT: 'connect',
            DISCONNECT: 'disconnect',
            FEED: 'feed'
        }
    },
    get Endpoints() {
        return this._Endpoints;
    }
}