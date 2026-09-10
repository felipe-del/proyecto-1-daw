const express = require("express");

const router = express.Router();

const MongoController =
    require("../controllers/mongoController");

const path = require("path");
const AuthService = require("../services/authService");
const LogDAO = require("../dao/logDAO");

function verificarAcceso(req, res, next) {
    if (!AuthService.estaAutenticado()) {
        LogDAO.registrar("Intento de acceso sin autenticación", "SIN_AUTENTICAR");
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    let accion = "Operación MongoDB";
    if (req.path.includes("/motor/") && req.path.includes("/mongo/carros/")) accion = "Carga Lazy motor";
    else if (req.path.includes("/mongo/motores/") && req.path.endsWith("/carros")) accion = "Carga Lazy carros asociados al motor";
    else if (req.path === "/mongo/carros" && req.method === "GET") accion = "Listar carros MongoDB";
    else if (req.path === "/mongo/motores" && req.method === "GET") accion = "Listar motores MongoDB";
    else if (req.path.includes("/mongo/carros") && req.method === "GET") accion = "Consultar carro MongoDB";
    else if (req.path.includes("/mongo/motores") && req.method === "GET") accion = "Consultar motor MongoDB";
    else if (req.path.includes("/mongo/carros") && req.method === "POST") accion = "Guardar carro MongoDB";
    else if (req.path.includes("/mongo/carros") && req.method === "PUT") accion = "Modificar carro MongoDB";
    else if (req.path.includes("/mongo/carros") && req.method === "DELETE") accion = "Eliminar carro MongoDB";
    else if (req.path.includes("/mongo/motores") && req.method === "POST") accion = "Guardar motor MongoDB";
    else if (req.path.includes("/mongo/motores") && req.method === "PUT") accion = "Modificar motor MongoDB";
    else if (req.path.includes("/mongo/motores") && req.method === "DELETE") accion = "Eliminar motor MongoDB";
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
Mostrar página de carros
==================================
*/

router.get(
    "/mongo/carros/pagina",
    (req,res,next)=> AuthService.estaAutenticado() ? next() : res.redirect("/"),
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "views",
                "mongoCarros.html"
            )
        );
    }
);


/*
==================================
Mostrar página de motores
==================================
*/

router.get(
    "/mongo/motores/pagina",
    (req,res,next)=> AuthService.estaAutenticado() ? next() : res.redirect("/"),
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "views",
                "mongoMotores.html"
            )
        );
    }
);


/*
==================================
Carros MongoDB
==================================
*/

router.get("/mongo/carros", verificarAcceso, MongoController.obtenerCarros);
router.post("/mongo/carros", verificarAcceso, MongoController.crearCarro);

// CARGA LAZY: esta ruta específica va antes de /:id.
router.get(
    "/mongo/carros/:id/motor/:codigoMotor",
    verificarAcceso,
    MongoController.obtenerMotorLazy
);

router.get("/mongo/carros/:id", verificarAcceso, MongoController.obtenerCarro);
router.put("/mongo/carros/:id", verificarAcceso, MongoController.actualizarCarro);
router.delete("/mongo/carros/:id", verificarAcceso, MongoController.eliminarCarro);


/*
==================================
Motores MongoDB
==================================
*/

router.get("/mongo/motores", verificarAcceso, MongoController.obtenerMotores);
router.post("/mongo/motores", verificarAcceso, MongoController.crearMotor);
router.get("/mongo/motores/:codigoMotor/carros", verificarAcceso, MongoController.obtenerCarrosLazy);
router.get("/mongo/motores/:id", verificarAcceso, MongoController.obtenerMotor);
router.put("/mongo/motores/:id", verificarAcceso, MongoController.actualizarMotor);
router.delete("/mongo/motores/:id", verificarAcceso, MongoController.eliminarMotor);


module.exports = router;
