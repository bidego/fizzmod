CREATE DATABASE chat_fizzmod;
USE chat_fizzmod;

CREATE TABLE estados_usuario (
  id int(11) NOT NULL AUTO_INCREMENT,
  descripcion varchar(50),
  PRIMARY KEY (id)
);

CREATE TABLE estados_mensaje (
  id int(11) NOT NULL AUTO_INCREMENT,
  descripcion varchar(50),
  PRIMARY KEY (id)
);

CREATE TABLE usuarios (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(50),
  apellido varchar(50),
  nombre_de_usuario varchar(50),
  email varchar(50),
  creado_en timestamp,
  actualizado_en timestamp,
  id_estado int(11) NOT NULL default 2,
  PRIMARY KEY (id),
  CONSTRAINT user_status FOREIGN KEY(id_estado) REFERENCES estados_usuario(id)
  ON UPDATE cascade ON DELETE restrict
);

CREATE TABLE mensajes (
  id int(11) NOT NULL AUTO_INCREMENT,
  cuerpo varchar(50),
  creado_en date,
  actualizado_en date,
  id_usuario int(11) NOT NULL,
  id_estado int(11) NOT NULL default 1,
  PRIMARY KEY (id),
  CONSTRAINT user_remitente FOREIGN KEY(id_usuario) REFERENCES usuarios(id)
  ON UPDATE cascade ON DELETE restrict,
  CONSTRAINT mensaje_estado FOREIGN KEY (id_estado) REFERENCES estados_mensaje(id)
  ON UPDATE cascade ON DELETE restrict
  );

INSERT INTO estados_usuario (id, descripcion) VALUES
(1, 'OFFLINE'),
(2, 'ONLINE');

INSERT INTO estados_mensaje (id, descripcion) VALUES
(1, 'EN COLA'),
(2, 'ENTREGADO'),
(3, 'FALLO');

INSERT INTO usuarios (id, nombre, apellido, nombre_de_usuario, id_estado) VALUES
(1, 'Pablo','A', 'pablo', 1),
(2, 'Carlos','B', 'car100', 1),
(3, 'Mario','D', 'marian2', 1),
(4, 'Hernan','H', 'jerNAN', 1);
