const express = require("express");

const router = express.Router();

const AuthController =
require("../controllers/authController");


const path = require("path");


/*
==================================
Mostrar página de login
==================================
*/

router.get(
    "/",
    AuthController.mostrarLogin
);


/*
==================================
Procesar login
==================================
*/

router.post(
    "/login",
    AuthController.iniciarSesion
);

router.get(
    "/menu",
    AuthController.mostrarMenu
);


/*
==================================
Cerrar sesión
==================================
*/

router.get(
    "/logout",
    AuthController.cerrarSesion
);


module.exports = router;
