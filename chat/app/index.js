module.exports = {
    Config: require('./config-properties'),
    Endpoints: require('./endpoints').Endpoints,
    HttpService: require('./services/http-service'),
    MiddService: require('./services/midd-service'),
    RouterService: require('./router'),
    SocketService: require('./services/socket-service')
};