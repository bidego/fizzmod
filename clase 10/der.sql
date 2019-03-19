CREATE DATABASE chat_fizzmod;
USE chat_fizzmod;

CREATE TABLE countries (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  PRIMARY KEY (id)
);

CREATE TABLE statuses (
  id int(11) NOT NULL AUTO_INCREMENT,
  description varchar(50),
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50),
  id_country int(11) NOT NULL,
  id_status int(11) NOT NULL default 2,
  PRIMARY KEY (id),
  CONSTRAINT user_country FOREIGN KEY(id_country) REFERENCES countries(id)
  ON UPDATE cascade ON DELETE restrict,
  CONSTRAINT user_status FOREIGN KEY(id_status) REFERENCES statuses(id)
  ON UPDATE cascade ON DELETE restrict
);

CREATE TABLE messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  id_user_from int(11) NOT NULL,
  id_user_to int(11) NOT NULL,
  message varchar(50),
  PRIMARY KEY (id),
  CONSTRAINT from_user FOREIGN KEY (id_user_from) REFERENCES users(id)
  ON UPDATE cascade ON DELETE restrict,
  CONSTRAINT to_user FOREIGN KEY(id_user_to) REFERENCES users(id)
  ON UPDATE cascade ON DELETE restrict
);

INSERT INTO countries (id, name) VALUES
(1, 'Argentina'),
(2, 'Uruguay');

INSERT INTO statuses (id, description) VALUES
(1, 'OFFLINE'),
(2, 'ONLINE');

INSERT INTO users (id, name, id_country) VALUES
(1, 'Pablo', 1),
(2, 'Carlos', 2),
(3, 'Mario', 1),
(4, 'Hernan', 1);