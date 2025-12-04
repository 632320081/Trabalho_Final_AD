DROP DATABASE IF EXISTS controle_chaves;
CREATE DATABASE controle_chaves;
USE controle_chaves;

-- 1. SALAS
CREATE TABLE salas (
  id INT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

-- 2. USUARIOS (Professores/Funcionários)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(20)
);

-- 3. CHAVES
CREATE TABLE chaves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sala_id INT NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'normal' ou 'reserva'
  status VARCHAR(20) DEFAULT 'livre',
  usuario_nome VARCHAR(100), -- Grava o nome de quem pegou
  usuario_cargo VARCHAR(50),
  horario DATETIME,
  FOREIGN KEY (sala_id) REFERENCES salas(id)
);

-- 4. HISTÓRICO
CREATE TABLE historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sala_nome VARCHAR(50),
  chave_tipo VARCHAR(20),
  acao VARCHAR(50),
  usuario_nome VARCHAR(100),
  horario DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS
INSERT INTO salas (id, nome) VALUES 
(1, 'Sala 101'), (2, 'Sala 102'), (3, 'Laboratório 1'), (4, 'Auditório');

-- Cria 1 chave normal e 1 reserva para cada sala
INSERT INTO chaves (sala_id, tipo) SELECT id, 'normal' FROM salas;
INSERT INTO chaves (sala_id, tipo) SELECT id, 'reserva' FROM salas;

-- Alguns professores de teste
INSERT INTO usuarios (nome, cargo, whatsapp) VALUES 
('Carlos Silva', 'Professor', '(51) 99999-9999'),
('Ana Souza', 'Limpeza', '(51) 88888-8888');