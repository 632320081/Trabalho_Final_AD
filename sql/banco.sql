DROP DATABASE IF EXISTS controle_chaves;
CREATE DATABASE controle_chaves;
USE controle_chaves;

CREATE TABLE salas (
  id INT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(20)
);

CREATE TABLE chaves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sala_id INT NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'livre',
  usuario_nome VARCHAR(100),
  usuario_cargo VARCHAR(50),
  horario DATETIME,
  FOREIGN KEY (sala_id) REFERENCES salas(id)
);

CREATE TABLE historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sala_nome VARCHAR(50),
  chave_tipo VARCHAR(20),
  acao VARCHAR(50),
  usuario_nome VARCHAR(100),
  horario DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO salas (id, nome) VALUES 
(1, 'Sala 101'), (2, 'Sala 102'), (3, 'Laboratório 1'), (4, 'Auditório');

INSERT INTO chaves (sala_id, tipo) SELECT id, 'normal' FROM salas;
INSERT INTO chaves (sala_id, tipo) SELECT id, 'reserva' FROM salas;

INSERT INTO usuarios (nome, cargo, whatsapp) VALUES 
('Carlos Silva', 'Professor', '(51) 99999-9999'),
('Ana Souza', 'Limpeza', '(51) 88888-8888');