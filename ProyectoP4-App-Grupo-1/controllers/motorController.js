const MotorService = require("../services/motorService");

/*=========================================
  Listar motores
=========================================*/

function listar(req, res) {

    try {

        const motores = MotorService.listar();

        res.json(motores);

    }
    catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Buscar motor
=========================================*/

function buscar(req, res) {

    try {

        const codigo = req.params.codigo;

        const motor =
            MotorService.buscarPorCodigo(codigo);

        if (!motor) {

            return res.status(404).json({

                mensaje: "Motor no encontrado."

            });

        }

        res.json(motor);

    }
    catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Guardar motor
=========================================*/

function guardar(req, res) {

    try {

        const motor = {

            codigo: req.body.codigo,
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            cilindrada:
                req.body.cilindrada === ""
                    ? NaN
                    : Number(req.body.cilindrada),
            potencia:
                req.body.potencia === ""
                    ? NaN
                    : Number(req.body.potencia)

        };

        MotorService.guardar(motor);

        res.status(201).json({

            mensaje: "Motor guardado correctamente."

        });

    }
    catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Modificar motor
=========================================*/

function modificar(req, res) {

    try {

        const motor = {

            codigo: req.body.codigo,
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            cilindrada:
                req.body.cilindrada === ""
                    ? NaN
                    : Number(req.body.cilindrada),
            potencia:
                req.body.potencia === ""
                    ? NaN
                    : Number(req.body.potencia)

        };

        MotorService.modificar(motor);

        res.json({

            mensaje: "Motor modificado correctamente."

        });

    }
    catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Eliminar motor
=========================================*/

function eliminar(req, res) {

    try {

        const codigo = req.params.codigo;

        MotorService.eliminar(codigo);

        res.json({

            mensaje: "Motor eliminado correctamente."

        });

    }
    catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Exportar funciones
=========================================*/

module.exports = {

    listar,
    buscar,
    guardar,
    modificar,
    eliminar

};
