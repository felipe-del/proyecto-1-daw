const CarroDAO = require("../dao/carroDAO");

/*=========================================
  Listar carros
=========================================*/

function listar() {

    return CarroDAO.listar();

}

/*=========================================
  Buscar por código
=========================================*/

function buscarPorCodigo(codigo) {

    return CarroDAO.buscarPorCodigo(codigo);

}

/*=========================================
  Guardar carro
=========================================*/

function guardar(carro) {

    if (!carro.codigo ||
        !carro.nombre ||
        !carro.marca ||
        !carro.categoria) {

        throw new Error("Todos los campos son obligatorios.");

    }

    if (isNaN(carro.velocidadMaxima)) {

        throw new Error("La velocidad máxima debe ser numérica.");

    }

    const existente =
        CarroDAO.buscarPorCodigo(carro.codigo);

    if (existente) {

        throw new Error("El código ya existe.");

    }

    CarroDAO.guardar(carro);

}

/*=========================================
  Modificar carro
=========================================*/

function modificar(carro) {

    const existente =
        CarroDAO.buscarPorCodigo(carro.codigo);

    if (!existente) {

        throw new Error("El carro no existe.");

    }

    if (!carro.nombre ||
        !carro.marca ||
        !carro.categoria) {

        throw new Error("Todos los campos son obligatorios.");

    }

    if (isNaN(carro.velocidadMaxima)) {

        throw new Error("La velocidad máxima debe ser numérica.");

    }

    CarroDAO.modificar(carro);

}

/*=========================================
  Eliminar carro
=========================================*/

function eliminar(codigo) {

    const existente =
        CarroDAO.buscarPorCodigo(codigo);

    if (!existente) {

        throw new Error("El carro no existe.");

    }

    CarroDAO.eliminar(codigo);

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
