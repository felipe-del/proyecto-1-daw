const fs = require("fs");
const path = require("path");


// Ruta del archivo de datos

const ARCHIVO = path.join(
    __dirname,
    "..",
    "data",
    "carros.txt"
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
                marca: datos[2],
                categoria: datos[3],
                velocidadMaxima: Number(datos[4])
            };

        });

}

/*=========================================
  Escribir archivo
=========================================*/

function escribirArchivo(carros) {

    const lineas = carros.map(carro => {

        return `${carro.codigo};${carro.nombre};${carro.marca};${carro.categoria};${carro.velocidadMaxima}`;

    });

    fs.writeFileSync(
        ARCHIVO,
        lineas.join("\n"),
        "utf8"
    );

}

/*=========================================
  Listar carros
=========================================*/

function listar() {

    return leerArchivo();

}

/*=========================================
  Buscar por código
=========================================*/

function buscarPorCodigo(codigo) {

    const carros = leerArchivo();

    return carros.find(
        carro => carro.codigo === codigo
    ) || null;

}

/*=========================================
  Guardar carro
=========================================*/

function guardar(carro) {

    const carros = leerArchivo();

    carros.push(carro);

    escribirArchivo(carros);

}

/*=========================================
  Modificar carro
=========================================*/

function modificar(carroActualizado) {

    const carros = leerArchivo();

    const nuevos = carros.map(carro => {

        if (carro.codigo === carroActualizado.codigo) {

            return carroActualizado;

        }

        return carro;

    });

    escribirArchivo(nuevos);

}

/*=========================================
  Eliminar carro
=========================================*/

function eliminar(codigo) {

    const carros = leerArchivo();

    const nuevos = carros.filter(
        carro => carro.codigo !== codigo
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
