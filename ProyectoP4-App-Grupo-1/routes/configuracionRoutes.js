const express = require("express");

const router = express.Router();

const ConfiguracionController =
require("../controllers/configuracionController");

const path = require("path");
const AuthService = require("../services/authService");
const LogDAO = require("../dao/logDAO");

function verificarAcceso(req, res, next) {
    if (!AuthService.estaAutenticado()) {
        LogDAO.registrar("Intento de acceso sin autenticación", "SIN_AUTENTICAR");
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    let accion = "Operación PostgreSQL";
    if (req.path === "/postgres/configuraciones-eager") accion = "Carga Eager configuraciones y especificaciones";
    else if (req.path === "/postgres/especificaciones" && req.method === "GET") accion = "Listar especificaciones PostgreSQL";
    else if (req.path === "/postgres/configuraciones" && req.method === "GET") accion = "Listar configuraciones PostgreSQL";
    else if (req.path.includes("/postgres/especificaciones") && req.method === "GET") accion = "Consultar especificación PostgreSQL";
    else if (req.path.includes("/postgres/configuraciones") && req.method === "GET") accion = "Consultar configuración PostgreSQL";
    else if (req.path.includes("/postgres/especificaciones") && req.method === "POST") accion = "Guardar especificación PostgreSQL";
    else if (req.path.includes("/postgres/especificaciones") && req.method === "PUT") accion = "Modificar especificación PostgreSQL";
    else if (req.path.includes("/postgres/especificaciones") && req.method === "DELETE") accion = "Eliminar especificación PostgreSQL";
    else if (req.path.includes("/postgres/configuraciones") && req.method === "POST") accion = "Guardar configuración PostgreSQL";
    else if (req.path.includes("/postgres/configuraciones") && req.method === "PUT") accion = "Modificar configuración PostgreSQL";
    else if (req.path.includes("/postgres/configuraciones") && req.method === "DELETE") accion = "Eliminar configuración PostgreSQL";
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
    "/configuracion/pagina",
    (req,res,next)=> AuthService.estaAutenticado() ? next() : res.redirect("/"),
    (req,res)=>{

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "views",
                "configuracion.html"
            )
        );

    }
);


/*
==================================
Especificaciones
==================================
*/

router.get("/postgres/especificaciones", verificarAcceso, ConfiguracionController.obtenerEspecificaciones);
router.get("/postgres/especificaciones/:id", verificarAcceso, ConfiguracionController.obtenerEspecificacion);
router.post("/postgres/especificaciones", verificarAcceso, ConfiguracionController.crearEspecificacion);
router.put("/postgres/especificaciones/:id", verificarAcceso, ConfiguracionController.actualizarEspecificacion);
router.delete("/postgres/especificaciones/:id", verificarAcceso, ConfiguracionController.eliminarEspecificacion);


/*
==================================
Configuraciones
==================================
*/

router.get("/postgres/configuraciones", verificarAcceso, ConfiguracionController.obtenerConfiguraciones);
router.get("/postgres/configuraciones/:id", verificarAcceso, ConfiguracionController.obtenerConfiguracion);
router.post("/postgres/configuraciones", verificarAcceso, ConfiguracionController.crearConfiguracion);
router.put("/postgres/configuraciones/:id", verificarAcceso, ConfiguracionController.actualizarConfiguracion);
router.delete("/postgres/configuraciones/:id", verificarAcceso, ConfiguracionController.eliminarConfiguracion);


/*
==================================
Carga Eager
==================================
*/

router.get("/postgres/configuraciones-eager", verificarAcceso, ConfiguracionController.obtenerConfiguracionesEager);


module.exports = router;
