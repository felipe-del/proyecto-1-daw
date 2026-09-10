const express = require("express");

const router = express.Router();

const CarroMotorController =
require("../controllers/carroMotorController");

const path = require("path");
const AuthService = require("../services/authService");
const LogDAO = require("../dao/logDAO");

function verificarAcceso(req, res, next) {
    if (!AuthService.estaAutenticado()) {
        LogDAO.registrar("Intento de acceso sin autenticación", "SIN_AUTENTICAR");
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    let accion = "Operación PostgreSQL";
    if (req.path === "/postgres/carros-eager") accion = "Carga Eager carros y motores";
    else if (req.path === "/postgres/motores" && req.method === "GET") accion = "Listar motores PostgreSQL";
    else if (req.path === "/postgres/carros" && req.method === "GET") accion = "Listar carros PostgreSQL";
    else if (req.path.includes("/postgres/motores") && req.method === "GET") accion = "Consultar motor PostgreSQL";
    else if (req.path.includes("/postgres/carros") && req.method === "GET") accion = "Consultar carro PostgreSQL";
    else if (req.path.includes("/postgres/motores") && req.method === "POST") accion = "Guardar motor PostgreSQL";
    else if (req.path.includes("/postgres/motores") && req.method === "PUT") accion = "Modificar motor PostgreSQL";
    else if (req.path.includes("/postgres/motores") && req.method === "DELETE") accion = "Eliminar motor PostgreSQL";
    else if (req.path.includes("/postgres/carros") && req.method === "POST") accion = "Guardar carro PostgreSQL";
    else if (req.path.includes("/postgres/carros") && req.method === "PUT") accion = "Modificar carro PostgreSQL";
    else if (req.path.includes("/postgres/carros") && req.method === "DELETE") accion = "Eliminar carro PostgreSQL";
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
Mostrar página PostgreSQL
==================================
*/

router.get(
    "/carro-motor/pagina",
    (req,res,next)=> AuthService.estaAutenticado() ? next() : res.redirect("/"),
    (req,res)=>{

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "views",
                "carroMotor.html"
            )
        );

    }
);


/*
==================================
Motores
==================================
*/

router.get("/postgres/motores", verificarAcceso, CarroMotorController.obtenerMotores);
router.get("/postgres/motores/:id", verificarAcceso, CarroMotorController.obtenerMotor);
router.post("/postgres/motores", verificarAcceso, CarroMotorController.crearMotor);
router.put("/postgres/motores/:id", verificarAcceso, CarroMotorController.actualizarMotor);
router.delete("/postgres/motores/:id", verificarAcceso, CarroMotorController.eliminarMotor);


/*
==================================
Carros
==================================
*/

router.get("/postgres/carros", verificarAcceso, CarroMotorController.obtenerCarros);
router.get("/postgres/carros/:id", verificarAcceso, CarroMotorController.obtenerCarro);
router.post("/postgres/carros", verificarAcceso, CarroMotorController.crearCarro);
router.put("/postgres/carros/:id", verificarAcceso, CarroMotorController.actualizarCarro);
router.delete("/postgres/carros/:id", verificarAcceso, CarroMotorController.eliminarCarro);


/*
==================================
Carga Eager
==================================
*/

router.get("/postgres/carros-eager", verificarAcceso, CarroMotorController.obtenerCarrosEager);


module.exports = router;
