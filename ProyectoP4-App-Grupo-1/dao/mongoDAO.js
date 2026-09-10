const conectarMongoDB =
    require("../config/mongodb");

const { ObjectId } =
    require("mongodb");


class MongoDAO {

    async insertarCarro(carro) {

        const db = await conectarMongoDB();

        const documento = {
            codigoCarro: carro.codigoCarro,
            nombreCarro: carro.nombreCarro,
            escuderia: carro.escuderia,
            fabricante: carro.fabricante,
            modelo: carro.modelo,
            categoria: carro.categoria,
            anio: Number(carro.anio),
            paisOrigen: carro.paisOrigen,
            pesoKg: Number(carro.pesoKg),
            velocidadMaximaKmh: Number(carro.velocidadMaximaKmh),
            aceleracion0a100: Number(carro.aceleracion0a100),
            tipoTraccion: carro.tipoTraccion,
            numeroMarchas: Number(carro.numeroMarchas),
            codigoMotorAsignado: carro.codigoMotorAsignado,
            imagenCarro: convertirImagen(carro.imagenCarro)
        };

        const resultado = await db
            .collection("CollMongoDB")
            .insertOne(documento);

        return {
            _id: resultado.insertedId,
            ...documento,
            imagenCarro: convertirBase64(documento.imagenCarro)
        };
    }

    async listarCarros() {

        const db = await conectarMongoDB();

        const carros = await db
            .collection("CollMongoDB")
            .find({ codigoCarro: { $exists: true } })
            .toArray();

        return carros.map(convertirDocumento);
    }

    async buscarCarro(id) {

        const db = await conectarMongoDB();

        const carro = await db
            .collection("CollMongoDB")
            .findOne({
                _id: new ObjectId(id),
                codigoCarro: { $exists: true }
            });

        return convertirDocumento(carro);
    }

    async actualizarCarro(id, carro) {

        const db = await conectarMongoDB();

        const datos = {
            codigoCarro: carro.codigoCarro,
            nombreCarro: carro.nombreCarro,
            escuderia: carro.escuderia,
            fabricante: carro.fabricante,
            modelo: carro.modelo,
            categoria: carro.categoria,
            anio: Number(carro.anio),
            paisOrigen: carro.paisOrigen,
            pesoKg: Number(carro.pesoKg),
            velocidadMaximaKmh: Number(carro.velocidadMaximaKmh),
            aceleracion0a100: Number(carro.aceleracion0a100),
            tipoTraccion: carro.tipoTraccion,
            numeroMarchas: Number(carro.numeroMarchas),
            codigoMotorAsignado: carro.codigoMotorAsignado,
            imagenCarro: convertirImagen(carro.imagenCarro)
        };

        const resultado = await db
            .collection("CollMongoDB")
            .updateOne(
                {
                    _id: new ObjectId(id),
                    codigoCarro: { $exists: true }
                },
                { $set: datos }
            );

        if (resultado.matchedCount === 0) {
            return null;
        }

        return await this.buscarCarro(id);
    }

    async eliminarCarro(id) {

        const db = await conectarMongoDB();
        const carro = await this.buscarCarro(id);

        if (!carro) {
            return null;
        }

        await db.collection("CollMongoDB").deleteOne({
            _id: new ObjectId(id),
            codigoCarro: { $exists: true }
        });

        return carro;
    }

    async insertarMotor(motor) {

        const db = await conectarMongoDB();

        const documento = {
            codigoMotor: motor.codigoMotor,
            nombreMotor: motor.nombreMotor,
            fabricanteMotor: motor.fabricanteMotor,
            familiaMotor: motor.familiaMotor,
            arquitecturaMotor: motor.arquitecturaMotor,
            configuracionCilindros: motor.configuracionCilindros,
            cantidadCilindros: Number(motor.cantidadCilindros),
            cilindradaCc: Number(motor.cilindradaCc),
            diametroMm: Number(motor.diametroMm),
            carreraMm: Number(motor.carreraMm),
            relacionCompresion: Number(motor.relacionCompresion),
            tipoAspiracion: motor.tipoAspiracion,
            potenciaHp: Number(motor.potenciaHp),
            torqueNm: Number(motor.torqueNm),
            rpmPotenciaMaxima: Number(motor.rpmPotenciaMaxima),
            rpmTorqueMaximo: Number(motor.rpmTorqueMaximo),
            rpmLimite: Number(motor.rpmLimite),
            tipoCombustible: motor.tipoCombustible,
            sistemaInyeccion: motor.sistemaInyeccion,
            sistemaRefrigeracion: motor.sistemaRefrigeracion,
            sistemaLubricacion: motor.sistemaLubricacion,
            materialBloque: motor.materialBloque,
            materialCulata: motor.materialCulata,
            vidaUtilCompetenciaKm: Number(motor.vidaUtilCompetenciaKm),
            imagenMotor: convertirImagen(motor.imagenMotor)
        };

        const resultado = await db
            .collection("CollMongoDB")
            .insertOne(documento);

        return {
            _id: resultado.insertedId,
            ...documento,
            imagenMotor: convertirBase64(documento.imagenMotor)
        };
    }

    async listarMotores() {

        const db = await conectarMongoDB();

        const motores = await db
            .collection("CollMongoDB")
            .find({ codigoMotor: { $exists: true } })
            .toArray();

        return motores.map(convertirDocumento);
    }

    async buscarMotor(id) {

        const db = await conectarMongoDB();

        const motor = await db
            .collection("CollMongoDB")
            .findOne({
                _id: new ObjectId(id),
                codigoMotor: { $exists: true }
            });

        return convertirDocumento(motor);
    }

    async buscarMotorPorCodigo(codigoMotor) {

        const db = await conectarMongoDB();

        const motor = await db
            .collection("CollMongoDB")
            .findOne({ codigoMotor });

        return convertirDocumento(motor);
    }

    async buscarCarrosPorMotor(codigoMotor) {

        const db = await conectarMongoDB();

        const carros = await db
            .collection("CollMongoDB")
            .find({ codigoMotorAsignado: codigoMotor })
            .toArray();

        return carros.map(convertirDocumento);
    }

    async actualizarMotor(id, motor) {

        const db = await conectarMongoDB();

        const datos = {
            codigoMotor: motor.codigoMotor,
            nombreMotor: motor.nombreMotor,
            fabricanteMotor: motor.fabricanteMotor,
            familiaMotor: motor.familiaMotor,
            arquitecturaMotor: motor.arquitecturaMotor,
            configuracionCilindros: motor.configuracionCilindros,
            cantidadCilindros: Number(motor.cantidadCilindros),
            cilindradaCc: Number(motor.cilindradaCc),
            diametroMm: Number(motor.diametroMm),
            carreraMm: Number(motor.carreraMm),
            relacionCompresion: Number(motor.relacionCompresion),
            tipoAspiracion: motor.tipoAspiracion,
            potenciaHp: Number(motor.potenciaHp),
            torqueNm: Number(motor.torqueNm),
            rpmPotenciaMaxima: Number(motor.rpmPotenciaMaxima),
            rpmTorqueMaximo: Number(motor.rpmTorqueMaximo),
            rpmLimite: Number(motor.rpmLimite),
            tipoCombustible: motor.tipoCombustible,
            sistemaInyeccion: motor.sistemaInyeccion,
            sistemaRefrigeracion: motor.sistemaRefrigeracion,
            sistemaLubricacion: motor.sistemaLubricacion,
            materialBloque: motor.materialBloque,
            materialCulata: motor.materialCulata,
            vidaUtilCompetenciaKm: Number(motor.vidaUtilCompetenciaKm),
            imagenMotor: convertirImagen(motor.imagenMotor)
        };

        const resultado = await db
            .collection("CollMongoDB")
            .updateOne(
                {
                    _id: new ObjectId(id),
                    codigoMotor: { $exists: true }
                },
                { $set: datos }
            );

        if (resultado.matchedCount === 0) {
            return null;
        }

        return await this.buscarMotor(id);
    }

    async eliminarMotor(id) {

        const db = await conectarMongoDB();
        const motor = await this.buscarMotor(id);

        if (!motor) {
            return null;
        }

        await db.collection("CollMongoDB").deleteOne({
            _id: new ObjectId(id),
            codigoMotor: { $exists: true }
        });

        return motor;
    }
}

function convertirImagen(imagen) {

    if (!imagen) {
        return null;
    }

    return Buffer.from(
        imagen.replace(/^data:image\/jpeg;base64,/, ""),
        "base64"
    );
}

function convertirBase64(imagen) {

    if (!imagen) {
        return null;
    }

    if (Buffer.isBuffer(imagen)) {
        return imagen.toString("base64");
    }

    if (imagen.buffer) {
        return Buffer.from(imagen.buffer).toString("base64");
    }

    return Buffer.from(imagen).toString("base64");
}

function convertirDocumento(documento) {

    if (!documento) {
        return null;
    }

    const resultado = {
        ...documento,
        _id: documento._id.toString()
    };

    if (resultado.imagenCarro) {
        resultado.imagenCarro = convertirBase64(resultado.imagenCarro);
    }

    if (resultado.imagenMotor) {
        resultado.imagenMotor = convertirBase64(resultado.imagenMotor);
    }

    return resultado;
}

module.exports = MongoDAO;
