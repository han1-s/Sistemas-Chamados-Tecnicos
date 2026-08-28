CREATE DATABASE IF NOT EXISTS suporte_tecnico;
USE suporte_tecnico;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    prioridade VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CHECK (prioridade IN ('baixa', 'média', 'alta')),
    CHECK (status IN ('aberto', 'em andamento', 'concluído'))
);

-- Usuário administrador de exemplo (use-o para testar o login)
INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Administrador', 'admin@teste.com', '123456', 'admin');
