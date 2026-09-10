const MongoDAO =
    require("../dao/mongoDAO");

const mongoDAO =
    new MongoDAO();


class MongoService {

    async insertarCarro(carro) {
        validarCarro(carro);
        return await mongoDAO.insertarCarro(carro);
    }

    async listarCarros() {
        return await mongoDAO.listarCarros();
    }

    async buscarCarro(id) {
        return await mongoDAO.buscarCarro(id);
    }

    async actualizarCarro(id, carro) {
        validarCarro(carro);
        return await mongoDAO.actualizarCarro(id, carro);
    }

    async eliminarCarro(id) {
        return await mongoDAO.eliminarCarro(id);
    }

    async insertarMotor(motor) {
        validarMotor(motor);
        return await mongoDAO.insertarMotor(motor);
    }

    async listarMotores() {
        return await mongoDAO.listarMotores();
    }

    async buscarMotor(id) {
        return await mongoDAO.buscarMotor(id);
    }

    async buscarMotorPorCodigo(codigoMotor) {
        return await mongoDAO.buscarMotorPorCodigo(codigoMotor);
    }

    async buscarCarrosPorMotor(codigoMotor) {
        return await mongoDAO.buscarCarrosPorMotor(codigoMotor);
    }

    async actualizarMotor(id, motor) {
        validarMotor(motor);
        return await mongoDAO.actualizarMotor(id, motor);
    }

    async eliminarMotor(id) {
        return await mongoDAO.eliminarMotor(id);
    }
}

function validarCarro(carro) {

    if (!carro.codigoCarro ||
        !carro.nombreCarro ||
        !carro.escuderia ||
        !carro.fabricante ||
        !carro.modelo ||
        !carro.categoria ||
        !carro.paisOrigen ||
        !carro.tipoTraccion ||
        !carro.codigoMotorAsignado) {

        throw new Error("Todos los campos del carro son obligatorios.");
    }

    if ([carro.anio, carro.pesoKg,
        carro.velocidadMaximaKmh,
        carro.aceleracion0a100,
        carro.numeroMarchas].some(valor => isNaN(valor))) {

        throw new Error("Los datos numéricos del carro son inválidos.");
    }
}

function validarMotor(motor) {

    const campos = [
        "codigoMotor", "nombreMotor", "fabricanteMotor",
        "familiaMotor", "arquitecturaMotor", "configuracionCilindros",
        "tipoAspiracion", "tipoCombustible", "sistemaInyeccion",
        "sistemaRefrigeracion", "sistemaLubricacion", "materialBloque",
        "materialCulata"
    ];

    if (campos.some(campo => !motor[campo])) {
        throw new Error("Todos los campos del motor son obligatorios.");
    }

    const numeros = [
        motor.cantidadCilindros, motor.cilindradaCc,
        motor.diametroMm, motor.carreraMm,
        motor.relacionCompresion, motor.potenciaHp,
        motor.torqueNm, motor.rpmPotenciaMaxima,
        motor.rpmTorqueMaximo, motor.rpmLimite,
        motor.vidaUtilCompetenciaKm
    ];

    if (numeros.some(valor => isNaN(valor))) {
        throw new Error("Los datos numéricos del motor son inválidos.");
    }
}

module.exports = MongoService;
