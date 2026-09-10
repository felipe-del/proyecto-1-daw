const fs = require("fs");
const path = require("path");


// Ruta del archivo de datos

const ARCHIVO = path.join(
    __dirname,
    "..",
    "data",
    "motores.txt"
);

/*=========================================
  Crear archivo si no existe
=========================================*/

function inicializarArchivo() {

    if (!fs.existsSync(ARCHIVO)) {

        fs.writeFileSync(ARCHIVO, "");

    }

}

/*=========================================
  Leer archivo
=========================================*/

function leerArchivo() {

    inicializarArchivo();

    const contenido = fs.readFileSync(
        ARCHIVO,
        "utf8"
    );

    if (contenido.trim() === "") {

        return [];

    }

    return contenido
        .trim()
        .split("\n")
        .map(linea => {

            const datos = linea.split(";");

            return {
                codigo: datos[0],
                nombre: datos[1],
                tipo: datos[2],
                cilindrada: Number(datos[3]),
                potencia: Number(datos[4])
            };

        });

}

/*=========================================
  Escribir archivo
=========================================*/

function escribirArchivo(motores) {

    const lineas = motores.map(motor => {

        return `${motor.codigo};${motor.nombre};${motor.tipo};${motor.cilindrada};${motor.potencia}`;

    });

    fs.writeFileSync(
        ARCHIVO,
        lineas.join("\n"),
        "utf8"
    );

}

/*=========================================
  Listar motores
=========================================*/

function listar() {

    return leerArchivo();

}

/*=========================================
  Buscar por código
=========================================*/

function buscarPorCodigo(codigo) {

    const motores = leerArchivo();

    return motores.find(
        motor => motor.codigo === codigo
    ) || null;

}

/*=========================================
  Guardar motor
=========================================*/

function guardar(motor) {

    const motores = leerArchivo();

    motores.push(motor);

    escribirArchivo(motores);

}

/*=========================================
  Modificar motor
=========================================*/

function modificar(motorActualizado) {

    const motores = leerArchivo();

    const nuevos = motores.map(motor => {

        if (motor.codigo === motorActualizado.codigo) {

            return motorActualizado;

        }

        return motor;

    });

    escribirArchivo(nuevos);

}

/*=========================================
  Eliminar motor
=========================================*/

function eliminar(codigo) {

    const motores = leerArchivo();

    const nuevos = motores.filter(
        motor => motor.codigo !== codigo
    );

    escribirArchivo(nuevos);

}

/*=========================================
  Exportar funciones
=========================================*/

module.exports = {

    listar,
    buscarPorCodigo,
    guardar,
    modificar,
    eliminar

};
