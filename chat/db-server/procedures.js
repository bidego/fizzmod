module.exports = {
    getUsers: `SELECT nombre_de_usuario, es.estado FROM usuarios u LEFT JOIN estados_usuario es ON es.id = u.id_estado`,
    login: u => `SELECT nombre_de_usuario FROM usuarios u WHERE nombre_de_usuario = '${u}'`,
    USERS: {
        STATUS: "SELECT u.nombre_de_usuario, s.description FROM usuarios u INNER JOIN estados_usuario s ON u.id_estado = s.id",
        ADD: function(name,firstname,lastname,email) {
            return `INSERT INTO usuarios (nombre_de_usuario, nombre, apellido, email) VALUES ('${name}','${firstname}','${lastname}','${email}')`;
        },
        EDIT: function(u,f,l) {
            return `UPDATE usuarios SET nombre = '${f}', apellido = '${l}' WHERE nombre_de_usuario = '${u}'`;
        }
    },
    MESSAGES: {
        NEW: function(id_user,message) {
            return `INSERT INTO mensajes (id_usuario,cuerpo) VALUES (
                (SELECT id FROM usuarios WHERE nombre_de_usuario = '${id_user}'),'${message}')`;
        }
    }
}
