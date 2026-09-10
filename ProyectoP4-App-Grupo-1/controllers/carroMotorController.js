const pool = require("../db/database");

function convertirImagen(imagen) {

    if (!imagen) {
        return null;
    }

    return Buffer.from(
        imagen.replace(/^data:image\/jpeg;base64,/, ""),
        "base64"
    );
}

function prepararFila(fila) {

    if (fila.imagen_motor) {
        fila.imagen_motor = fila.imagen_motor.toString("base64");
    }

    if (fila.imagen_carro) {
        fila.imagen_carro = fila.imagen_carro.toString("base64");
    }

    return fila;
}

/*=========================================
  Obtener motores
=========================================*/

const obtenerMotores = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, imagen_motor FROM motores_carrera ORDER BY id"
        );

        res.json(resultado.rows.map(prepararFila));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los motores"
        });
    }
};

/*=========================================
  Obtener motor
=========================================*/

const obtenerMotor = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, imagen_motor FROM motores_carrera WHERE id = $1",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Motor no encontrado"
            });
        }

        res.json(prepararFila(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener el motor"
        });
    }
};

/*=========================================
  Crear motor
=========================================*/

const crearMotor = async (req, res) => {

    try {

        const {
            nombre,
            fabricante,
            tipo,
            cilindrada_cc,
            potencia_hp,
            torque_nm,
            combustible,
            imagen_motor
        } = req.body;

        const resultado = await pool.query(
            "INSERT INTO motores_carrera (nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, imagen_motor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, imagen_motor",
            [nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, convertirImagen(imagen_motor)]
        );

        res.status(201).json({
            mensaje: "Motor creado correctamente",
            motor: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el motor"
        });
    }
};

/*=========================================
  Actualizar motor
=========================================*/

const actualizarMotor = async (req, res) => {

    try {

        const {
            nombre,
            fabricante,
            tipo,
            cilindrada_cc,
            potencia_hp,
            torque_nm,
            combustible,
            imagen_motor
        } = req.body;

        const resultado = await pool.query(
            "UPDATE motores_carrera SET nombre = $1, fabricante = $2, tipo = $3, cilindrada_cc = $4, potencia_hp = $5, torque_nm = $6, combustible = $7, imagen_motor = $8 WHERE id = $9 RETURNING id, nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, imagen_motor",
            [nombre, fabricante, tipo, cilindrada_cc, potencia_hp, torque_nm, combustible, convertirImagen(imagen_motor), req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Motor no encontrado"
            });
        }

        res.json({
            mensaje: "Motor actualizado correctamente",
            motor: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar el motor"
        });
    }
};

/*=========================================
  Eliminar motor
=========================================*/

const eliminarMotor = async (req, res) => {

    try {

        const resultado = await pool.query(
            "DELETE FROM motores_carrera WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Motor no encontrado"
            });
        }

        res.json({
            mensaje: "Motor eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar el motor"
        });
    }
};

/*=========================================
  Obtener carros
=========================================*/

const obtenerCarros = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, imagen_carro FROM carros_carrera ORDER BY id"
        );

        res.json(resultado.rows.map(prepararFila));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los carros"
        });
    }
};

/*=========================================
  Obtener carro
=========================================*/

const obtenerCarro = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, imagen_carro FROM carros_carrera WHERE id = $1",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Carro no encontrado"
            });
        }

        res.json(prepararFila(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener el carro"
        });
    }
};

/*=========================================
  Crear carro
=========================================*/

const crearCarro = async (req, res) => {

    try {

        const {
            nombre,
            marca,
            modelo,
            categoria,
            peso_kg,
            velocidad_maxima_kmh,
            anio_fabricacion,
            motor_id,
            imagen_carro
        } = req.body;

        const resultado = await pool.query(
            "INSERT INTO carros_carrera (nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, imagen_carro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, imagen_carro",
            [nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, convertirImagen(imagen_carro)]
        );

        res.status(201).json({
            mensaje: "Carro creado correctamente",
            carro: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el carro"
        });
    }
};

/*=========================================
  Actualizar carro
=========================================*/

const actualizarCarro = async (req, res) => {

    try {

        const {
            nombre,
            marca,
            modelo,
            categoria,
            peso_kg,
            velocidad_maxima_kmh,
            anio_fabricacion,
            motor_id,
            imagen_carro
        } = req.body;

        const resultado = await pool.query(
            "UPDATE carros_carrera SET nombre = $1, marca = $2, modelo = $3, categoria = $4, peso_kg = $5, velocidad_maxima_kmh = $6, anio_fabricacion = $7, motor_id = $8, imagen_carro = $9 WHERE id = $10 RETURNING id, nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, imagen_carro",
            [nombre, marca, modelo, categoria, peso_kg, velocidad_maxima_kmh, anio_fabricacion, motor_id, convertirImagen(imagen_carro), req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Carro no encontrado"
            });
        }

        res.json({
            mensaje: "Carro actualizado correctamente",
            carro: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar el carro"
        });
    }
};

/*=========================================
  Eliminar carro
=========================================*/

const eliminarCarro = async (req, res) => {

    try {

        const resultado = await pool.query(
            "DELETE FROM carros_carrera WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Carro no encontrado"
            });
        }

        res.json({
            mensaje: "Carro eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar el carro"
        });
    }
};

/*=========================================
  Carga Eager
=========================================*/

const obtenerCarrosEager = async (req, res) => {

    try {

        // CARGA EAGER: se obtiene el carro y su motor relacionado en una sola consulta mediante JOIN.
        const resultado = await pool.query(
            "SELECT carros_carrera.id, carros_carrera.nombre, carros_carrera.marca, carros_carrera.modelo, carros_carrera.categoria, carros_carrera.motor_id, motores_carrera.nombre AS nombre_motor, motores_carrera.fabricante, motores_carrera.tipo, motores_carrera.potencia_hp FROM carros_carrera INNER JOIN motores_carrera ON carros_carrera.motor_id = motores_carrera.id ORDER BY carros_carrera.id"
        );

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar carros y motores"
        });
    }
};


module.exports = {
    obtenerMotores,
    obtenerMotor,
    crearMotor,
    actualizarMotor,
    eliminarMotor,
    obtenerCarros,
    obtenerCarro,
    crearCarro,
    actualizarCarro,
    eliminarCarro,
    obtenerCarrosEager
};
