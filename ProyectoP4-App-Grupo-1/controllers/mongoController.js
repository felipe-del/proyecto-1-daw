const MongoService =
    require("../services/mongoService");

const service =
    new MongoService();


class MongoController {

    static async crearCarro(req, res) {

        try {

            const carro = await service.insertarCarro(req.body);

            res.status(201).json({
                mensaje: "MongoDB: carro creado",
                carro
            });

        } catch (error) {

            console.error(error);

            res.status(400).json({
                mensaje: error.message
            });
        }
    }

    static async obtenerCarros(req, res) {

        try {

            const carros = await service.listarCarros();

            res.json({
                mensaje: "MongoDB: consulta de carros realizada",
                carros
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error consultando carros en MongoDB"
            });
        }
    }

    static async obtenerCarro(req, res) {

        try {

            const carro = await service.buscarCarro(
                req.params.id
            );

            if (!carro) {

                return res.status(404).json({
                    mensaje: "Carro no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: carro encontrado",
                carro
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error consultando carro en MongoDB"
            });
        }
    }

    static async actualizarCarro(req, res) {

        try {

            const carro = await service.actualizarCarro(
                req.params.id,
                req.body
            );

            if (!carro) {

                return res.status(404).json({
                    mensaje: "Carro no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: carro actualizado",
                carro
            });

        } catch (error) {

            console.error(error);

            res.status(400).json({
                mensaje: error.message
            });
        }
    }

    static async eliminarCarro(req, res) {

        try {

            const carro = await service.eliminarCarro(
                req.params.id
            );

            if (!carro) {

                return res.status(404).json({
                    mensaje: "Carro no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: carro eliminado",
                carro
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error eliminando carro en MongoDB"
            });
        }
    }

    static async obtenerMotorLazy(req, res) {

        try {

            // CARGA LAZY: el motor se consulta únicamente cuando el usuario lo solicita.
            const motor = await service.buscarMotorPorCodigo(
                req.params.codigoMotor
            );

            if (!motor) {

                return res.status(404).json({
                    mensaje: "Motor no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: motor cargado bajo demanda",
                motor
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error consultando motor en MongoDB"
            });
        }
    }

    static async obtenerCarrosLazy(req, res) {

        try {

            // CARGA LAZY: los carros asociados se consultan únicamente cuando el usuario los solicita.
            const carros = await service.buscarCarrosPorMotor(
                req.params.codigoMotor
            );

            res.json({
                mensaje: "MongoDB: carros cargados bajo demanda",
                carros
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error consultando carros asociados en MongoDB"
            });
        }
    }

    static async crearMotor(req, res) {

        try {

            const motor = await service.insertarMotor(req.body);

            res.status(201).json({
                mensaje: "MongoDB: motor creado",
                motor
            });

        } catch (error) {

            console.error(error);

            res.status(400).json({
                mensaje: error.message
            });
        }
    }

    static async obtenerMotores(req, res) {

        try {

            const motores = await service.listarMotores();

            res.json({
                mensaje: "MongoDB: consulta de motores realizada",
                motores
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error consultando motores en MongoDB"
            });
        }
    }

    static async obtenerMotor(req, res) {

        try {

            const motor = await service.buscarMotor(
                req.params.id
            );

            if (!motor) {

                return res.status(404).json({
                    mensaje: "Motor no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: motor encontrado",
                motor
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error consultando motor en MongoDB"
            });
        }
    }

    static async actualizarMotor(req, res) {

        try {

            const motor = await service.actualizarMotor(
                req.params.id,
                req.body
            );

            if (!motor) {

                return res.status(404).json({
                    mensaje: "Motor no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: motor actualizado",
                motor
            });

        } catch (error) {

            console.error(error);

            res.status(400).json({
                mensaje: error.message
            });
        }
    }

    static async eliminarMotor(req, res) {

        try {

            const motor = await service.eliminarMotor(
                req.params.id
            );

            if (!motor) {

                return res.status(404).json({
                    mensaje: "Motor no encontrado en MongoDB"
                });
            }

            res.json({
                mensaje: "MongoDB: motor eliminado",
                motor
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                mensaje: "Error eliminando motor en MongoDB"
            });
        }
    }
}

module.exports = MongoController;
