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

    if (fila.imagen_especificacion) {
        fila.imagen_especificacion = fila.imagen_especificacion.toString("base64");
    }

    if (fila.imagen_configuracion) {
        fila.imagen_configuracion = fila.imagen_configuracion.toString("base64");
    }

    return fila;
}

/*=========================================
  Obtener especificaciones
=========================================*/

const obtenerEspecificaciones = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, imagen_especificacion FROM especificaciones_motor ORDER BY id"
        );

        res.json(resultado.rows.map(prepararFila));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener las especificaciones"
        });
    }
};

/*=========================================
  Obtener especificación
=========================================*/

const obtenerEspecificacion = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, imagen_especificacion FROM especificaciones_motor WHERE id = $1",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Especificación no encontrada"
            });
        }

        res.json(prepararFila(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener la especificación"
        });
    }
};

/*=========================================
  Crear especificación
=========================================*/

const crearEspecificacion = async (req, res) => {

    try {

        const {
            codigo_especificacion,
            arquitectura,
            numero_cilindros,
            aspiracion,
            rpm_maxima,
            sistema_refrigeracion,
            relacion_compresion,
            imagen_especificacion
        } = req.body;

        const resultado = await pool.query(
            "INSERT INTO especificaciones_motor (codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, imagen_especificacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, imagen_especificacion",
            [codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, convertirImagen(imagen_especificacion)]
        );

        res.status(201).json({
            mensaje: "Especificación creada correctamente",
            especificacion: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la especificación"
        });
    }
};

/*=========================================
  Actualizar especificación
=========================================*/

const actualizarEspecificacion = async (req, res) => {

    try {

        const {
            codigo_especificacion,
            arquitectura,
            numero_cilindros,
            aspiracion,
            rpm_maxima,
            sistema_refrigeracion,
            relacion_compresion,
            imagen_especificacion
        } = req.body;

        const resultado = await pool.query(
            "UPDATE especificaciones_motor SET codigo_especificacion = $1, arquitectura = $2, numero_cilindros = $3, aspiracion = $4, rpm_maxima = $5, sistema_refrigeracion = $6, relacion_compresion = $7, imagen_especificacion = $8 WHERE id = $9 RETURNING id, codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, imagen_especificacion",
            [codigo_especificacion, arquitectura, numero_cilindros, aspiracion, rpm_maxima, sistema_refrigeracion, relacion_compresion, convertirImagen(imagen_especificacion), req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Especificación no encontrada"
            });
        }

        res.json({
            mensaje: "Especificación actualizada correctamente",
            especificacion: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar la especificación"
        });
    }
};

/*=========================================
  Eliminar especificación
=========================================*/

const eliminarEspecificacion = async (req, res) => {

    try {

        const resultado = await pool.query(
            "DELETE FROM especificaciones_motor WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Especificación no encontrada"
            });
        }

        res.json({
            mensaje: "Especificación eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar la especificación"
        });
    }
};

/*=========================================
  Obtener configuraciones
=========================================*/

const obtenerConfiguraciones = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, imagen_configuracion FROM configuraciones_carro ORDER BY id"
        );

        res.json(resultado.rows.map(prepararFila));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener las configuraciones"
        });
    }
};

/*=========================================
  Obtener configuración
=========================================*/

const obtenerConfiguracion = async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT id, nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, imagen_configuracion FROM configuraciones_carro WHERE id = $1",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Configuración no encontrada"
            });
        }

        res.json(prepararFila(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener la configuración"
        });
    }
};

/*=========================================
  Crear configuración
=========================================*/

const crearConfiguracion = async (req, res) => {

    try {

        const {
            nombre_configuracion,
            tipo_traccion,
            transmision,
            numero_marchas,
            tipo_neumatico,
            carga_aerodinamica,
            altura_mm,
            especificacion_motor_id,
            imagen_configuracion
        } = req.body;

        const resultado = await pool.query(
            "INSERT INTO configuraciones_carro (nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, imagen_configuracion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, imagen_configuracion",
            [nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, convertirImagen(imagen_configuracion)]
        );

        res.status(201).json({
            mensaje: "Configuración creada correctamente",
            configuracion: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la configuración"
        });
    }
};

/*=========================================
  Actualizar configuración
=========================================*/

const actualizarConfiguracion = async (req, res) => {

    try {

        const {
            nombre_configuracion,
            tipo_traccion,
            transmision,
            numero_marchas,
            tipo_neumatico,
            carga_aerodinamica,
            altura_mm,
            especificacion_motor_id,
            imagen_configuracion
        } = req.body;

        const resultado = await pool.query(
            "UPDATE configuraciones_carro SET nombre_configuracion = $1, tipo_traccion = $2, transmision = $3, numero_marchas = $4, tipo_neumatico = $5, carga_aerodinamica = $6, altura_mm = $7, especificacion_motor_id = $8, imagen_configuracion = $9 WHERE id = $10 RETURNING id, nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, imagen_configuracion",
            [nombre_configuracion, tipo_traccion, transmision, numero_marchas, tipo_neumatico, carga_aerodinamica, altura_mm, especificacion_motor_id, convertirImagen(imagen_configuracion), req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Configuración no encontrada"
            });
        }

        res.json({
            mensaje: "Configuración actualizada correctamente",
            configuracion: prepararFila(resultado.rows[0])
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar la configuración"
        });
    }
};

/*=========================================
  Eliminar configuración
=========================================*/

const eliminarConfiguracion = async (req, res) => {

    try {

        const resultado = await pool.query(
            "DELETE FROM configuraciones_carro WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Configuración no encontrada"
            });
        }

        res.json({
            mensaje: "Configuración eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar la configuración"
        });
    }
};

/*=========================================
  Carga Eager
=========================================*/

const obtenerConfiguracionesEager = async (req, res) => {

    try {

        // CARGA EAGER: se obtiene la configuración y su especificación relacionada en una sola consulta mediante JOIN.
        const resultado = await pool.query(
            "SELECT configuraciones_carro.id, configuraciones_carro.nombre_configuracion, configuraciones_carro.tipo_traccion, configuraciones_carro.transmision, configuraciones_carro.especificacion_motor_id, especificaciones_motor.codigo_especificacion, especificaciones_motor.arquitectura, especificaciones_motor.numero_cilindros, especificaciones_motor.rpm_maxima FROM configuraciones_carro INNER JOIN especificaciones_motor ON configuraciones_carro.especificacion_motor_id = especificaciones_motor.id ORDER BY configuraciones_carro.id"
        );

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar configuraciones y especificaciones"
        });
    }
};


module.exports = {
    obtenerEspecificaciones,
    obtenerEspecificacion,
    crearEspecificacion,
    actualizarEspecificacion,
    eliminarEspecificacion,
    obtenerConfiguraciones,
    obtenerConfiguracion,
    crearConfiguracion,
    actualizarConfiguracion,
    eliminarConfiguracion,
    obtenerConfiguracionesEager
};
