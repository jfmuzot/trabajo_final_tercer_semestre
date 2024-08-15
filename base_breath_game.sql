--CREACION DE LA BASE DE DATOS ---

CREATE DATABASE breath_game
-----------TABLA PAIS--------------------------
CREATE TABLE pais (
    id_pais INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
---------TABLAS USUARIO---------------------------
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL,
    perfil_administrador BOOLEAN NOT NULL,
    perfil_publico BOOLEAN NOT NULL,
    pais_id INT,
    FOREIGN KEY (pais_id) REFERENCES pais(id_pais)
);
-----------TABLA REGISTRO -------------------------
CREATE TABLE registro (
    id_registro INT PRIMARY KEY,
    tiempo INT,
    inhalaciones INT,
    exhalaciones INT,
    fecha DATE,
    ciclos INT,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
----------------------------------------------