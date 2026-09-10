const CarroService = require("../services/carroService");

/*=========================================
  Listar carros
=========================================*/

function listar(req, res) {

    try {

        const carros = CarroService.listar();

        res.json(carros);

    }
    catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Buscar carro
=========================================*/

function buscar(req, res) {

    try {

        const codigo = req.params.codigo;

        const carro =
            CarroService.buscarPorCodigo(codigo);

        if (!carro) {

            return res.status(404).json({

                mensaje: "Carro no encontrado."

            });

        }

        res.json(carro);

    }
    catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Guardar carro
=========================================*/

function guardar(req, res) {

    try {

        const carro = {

            codigo: req.body.codigo,
            nombre: req.body.nombre,
            marca: req.body.marca,
            categoria: req.body.categoria,
            velocidadMaxima:
                req.body.velocidadMaxima === ""
                    ? NaN
                    : Number(req.body.velocidadMaxima)

        };

        CarroService.guardar(carro);

        res.status(201).json({

            mensaje: "Carro guardado correctamente."

        });

    }
    catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Modificar carro
=========================================*/

function modificar(req, res) {

    try {

        const carro = {

            codigo: req.body.codigo,
            nombre: req.body.nombre,
            marca: req.body.marca,
            categoria: req.body.categoria,
            velocidadMaxima:
                req.body.velocidadMaxima === ""
                    ? NaN
                    : Number(req.body.velocidadMaxima)

        };

        CarroService.modificar(carro);

        res.json({

            mensaje: "Carro modificado correctamente."

        });

    }
    catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

}

/*=========================================
  Eliminar carro
=========================================*/

function eliminar(req, res) {

    try {

        const codigo = req.params.codigo;

        CarroService.eliminar(codigo);

        res.json({

            mensaje: "Carro eliminado correctamente."

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
