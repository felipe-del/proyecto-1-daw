CREATE DATABASE "BDPostgreSQL";

\connect "BDPostgreSQL"

CREATE TABLE motores_carrera (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    cilindrada_cc NUMERIC NOT NULL,
    potencia_hp NUMERIC NOT NULL,
    torque_nm NUMERIC NOT NULL,
    combustible VARCHAR(50) NOT NULL,
    imagen_motor BYTEA
);

CREATE TABLE especificaciones_motor (
    id SERIAL PRIMARY KEY,
    codigo_especificacion VARCHAR(100) NOT NULL,
    arquitectura VARCHAR(100) NOT NULL,
    numero_cilindros INTEGER NOT NULL,
    aspiracion VARCHAR(100) NOT NULL,
    rpm_maxima INTEGER NOT NULL,
    sistema_refrigeracion VARCHAR(100) NOT NULL,
    relacion_compresion NUMERIC NOT NULL,
    imagen_especificacion BYTEA
);

CREATE TABLE carros_carrera (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    peso_kg NUMERIC NOT NULL,
    velocidad_maxima_kmh NUMERIC NOT NULL,
    anio_fabricacion INTEGER NOT NULL,
    imagen_carro BYTEA,
    motor_id INTEGER NOT NULL REFERENCES motores_carrera(id)
);

CREATE TABLE configuraciones_carro (
    id SERIAL PRIMARY KEY,
    nombre_configuracion VARCHAR(100) NOT NULL,
    tipo_traccion VARCHAR(100) NOT NULL,
    transmision VARCHAR(100) NOT NULL,
    numero_marchas INTEGER NOT NULL,
    tipo_neumatico VARCHAR(100) NOT NULL,
    carga_aerodinamica VARCHAR(100) NOT NULL,
    altura_mm NUMERIC NOT NULL,
    imagen_configuracion BYTEA,
    especificacion_motor_id INTEGER NOT NULL REFERENCES especificaciones_motor(id)
);
