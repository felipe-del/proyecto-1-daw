const MotorDAO = require("../dao/motorDAO");

/*=========================================
  Listar motores
=========================================*/

function listar() {

    return MotorDAO.listar();

}

/*=========================================
  Buscar por código
=========================================*/

function buscarPorCodigo(codigo) {

    return MotorDAO.buscarPorCodigo(codigo);

}

/*=========================================
  Guardar motor
=========================================*/

function guardar(motor) {

    if (!motor.codigo ||
        !motor.nombre ||
        !motor.tipo) {

        throw new Error("Todos los campos son obligatorios.");

    }

    if (isNaN(motor.cilindrada) ||
        isNaN(motor.potencia)) {

        throw new Error("La cilindrada y la potencia deben ser numéricas.");

    }

    const existente =
        MotorDAO.buscarPorCodigo(motor.codigo);

    if (existente) {

        throw new Error("El código ya existe.");

    }

    MotorDAO.guardar(motor);

}

/*=========================================
  Modificar motor
=========================================*/

function modificar(motor) {

    const existente =
        MotorDAO.buscarPorCodigo(motor.codigo);

    if (!existente) {

        throw new Error("El motor no existe.");

    }

    if (!motor.nombre ||
        !motor.tipo) {

        throw new Error("Todos los campos son obligatorios.");

    }

    if (isNaN(motor.cilindrada) ||
        isNaN(motor.potencia)) {

        throw new Error("La cilindrada y la potencia deben ser numéricas.");

    }

    MotorDAO.modificar(motor);

}

/*=========================================
  Eliminar motor
=========================================*/

function eliminar(codigo) {

    const existente =
        MotorDAO.buscarPorCodigo(codigo);

    if (!existente) {

        throw new Error("El motor no existe.");

    }

    MotorDAO.eliminar(codigo);

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
