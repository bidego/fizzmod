const http = require('http');

module.exports = {
    register: function(dto,callback) { return this.post('register',dto, callback) },
    profile: function(dto,callback) { return this.post('profile', dto, callback) },
    feed: function(dto,callback) { return this.post('feed', dto, callback) },
    login: function(dto,callback) { return this.post('login', dto, callback) },

    post: function(endpoint,dto, callback) {
        let opt = this.options(dto);
        opt.path += endpoint
        let req = http.request(opt, callback);
        return req;
    },
    options: function(dto) {
        return {
            host: require('../').Config.DAO.host,
            port: require('../').Config.DAO.port,
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