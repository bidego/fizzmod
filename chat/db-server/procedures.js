module.exports = {
    getUsers: `SELECT nombre_de_usuario, es.descripcion as estado FROM usuarios u LEFT JOIN estados_usuario es ON es.id = u.id_estado WHERE u.id_estado = 2`,
    login: u => `SELECT id, nombre_de_usuario FROM usuarios u WHERE nombre_de_usuario = '${u}'`,
    connect: id => `UPDATE usuarios SET id_estado = 2 WHERE id = ${id}`,
    disconnect: id => `UPDATE usuarios SET id_estado = 1 WHERE id = '${id}'`,
    
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
            return `INSERT INTO mensajes (id_usuario,cuerpo) VALUES (${id_user},'${message}')`;
        }
    }
}
