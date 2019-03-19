let _colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];

module.exports = {
    port: 1337,
    userColors: _colors.sort( (a,b) => Math.random() > 0.5 )
}