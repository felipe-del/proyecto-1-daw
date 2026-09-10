const express = require("express");

const router = express.Router();

const CarroController =
require("../controllers/carroController");


const path = require("path");
const AuthService = require("../services/authService");
const LogDAO = require("../dao/logDAO");

function verificarAcceso(req, res, next) {
    if (!AuthService.estaAutenticado()) {
        LogDAO.registrar("Intento de acceso sin autenticación", "SIN_AUTENTICAR");
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    let accion = "Operación carros TXT";
    if (req.method === "GET" && req.path === "/carros") accion = "Listar carros TXT";
    if (req.method === "GET" && req.params.codigo) accion = "Consultar carro TXT";
    if (req.method === "POST") accion = "Guardar carro TXT";
    if (req.method === "PUT") accion = "Modificar carro TXT";
    if (req.method === "DELETE") accion = "Eliminar carro TXT";
    LogDAO.registrar(accion, AuthService.obtenerUsuarioActual());
    const responder = res.status.bind(res);
    res.status = codigo => {
        if (codigo >= 400) LogDAO.registrar("Error HTTP " + codigo + " " + req.path, AuthService.obtenerUsuarioActual());
        return responder(codigo);
    };
    next();
}


/*
==================================
Mostrar página CRUD
==================================
*/

router.get(
    "/carros/pagina",
    (req,res,next)=> AuthService.estaAutenticado() ? next() : res.redirect("/"),
    (req,res)=>{

        res.sendFile(

            path.join(

                __dirname,

                "..",

                "views",

                "carros.html"

            )

        );

    }
);


/*
==================================
Consultar carros
==================================
*/

router.get(
    "/carros",
    verificarAcceso,
    CarroController.listar
);


/*
==================================
Consultar carro
==================================
*/

router.get(
    "/carros/:codigo",
    verificarAcceso,
    CarroController.buscar
);


/*
==================================
Crear carro
==================================
*/

router.post(
    "/carros",
    verificarAcceso,
    CarroController.guardar
);


/*
==================================
Modificar carro
==================================
*/

router.put(
    "/carros",
    verificarAcceso,
    CarroController.modificar
);


/*
==================================
Eliminar carro
==================================
*/

router.delete(
    "/carros/:codigo",
    verificarAcceso,
    CarroController.eliminar
);


module.exports = router;
