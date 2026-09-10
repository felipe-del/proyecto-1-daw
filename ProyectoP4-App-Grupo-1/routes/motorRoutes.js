const express = require("express");

const router = express.Router();

const MotorController =
require("../controllers/motorController");


const path = require("path");
const AuthService = require("../services/authService");
const LogDAO = require("../dao/logDAO");

function verificarAcceso(req, res, next) {
    if (!AuthService.estaAutenticado()) {
        LogDAO.registrar("Intento de acceso sin autenticación", "SIN_AUTENTICAR");
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    let accion = "Operación motores TXT";
    if (req.method === "GET" && req.path === "/motores") accion = "Listar motores TXT";
    if (req.method === "GET" && req.params.codigo) accion = "Consultar motor TXT";
    if (req.method === "POST") accion = "Guardar motor TXT";
    if (req.method === "PUT") accion = "Modificar motor TXT";
    if (req.method === "DELETE") accion = "Eliminar motor TXT";
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
    "/motores/pagina",
    (req,res,next)=> AuthService.estaAutenticado() ? next() : res.redirect("/"),
    (req,res)=>{

        res.sendFile(

            path.join(

                __dirname,

                "..",

                "views",

                "motores.html"

            )

        );

    }
);


/*
==================================
Consultar motores
==================================
*/

router.get(
    "/motores",
    verificarAcceso,
    MotorController.listar
);


/*
==================================
Consultar motor
==================================
*/

router.get(
    "/motores/:codigo",
    verificarAcceso,
    MotorController.buscar
);


/*
==================================
Crear motor
==================================
*/

router.post(
    "/motores",
    verificarAcceso,
    MotorController.guardar
);


/*
==================================
Modificar motor
==================================
*/

router.put(
    "/motores",
    verificarAcceso,
    MotorController.modificar
);


/*
==================================
Eliminar motor
==================================
*/

router.delete(
    "/motores/:codigo",
    verificarAcceso,
    MotorController.eliminar
);


module.exports = router;
