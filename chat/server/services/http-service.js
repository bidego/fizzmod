const http = require('http');

module.exports = {
    register: function(dto,callback) { return this.http('register',dto, callback) },
    profile: function(dto,callback) { return this.http('profile', dto, callback) },
    feed: function(dto,callback) { return this.http('feed', dto, callback) },
    login: function(dto,callback) { return this.http('login', dto, callback) },

    http: function(endpoint,dto, callback) {
        console.log("adentro!!!")
        let opt = this.options(dto);
        opt.path += endpoint
        let req = http.request(opt, callback);
        return req;
    },
    options: function(dto) {
        return {
            host: 'localhost',
            port: 9000,
            path: '/',
            method: 'POST',
            headers: this.buildHeader(dto)
        }
    },
    buildHeader: function(dto) {
        if (dto) {
            return {
                'Content-Length': dto.length ,
                'Content-Type': 'application/json',
            }
        } else {
            return {
                'Content-Type': 'application/json'
            }
        }
    }
}